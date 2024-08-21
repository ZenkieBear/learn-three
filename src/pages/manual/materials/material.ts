import GridLayout from '@/lib/grid'
import { initial } from '@/lib/initial'
import { useMenu } from '@/lib/menu'
import GUI from 'lil-gui'
import {
  DirectionalLight,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  SphereGeometry,
  TorusKnotGeometry
} from 'three'

type ObjectType = Mesh | LineSegments | Object3D

useMenu()
const world = initial()
const { renderer, camera, scene } = world
renderer.setClearColor(0x000000)
camera.position.z = 100
camera.lookAt(0, 0, 0)
camera.fov = 50

const gui = new GUI()

const gridLayout = new GridLayout<ObjectType>({})
const objects = gridLayout.objects

function addGeometry(obj: Mesh) {
  objects.push(obj)
  scene.add(obj)
  syncPositions()
}

function syncPositions() {
  objects.forEach((obj, idx) => {
    const { posX, posY } = gridLayout.computePosition(idx)
    obj.position.x = posX
    obj.position.y = posY
  })
}

// Lights
const light = new DirectionalLight(0xffffff, 6)
const light2 = new DirectionalLight(0xffffff, 1)

const lightRange = 20
light.position.set(-lightRange, lightRange, 30)
light2.position.set(lightRange, -lightRange, 30)
scene.add(light, light2)

const lightsGui = gui.addFolder('Lights')
const light1Gui = lightsGui.addFolder('Light 1')
light1Gui.add(light.position, 'x', -lightRange, lightRange)
light1Gui.add(light.position, 'y', -lightRange, lightRange)
const light2Gui = lightsGui.addFolder('Light 2')
light2Gui.add(light2.position, 'x', -lightRange, lightRange)
light2Gui.add(light2.position, 'y', -lightRange, lightRange)

// Animation
world.setAnimate((t) => {
  objects.forEach((obj, idx) => {
    obj.rotation.x = t * idx * 0.2
    obj.rotation.y = t * idx * 0.2
  })
})

// Basic, Lambert, Phong
const geometry = new SphereGeometry(5)
{
  const material = new MeshBasicMaterial({
    color: 0x0000ff
  })
  const sphere = new Mesh(geometry, material)
  addGeometry(sphere)
}
{
  const material = new MeshLambertMaterial({
    color: 0x0000ff
  })
  const sphere = new Mesh(geometry, material)
  addGeometry(sphere)
}
{
  const material = new MeshPhongMaterial({
    color: 0x0000ff,
    shininess: 80
  })
  const sphere = new Mesh(geometry, material)
  addGeometry(sphere)

  const folder = gui.addFolder('Phong Material')
  folder.add(material, 'shininess', 0, 150)
}
// Toon
{
  const material = new MeshToonMaterial({
    color: 0x0000af
  })
  addGeometry(new Mesh(geometry, material))
}

// Physicals
{
  const material = new MeshStandardMaterial({
    color: 0x0000ff,
    roughness: 0.4,
    metalness: 0.5
  })
  addGeometry(new Mesh(geometry, material))

  const folder = gui.addFolder('Standard Material')
  folder.add(material, 'roughness', 0, 1)
  folder.add(material, 'metalness', 0, 1)
}
{
  const material = new MeshPhysicalMaterial({
    color: 0x0000ff,
    roughness: 0.4,
    metalness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.15
  })
  addGeometry(new Mesh(geometry, material))

  const folder = gui.addFolder('Physical Material')
  folder.add(material, 'roughness', 0, 1)
  folder.add(material, 'metalness', 0, 1)
  const coatGui = folder.addFolder('Clear Coat')
  coatGui.add(material, 'clearcoat', 0, 1)
  coatGui.add(material, 'clearcoatRoughness', 0, 1)
}
// Normal Material
{
  const geometry = new TorusKnotGeometry(3, 0.8, 100, 10, 3, 2)
  const material = new MeshNormalMaterial()
  addGeometry(new Mesh(geometry, material))
}
