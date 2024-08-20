class GridLayout<T> {
  cols: number
  size: number
  gap: number
  objects: T[] = []

  constructor({ cols = 5, size = 8, gap = 8 }) {
    this.cols = cols
    this.size = size
    this.gap = gap
  }

  computePosition = (idx: number) => {
    const prevX = idx % this.cols
    const x = prevX === 0 ? 0 : prevX
    const y = Math.floor(idx / this.cols)

    const rows = Math.ceil(this.objects.length / this.cols)

    const offsetX = (this.cols * this.size + Math.max(this.cols - 1, 0) * this.gap) / 2
    const offsetY = (rows * this.size + Math.max(rows - 1, 0) * this.gap) / 2

    const posX = x * (this.size + this.gap) - offsetX
    const posY = -y * (this.size + this.gap) + offsetY
    return { posX, posY }
  }
}

export default GridLayout
