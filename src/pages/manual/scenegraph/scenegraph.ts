import { initial } from '@/lib/initial'
import { useMenu } from '@/lib/menu'
import * as Three from 'three'
import GUI from 'lil-gui'

// Types
class AxisGridHelper {
  private grid: Three.GridHelper
  private axes: Three.AxesHelper
  private _visible: boolean

  constructor(node: Three.Object3D, units = 10) {
    const axes = new Three.AxesHelper()
    const material = axes.material as Three.Material
    material.depthTest = false
    axes.renderOrder = 2 // render after grids
    node.add(axes)

    const grid = new Three.GridHelper(units, units)
    const gridMaterial = grid.material as Three.Material
    gridMaterial.depthTest = false
    grid.renderOrder = 1
    node.add(grid)

    this.grid = grid
    this.axes = axes
    this.visible = false
  }

  get visible() {
    return this._visible
  }

  set visible(v) {
    this._visible = v
    this.grid.visible = v
    this.axes.visible = v
  }
}

useMenu()
const world = initial()
const { scene, camera, renderer } = world
renderer.setClearColor(0x000000)

const objects = []

// Reusable sphere geometry
const sphereGeometry = new Three.SphereGeometry(1, 6, 6)

// Solar system
const solarSystem = new Three.Object3D()
scene.add(solarSystem)
objects.push(solarSystem)

// Sun
const sunMaterial = new Three.MeshPhongMaterial({ emissive: 0xffff00 })
const sun = new Three.Mesh(sphereGeometry, sunMaterial)
sun.scale.set(5, 5, 5)
solarSystem.add(sun)
objects.push(sun)

// Light
{
  scene.add(new Three.PointLight(0xffffff, 500))
}

// Setting camera
camera.position.set(0, 50, 0)
camera.up.set(0, 0, 1) // todo can't understand
camera.lookAt(0, 0, 0)

// Animation
world.setAnimate((t) => {
  objects.map((obj) => {
    obj.rotation.y = t
  })
})

// Earth and its orbit
const earthOrbit = new Three.Object3D()
earthOrbit.position.x = 10
solarSystem.add(earthOrbit)
objects.push(earthOrbit)

const earthMaterial = new Three.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244
})
const earth = new Three.Mesh(sphereGeometry, earthMaterial)
earthOrbit.add(earth)
objects.push(earth)

// Moon and its orbit
const moonOrbit = new Three.Object3D()
moonOrbit.position.x = 2
earthOrbit.add(moonOrbit)

const moonMaterial = new Three.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
const moon = new Three.Mesh(sphereGeometry, moonMaterial)
moon.scale.set(0.5, 0.5, 0.5)
moonOrbit.add(moon)
objects.push(moon)

// Add AxesHelper for each objects
const gui = new GUI()
function makeAxisGrid(node: Three.Object3D, label: string, units?: number) {
  const helper = new AxisGridHelper(node, units)
  gui.add(helper, 'visible').name(label)
}

makeAxisGrid(solarSystem, 'Solar system', 25)
makeAxisGrid(sun, 'Sun')
makeAxisGrid(earthOrbit, "Earth's orbit")
makeAxisGrid(earth, 'Earth')
makeAxisGrid(moonOrbit, "Moon's orbit")
makeAxisGrid(moon, 'Moon')
