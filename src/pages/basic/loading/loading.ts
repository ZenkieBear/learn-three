import { Box3, PointLight, Vector3 } from 'three'
import { initial } from '@/lib/initial'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const world = initial()
const { scene, camera, renderer } = world
renderer.setClearColor(0x000000)

// Loading object
const loader = new GLTFLoader()
let model
loader.load(
  '/model/MagicCube.glb',
  function (m) {
    scene.add((model = m.scene))
  },
  undefined,
  function (error) {
    console.error(error)
  }
)

// Lights
const light = new PointLight(0xffffff, 40000)
light.position.set(50, 50, 50)
scene.add(light)
const light1 = new PointLight(0xffffff, 40000)
light1.position.set(-50, -50, -50)
scene.add(light1)

// Adding animate
world.setAnimate((t) => {
  // Scale and follow the object
  if (model) {
    // Create bounding box
    const boundingBox = new Box3().setFromObject(model)
    const size = new Vector3()
    boundingBox.getSize(size)

    // Get central
    const center = new Vector3()
    boundingBox.getCenter(center)

    // Set camera position
    const cameraDistance = size.length() * 3
    // console.log(size.length());
    camera.position.set(
      center.x + Math.sin(t) * cameraDistance,
      center.y + Math.sin(t) * cameraDistance * 0.5,
      center.z + Math.cos(t) * cameraDistance
    )
    camera.near = 0.1
    camera.far = cameraDistance * 10

    // Scaling model
    const scale = cameraDistance / size.length()
    model.scale.set(scale, scale, scale)

    camera.lookAt(center)
  } else {
    camera.lookAt(0, 0, 0)
  }
})
