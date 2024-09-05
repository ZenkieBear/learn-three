import { initial } from '@/lib/initial'
import { useMenu } from '@/lib/menu'
import GUI from 'lil-gui'
import * as Three from 'three'
import {
  OrbitControls,
  RectAreaLightHelper,
  RectAreaLightUniformsLib
} from 'three/examples/jsm/Addons.js'
import { ColorGUIHelper, DegRadHelper } from '@/lib/helper'
import { PhysicalLightingModel } from 'three/webgpu'

// Business
useMenu()
const world = initial()
const { renderer, camera, scene } = world
renderer.setClearColor(0x000000)
camera.fov = 45
camera.far = 100
camera.position.set(0, 10, 20)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 5, 0)
controls.update()

RectAreaLightUniformsLib.init()

// Plane
const planeSize = 40
const loader = new Three.TextureLoader()
const texture = loader.load('/images/checker.png')
texture.wrapS = Three.RepeatWrapping
texture.wrapT = Three.RepeatWrapping
texture.magFilter = Three.NearestFilter
texture.colorSpace = Three.SRGBColorSpace
const repeats = planeSize / 2
texture.repeat.set(repeats, repeats)

const planeGeo = new Three.PlaneGeometry(planeSize, planeSize)
const planeMat = new Three.MeshPhongMaterial({
  map: texture,
  side: Three.DoubleSide
})
const mesh = new Three.Mesh(planeGeo, planeMat)
mesh.rotation.x = Math.PI * -0.5
scene.add(mesh)

// Geometries
// Box
{
  const cubeSize = 4
  const cubeGeo = new Three.BoxGeometry(cubeSize, cubeSize, cubeSize)
  const cubeMat = new Three.MeshPhongMaterial({ color: '#8AC' })
  const mesh = new Three.Mesh(cubeGeo, cubeMat)
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
  scene.add(mesh)
}
// Sphere
{
  const sphereRadius = 3
  const sphereWidthDivisions = 32
  const sphereHeightDivisions = 16
  const sphereGeo = new Three.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  )
  const sphereMat = new Three.MeshPhongMaterial({ color: '#CA8' })
  const mesh = new Three.Mesh(sphereGeo, sphereMat)
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
  scene.add(mesh)
}
// Cone
{
  const geo = new Three.ConeGeometry(4, 5, 3)
  const mat = new Three.MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.5
  })
  const cone = new Three.Mesh(geo, mat)
  cone.position.set(0, 2.5, -6)
  scene.add(cone)
}
// Torus
{
  const geo = new Three.TorusGeometry(1, 0.5)
  const material = new Three.MeshToonMaterial({ color: 0xffaaaa })
  const torus = new Three.Mesh(geo, material)
  torus.position.set(6, 0.5, -6.5)
  torus.rotation.x = 0.5 * Math.PI

  scene.add(torus)
}
// Cylinder
{
  const geo = new Three.CylinderGeometry(1, 1, 10)
  const material = new Three.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.5,
    roughness: 0
  })
  const cyliner = new Three.Mesh(geo, material)
  cyliner.position.set(0, 1, 5)
  cyliner.rotation.z = Three.MathUtils.degToRad(90)

  scene.add(cyliner)
}

// Ambient Light
const gui = new GUI()
{
  // const light = new Three.AmbientLight(0xffffff, 1)
  // scene.add(light)
  // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  // gui.add(light, 'intensity', 0, 2, 0.01)
}

// Hemisphere Light
{
  const light = new Three.HemisphereLight(0xb1e1ff, 0xff9ea3, 1)
  scene.add(light)

  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor')
  gui.add(light, 'intensity', 0, 2, 0.01)
}

function makeVector3GUI(gui: GUI, vector: Three.Vector3, name: string, onChangeFn: Function) {
  const folder = gui.addFolder(name)
  folder.add(vector, 'x', -10, 10).onChange(onChangeFn)
  folder.add(vector, 'y', 0, 10).onChange(onChangeFn)
  folder.add(vector, 'z', -10, 10).onChange(onChangeFn)
  folder.open()
}
// Directional Light
{
  const light = new Three.DirectionalLight(0xffffff, 1)
  light.position.set(0, 10, 0)
  light.target.position.set(-5, 0, 0)
  scene.add(light)
  scene.add(light.target)

  const lightHelper = new Three.DirectionalLightHelper(light)
  scene.add(lightHelper)

  const lightGui = gui.addFolder('Directional Light')

  const updateLight = () => {
    light.target.updateMatrixWorld()
    lightHelper.update()
  }

  makeVector3GUI(lightGui, light.position, 'position', updateLight)
  makeVector3GUI(lightGui, light.target.position, 'target', updateLight)
}

// Point Light
{
  const light = new Three.PointLight(0xffffff, 15, 5)
  light.position.set(0, 1.5, 0)
  scene.add(light)

  const lightHelper = new Three.PointLightHelper(light)
  scene.add(lightHelper)

  const lightGui = gui.addFolder('Point Light')

  const updateLight = () => {
    lightHelper.update()
  }

  lightGui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  lightGui.add(light, 'intensity', 0, 250, 0.01)
  lightGui.add(light, 'distance', 0, 40).onChange(updateLight)

  makeVector3GUI(lightGui, light.position, 'position', updateLight)
}

// Spot Light
{
  const light = new Three.SpotLight(0xffffff, 250, 40, (12 / 180) * Math.PI, 0)
  light.position.set(0, 10, 0)
  light.target.position.set(6, 0, -6.5)
  scene.add(light)
  scene.add(light.target)

  const helper = new Three.SpotLightHelper(light)
  scene.add(helper)

  const updateLight = () => {
    light.target.updateMatrixWorld()
    helper.update()
  }

  const lightGui = gui.addFolder('Spot Light')
  lightGui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  lightGui.add(light, 'intensity', 0, 250)
  lightGui.add(light, 'distance', 0, 40).onChange(updateLight)
  lightGui.add(light, 'penumbra', 0, 1)
  lightGui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight)
  makeVector3GUI(lightGui, light.position, 'position', updateLight)
  makeVector3GUI(lightGui, light.target.position, 'target', updateLight)
}

// Rectangle Area Light
{
  const light = new Three.RectAreaLight(0xffffff, 5, 12, 4)
  light.position.set(0, 10, 5)
  light.rotation.x = Three.MathUtils.degToRad(-90)
  scene.add(light)

  const helper = new RectAreaLightHelper(light)
  light.add(helper)

  const lightGui = gui.addFolder('Rectangle Area Light')
  lightGui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  lightGui.add(light, 'intensity', 0, 10, 0.01)
  lightGui.add(light, 'width', 0, 20)
  lightGui.add(light, 'height', 0, 20)
  lightGui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation')
  lightGui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation')
  lightGui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation')
}
