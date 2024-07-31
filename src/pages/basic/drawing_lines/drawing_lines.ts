import * as Three from 'three'

// Basic environment
const renderer = new Three.WebGLRenderer()
renderer.setClearColor(0xffffff)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
camera.position.set(30, 30, 30)
camera.lookAt(0, 0, 0)

const scene = new Three.Scene();

// Let's start
const material = new Three.LineBasicMaterial({ color: 0x999999 })

function drawLine(v1, v2, material) {
  const geometry = new Three.BufferGeometry().setFromPoints([v1, v2])
  const line = new Three.Line(geometry, material)
  scene.add(line)
}

const gap = 5
function drawGrid(dividers = 2, plusLength = gap) {
  const length = 2 * (dividers - 1) * gap + plusLength

  // Central lines
  // x
  drawLine(
    new Three.Vector3(-.5 * length, 0),
    new Three.Vector3(.5 * length, 0), 
    new Three.LineBasicMaterial({ color: 0xff0000 })
  )
  // y
  drawLine(
    new Three.Vector3(0, -.5 * length, 0),
    new Three.Vector3(0, .5 * length, 0),
    new Three.LineBasicMaterial({ color: 0x00ff00 })
  )
  // z
  drawLine(
    new Three.Vector3(0, 0, -.5 * length),
    new Three.Vector3(0, 0, .5 * length),
    new Three.LineBasicMaterial({ color: 0x0000ff })
  )

  for (let i = 1; i < dividers; i++) {
  // for (let i = 1; i < 0; i++) {
    // x lines
    drawLine(new Three.Vector3(-.5 * length,  - gap * i, 0),
      new Three.Vector3(.5 * length,  -gap * i, 0),
      material)
    drawLine(new Three.Vector3(-.5 * length,  gap * i, 0),
      new Three.Vector3(.5 * length,  gap * i, 0),
      material)

    // y lines
    drawLine(new Three.Vector3(- gap * i,  -.5 * length, 0),
      new Three.Vector3(-gap * i, .5 * length, 0),
      material)
    drawLine(new Three.Vector3(gap * i, -.5 * length, 0),
      new Three.Vector3(gap * i, .5 * length, 0),
      material)

    // z lines
    drawLine(new Three.Vector3(0, - gap * i,  -.5 * length),
      new Three.Vector3(0, -gap * i, .5 * length),
      material)
    drawLine(new Three.Vector3(0, gap * i, -.5 * length),
      new Three.Vector3(0, gap * i, .5 * length),
      material)

    // zy crossing-lines
    drawLine(new Three.Vector3(0,  -.5 * length, - gap * i),
      new Three.Vector3(0, .5 * length, -gap * i),
      material)
    drawLine(new Three.Vector3(0, -.5 * length, gap * i),
      new Three.Vector3(0, .5 * length, gap * i),
      material)
  }
}
drawGrid(50)

// Central ball
const sphereGeometry = new Three.SphereGeometry(.5, 16, 16)
const sphere = new Three.Mesh(
  sphereGeometry,
  new Three.MeshPhongMaterial({ color: 0x999999 }))
scene.add(sphere)

// Light
const light = new Three.PointLight(0xffffff, 50000, 10000)
light.position.set(50, 50, 50)
scene.add(light)

// Tracking ball
const trackBall = new Three.Mesh(new Three.SphereGeometry(1, 16, 16),
  new Three.MeshLambertMaterial({ color: 0xffff00 }))
scene.add(trackBall)

// Animation
function animation(t) {
  const trackballDistance = 20
  // Track ball's moving strategy
  trackBall.position.x = Math.sin(t) * trackballDistance
  trackBall.position.y = Math.cos(t) * trackballDistance * .5
  trackBall.position.z = Math.cos(t) * trackballDistance

  // Camera's moving strategy
  const cameraDistance = trackballDistance * 3
  const cameraDelay = .8
  camera.position.x = Math.sin(t * cameraDelay) * cameraDistance
  camera.position.z = Math.cos(t * cameraDelay) * cameraDistance
  // camera.position.set(
  //   Math.sin(t) * distance2Central,
  //   Math.cos(t) * distance2Central,
  //   Math.cos(t) * distance2Central
  // )

  camera.lookAt(0, 0, 0)
}

// Rendering
let t = 0
function render() {
  requestAnimationFrame(render)
  t += 0.005

  animation(t)

  renderer.render(scene, camera)
}
render()
