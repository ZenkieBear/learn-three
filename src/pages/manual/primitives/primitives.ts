import { initial } from '@/lib/initial'
import * as Three from 'three'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { useMenu } from '@/lib/menu'

async function main() {
  const world = initial()
  const { scene, camera } = world

  scene.background = new Three.Color(0xaaaaaa)
  camera.fov = 40
  camera.far = 1000
  camera.position.set(0, 0, 120)
  camera.lookAt(0, 0, 0)

  const objects = []

  function addObject(x, y, obj) {
    obj.position.x = x
    obj.position.y = y

    scene.add(obj)
    objects.push(obj)
  }

  function createMaterial() {
    const material = new Three.MeshPhongMaterial({
      side: Three.DoubleSide
    })

    const hue = Math.random()
    const saturate = 1
    const luiminace = 0.55
    material.color.setHSL(hue, saturate, luiminace)

    return material
  }

  function addSolidGeometry(x, y, geometry) {
    const mesh = new Three.Mesh(geometry, createMaterial())
    addObject(x, y, mesh)
  }

  function addLineGeometry(x, y, geometry) {
    const material = new Three.LineBasicMaterial({ color: 0x000000 })
    const mesh = new Three.LineSegments(geometry, material)
    addObject(x, y, mesh)
  }

  // Light
  {
    const color = 0xffffff
    const intensity = 3
    const light = new Three.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  world.setAnimate((t) => {
    objects.forEach((obj, idx) => {
      const speed = 0.1 + idx * 0.05
      const rot = t * speed
      obj.rotation.x = rot
      obj.rotation.y = rot
    })
  })

  // Grid layout
  const cols = 5
  const size = 8
  const gap = 8

  const generateGridPosition = (idx: number) => {
    const prevX = idx % cols
    const x = prevX === 0 ? 0 : prevX
    const y = Math.floor(idx / cols)

    const rows = Math.ceil(objects.length / cols)

    const offsetX = (cols * size + Math.max(cols - 1, 0) * gap) / 2
    const offsetY = (rows * size + Math.max(rows - 1, 0) * gap) / 2

    const posX = x * (size + gap) - offsetX
    const posY = -y * (size + gap) + offsetY
    return { posX, posY }
  }

  function adjustyGrid() {
    objects.forEach((obj, idx) => {
      const { posX, posY } = generateGridPosition(idx)
      obj.position.x = posX
      obj.position.y = posY
    })
  }

  function addGridGeometry(obj: Three.BufferGeometry | Three.Object3D) {
    addSolidGeometry(0, 0, obj)
    adjustyGrid()
  }

  {
    addGridGeometry(new Three.BoxGeometry(8, 8, 8))
    addGridGeometry(new Three.CircleGeometry(7, 24))
    addGridGeometry(new Three.ConeGeometry(6, 8, 16))
    addGridGeometry(new Three.CylinderGeometry(4, 4, 8))
    addGridGeometry(new Three.DodecahedronGeometry(7))
  }

  const heartShape = new Three.Shape()
  const x = -2.5,
    y = -5
  heartShape.moveTo(x + 2.5, y + 2.5)
  heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y)
  heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5)
  heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5)
  heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5)
  heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y)
  heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5)
  {
    addGridGeometry(
      new Three.ExtrudeGeometry(heartShape, {
        steps: 1,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1,
        bevelSegments: 20
      })
    )
  }

  {
    addGridGeometry(new Three.IcosahedronGeometry(7))
  }

  {
    const points = []
    for (let i = 0; i < 10; i++) {
      points.push(new Three.Vector2(Math.sin(i * 0.5) + 5, i - 5))
    }

    addGridGeometry(new Three.LatheGeometry(points))
  }

  {
    addGridGeometry(new Three.OctahedronGeometry(7))
  }

  {
    const generator = (v, u, target) => {
      u *= 10
      v *= 10

      const x = u - 5
      const y = v - 5
      const z = Math.sin(u * 0.5) * Math.sin(v * 0.2)
      target.set(x, y, z).multiplyScalar(1)
    }
    addGridGeometry(new ParametricGeometry(generator, 25, 25))
  }

  {
    addGridGeometry(new Three.PlaneGeometry(9, 9, 2, 2))
  }

  {
    const verticesOfCube = [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1
    ]
    const indicesOfFaces = [
      2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2, 3, 7, 7, 6, 2, 4,
      5, 6, 6, 7, 4
    ]
    const radius = 7
    const detail = 2
    addGridGeometry(new Three.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail))
  }

  {
    const innerRadius = 2
    const outerRadius = 7
    const segments = 18
    addGridGeometry(new Three.RingGeometry(innerRadius, outerRadius, segments))
  }

  {
    addGridGeometry(new Three.ShapeGeometry(heartShape))
  }

  {
    addGridGeometry(new Three.SphereGeometry(7, 12, 8))
  }

  {
    addGridGeometry(new Three.TetrahedronGeometry(7))
  }

  const loader = new FontLoader()

  function loadFont(url: string) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject)
    })
  }

  async function doit() {
    const font = await loadFont(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
    )
    const geometry = new TextGeometry('three.js', {
      font: font,
      size: 3.0,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.3,
      bevelSegments: 5
    })
    const mesh = new Three.Mesh(geometry, createMaterial())
    geometry.computeBoundingBox()
    geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1)

    const parent = new Three.Object3D()
    parent.add(mesh)

    addObject(0, 0, parent)
    adjustyGrid()
  }
  {
    await doit()
  }

  {
    addGridGeometry(new Three.TorusGeometry(5, 2, 8, 24))
  }

  {
    addGridGeometry(new Three.TorusKnotGeometry(3.5, 1.5, 64, 8, 2, 3))
  }

  {
    class CustomSinCurve extends Three.Curve<Three.Vector3> {
      private scale

      constructor(scale) {
        super()
        this.scale = scale
      }

      getPoint(t) {
        const x = t * 3 - 1.5
        const y = Math.sin(2 * Math.PI * t)
        const z = 0
        return new Three.Vector3(x, y, z).multiplyScalar(this.scale)
      }
    }

    const curve = new CustomSinCurve(4)
    addGridGeometry(new Three.TubeGeometry(curve, 20, 1, 8, false))
  }
  const boxGeometry = new Three.BoxGeometry(8, 8, 8, 2, 2, 2)
  {
    addLineGeometry(0, 0, new Three.EdgesGeometry(boxGeometry, 80))
    adjustyGrid()
  }
  {
    addLineGeometry(0, 0, new Three.WireframeGeometry(boxGeometry))
    adjustyGrid()
  }

  {
    const geometry = new Three.SphereGeometry(7, 12, 8)
    const material = new Three.PointsMaterial({
      color: 0xff0000,
      size: 2,
      sizeAttenuation: false
    })
    const ball = new Three.Points(geometry, material)
    addObject(0, 0, ball)
    const dodecahedron = new Three.DodecahedronGeometry(7)
    addObject(0, 0, new Three.Points(dodecahedron, material))
    adjustyGrid()
  }
}

useMenu()
main()
