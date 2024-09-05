import { AxesHelper, GridHelper, Material, MathUtils, Object3D } from 'three'

export class DegRadHelper {
  obj: any
  prop: string

  constructor(obj: object, prop: string) {
    this.obj = obj
    this.prop = prop
  }

  get value() {
    return MathUtils.radToDeg(this.obj[this.prop])
  }

  set value(v) {
    this.obj[this.prop] = MathUtils.degToRad(v)
  }
}

export class ColorGUIHelper {
  constructor(
    public object: any,
    public prop: string
  ) {}

  get value() {
    return `#${this.object[this.prop].getHexString()}`
  }

  set value(hexString) {
    this.object[this.prop].set(hexString)
  }
}

export class AxisGridHelper {
  private grid: GridHelper
  private axes: AxesHelper
  private _visible: boolean = false

  constructor(node: Object3D, units = 10) {
    const axes = new AxesHelper()
    const material = axes.material as Material
    material.depthTest = false
    axes.renderOrder = 2 // render after grids
    node.add(axes)

    const grid = new GridHelper(units, units)
    const gridMaterial = grid.material as Material
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
