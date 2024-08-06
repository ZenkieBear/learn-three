import * as THREE from 'three'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

/* all our JavaScript code goes here */
// Initialize the Canvas
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(0xdddddd, 1)
document.body.appendChild(renderer.domElement)

// Make a scene
const scene = new THREE.Scene()

// Add a camera
// The first parameter is Field Of View(FOV)
// Second parameter is Aspect Ratio
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT)
camera.position.z = 50
scene.add(camera)

// Geometry
const boxGeometry = new THREE.BoxGeometry(10, 10, 10)

// Material
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x0095dd })

// Mesh binds shape and material
const cube = new THREE.Mesh(boxGeometry, basicMaterial)
scene.add(cube)
cube.rotation.set(0.4, 0.2, 0)
cube.position.x = -25

// More shapes and materials
// torus
const torusGeometry = new THREE.TorusGeometry(7, 1, 2, 12)
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xff9500 })
const torus = new THREE.Mesh(torusGeometry, phongMaterial)
scene.add(torus)

// dodecahedron
const dodecahedronGeometry = new THREE.DodecahedronGeometry(7)
const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xeaeff2 })
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, lambertMaterial)
dodecahedron.position.x = 25
scene.add(dodecahedron)

// Lights
const light = new THREE.PointLight(0xffffff, 10000)
light.position.set(-10, 15, 50)
scene.add(light)

// Rendering
let t = 0
function render() {
  requestAnimationFrame(render)
  t += 0.01
  torus.scale.y = Math.abs(Math.sin(t))
  dodecahedron.position.y = 20 * Math.sin(t * 2)
  animate()
  renderer.render(scene, camera)
}
render()

// Animation
function animate() {
  if (!boxGeometry) return
  cube.rotation.y += 0.01
}
