import { useMenu } from '@/lib/menu'
import * as Three from 'three'

function main() {
  const canvas = document.querySelector('#c')
  const renderer = new Three.WebGLRenderer({ antialias: true, canvas })

  const fov = 75 // Field of view
  const aspect = 2 // Default aspect
  const near = 0.1
  const far = 5
  const camera = new Three.PerspectiveCamera(fov, aspect, near, far)

  // Move camera back 2 units
  camera.position.z = 2

  const scene = new Three.Scene()

  // Create a geometry
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new Three.BoxGeometry(boxWidth, boxHeight, boxDepth)

  // Create a material
  // const material = new Three.MeshBasicMaterial({color: 0x44aa88});
  const material = new Three.MeshPhongMaterial({ color: 0x44aa88 })

  // Create a mesh to bind geometry and
  // eslint-disable-next-line
  const cube = new Three.Mesh(geometry, material)
  // scene.add(cube)

  function render(time: number) {
    time *= 0.001 // turn millisecond to second unit
    // cube.rotation.x = time
    // cube.rotation.y = time

    cubes.forEach((cube, idx) => {
      const speed = 1 + idx * 0.1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })

    // Responsive layouts
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)

  // Light
  {
    const color = 0xffffff
    const intensity = 3
    const light = new Three.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  function makeBoxMesh(geometry: Three.BoxGeometry, color: number, x: number) {
    const material = new Three.MeshPhongMaterial({ color })
    const cube = new Three.Mesh(geometry, material)

    scene.add(cube)

    cube.position.x = x

    return cube
  }

  const cubes = [
    makeBoxMesh(geometry, 0x44aa88, 0),
    makeBoxMesh(geometry, 0x8844aa, -2),
    makeBoxMesh(geometry, 0xaa8844, 2)
  ]

  // Responsive layouts
  function resizeRendererToDisplaySize(renderer: Three.WebGLRenderer): boolean {
    const canvas = renderer.domElement

    // const width = canvas.clientWidth
    // const height = canvas.clientHeight

    const pixelRatio = window.devicePixelRatio
    const width = Math.floor(canvas.clientWidth * pixelRatio)
    const height = Math.floor(canvas.clientHeight * pixelRatio)

    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }

    return needResize
  }
}

useMenu()
main()
