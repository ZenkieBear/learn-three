import * as Three from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { initial } from '@/lib/initial'

// Basic environment
const world = initial()
const { scene, camera } = world
camera.position.set(0, 0, 1500)
camera.lookAt(0, 0, 0)

scene.add(
  new Three.Mesh(
    new Three.SphereGeometry(0.5, 16, 16),
    new Three.MeshPhongMaterial({ color: 0x999999 })
  )
)

// Text
const loader = new FontLoader()
const font = loader.parse(helvetiker)
const geometry = new TextGeometry('Bonjour three.js!', {
  font,
  color: 0xff0000,
  size: 50,
  depth: 10,
  curveSegments: 144,
  bevelEnabled: true,
  bevelThickness: 5,
  bevelSize: 5,
  bevelSegments: 12
})
const text = new Three.Mesh(geometry, new Three.MeshPhongMaterial({ color: 0xff0000 }))
scene.add(text)

// Lights
const light = new Three.PointLight({ color: 0xffffff }, 100000, 2000)
light.position.set(250, 100, 100)
scene.add(light)

// Adding animate
world.setAnimate((t) => {
  const distance = 500
  camera.position.set(Math.sin(t) * distance, 250, Math.cos(t) * distance)
  camera.lookAt(250, 0, 0)
})
