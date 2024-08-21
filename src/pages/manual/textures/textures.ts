import { initial } from '@/lib/initial'
import GUI from 'lil-gui'
import * as Three from 'three'

class DegRadHelper {
  obj: any
  prop: string

  constructor(obj: object, prop: string) {
    this.obj = obj
    this.prop = prop
  }

  get value() {
    return Three.MathUtils.radToDeg(this.obj[this.prop])
  }

  set value(v) {
    this.obj[this.prop] = Three.MathUtils.degToRad(v)
  }
}

class String2NumberHelper {
  obj: any
  prop: string

  constructor(obj: any, prop: string) {
    this.obj = obj
    this.prop = prop
  }
  get value() {
    return this.obj[this.prop]
  }
  set value(v) {
    this.obj[this.prop] = parseFloat(v)
  }
}

const world = initial()
const { renderer, scene, camera } = world

renderer.setClearColor(0x000000)
camera.position.z = 50
camera.lookAt(0, 0, 0)

// Animation
const cubes: Three.Mesh[] = []
world.setAnimate((t) => {
  cubes.map((cube) => {
    cube.rotation.set(t, t, 0)
  })
})

// Loading and applying texture
const loader = new Three.TextureLoader()
const geometry = new Three.BoxGeometry(10, 10, 10)
const texture = loader.load('/images/wall.jpg')
texture.colorSpace = Three.SRGBColorSpace
const material = new Three.MeshBasicMaterial({
  map: texture
})
const cube = new Three.Mesh(geometry, material)
cube.position.set(-20, 0, 0)
scene.add(cube)
cubes.push(cube)

// Multiple materials
function loadColorTexture(path: string) {
  const texture = loader.load(path)
  texture.colorSpace = Three.SRGBColorSpace
  return texture
}
const materials = []
for (let i = 1; i <= 6; i++) {
  materials.push(
    new Three.MeshBasicMaterial({
      map: loadColorTexture(`/images/flower-${i}.jpg`)
    })
  )
}
const cube1 = new Three.Mesh(geometry, materials)
cube1.position.set(0, 0, 0)
scene.add(cube1)
cubes.push(cube1)

// Wait for texture loading
// To see the result, you need to enable low-speed mode in the devtools
loader.load('/images/wall.jpg', (texture) => {
  const cube = new Three.Mesh(
    geometry,
    new Three.MeshBasicMaterial({
      map: texture
    })
  )
  cube.position.set(20, 0, 0)
  scene.add(cube)
  cubes.push(cube)
})

// Wait multiple texture
const loadManager = new Three.LoadingManager()
const managedLoader = new Three.TextureLoader(loadManager)
const managedMaterials: Three.Material[] = []
for (let i = 1; i <= 6; i++) {
  managedMaterials.push(
    new Three.MeshBasicMaterial({
      map: managedLoader.load(`/images/flower-${i}.jpg`)
    })
  )
}

const loadingDom = document.querySelector<HTMLDivElement>('#loading')

loadManager.onLoad = () => {
  if (!loadingDom) return
  loadingDom.style.opacity = '0'
  setTimeout(() => {
    loadingDom.style.display = 'none'
  }, 400)

  const cube = new Three.Mesh(geometry, managedMaterials)
  cube.position.set(0, 15, -15)
  scene.add(cube)
  cubes.push(cube)
}
loadManager.onProgress = (_, loaded, total) => {
  if (!loadingDom) return
  const progress = loaded / total
  loadingDom.style.setProperty('--progress', `${progress}`)
}

// Repeat, offset, and rotation
function updateTexture() {
  texture.needsUpdate = true
}
const gui = new GUI()
const wrapModes = {
  ClampToEdgeWrapping: Three.ClampToEdgeWrapping,
  RepeatWrapping: Three.RepeatWrapping,
  MirroredRepeatWrapping: Three.MirroredRepeatWrapping
}
gui
  .add(new String2NumberHelper(texture, 'wrapS'), 'value', wrapModes)
  .name('texture.wrapS')
  .onChange(updateTexture)
gui
  .add(new String2NumberHelper(texture, 'wrapT'), 'value', wrapModes)
  .name('texture.wrapT')
  .onChange(updateTexture)
gui.add(texture.repeat, 'x', 0, 5, 0.01).name('texture.repeat.x')
gui.add(texture.repeat, 'y', 0, 5, 0.01).name('texture.repeat.y')
gui.add(texture.offset, 'x', -2, 2, 0.01).name('texture.offset.x')
gui.add(texture.offset, 'y', -2, 2, 0.01).name('texture.offset.y')
gui.add(texture.center, 'x', -0.5, 1.5, 0.01).name('texture.center.x')
gui.add(texture.center, 'y', -0.5, 1.5, 0.01).name('texture.center.y')
gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360)
