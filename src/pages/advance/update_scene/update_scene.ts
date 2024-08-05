import { initial } from '@/lib/initial'
import * as Three from 'three'

const world = initial()
const { scene, renderer, camera } = world
renderer.setClearColor(0x000000)
camera.position.set(0, 0, 1000)

const MAX_POINTS = 500

// Geometry
const geometry = new Three.BufferGeometry()

// Attributes
const positions = new Float32Array(MAX_POINTS * 3) // 3 vertices per point
geometry.setAttribute('position', new Three.BufferAttribute(positions, 3))

// Draw range
let drawCount = 2 // draw the first 2 points, only
geometry.setDrawRange(0, drawCount)

// Material
const material = new Three.LineBasicMaterial( { color: 0xffffff } );

// Line
const line = new Three.Line(geometry, material)
scene.add(line)

// Add points
const positionAttribute = line.geometry.getAttribute('position')

function updatePositions() {
  let x = 0, y = 0, z = 0

  for (let i = 0; i < positionAttribute.count; i++) {
    positionAttribute.setXYZ(i, x, y, z)

    x += (Math.random() - .5) * 30
    y += (Math.random() - .5) * 30
    z += (Math.random() - .5) * 30
  }
}
updatePositions()

// Update position after first rendering
world.setAnimate(() => {
  drawCount = (drawCount + 1) % MAX_POINTS

  // Change the draw-range
  line.geometry.setDrawRange(0, drawCount)


  if (drawCount === 0) {
    updatePositions()

    positionAttribute.needsUpdate = true    
  }
})

