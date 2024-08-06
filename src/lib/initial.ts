import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'

type AnimateFunc = (t: number) => void

export function initial() {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setClearColor(0xffffff)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)

  const scene = new Scene()

  let animate: AnimateFunc
  function setAnimate(fn: AnimateFunc) {
    animate = fn
  }

  let t = 0
  function render() {
    requestAnimationFrame(render)
    t += 0.01
    animate?.(t)
    renderer.render(scene, camera)
  }
  render()

  return { renderer, camera, scene, setAnimate }
}
