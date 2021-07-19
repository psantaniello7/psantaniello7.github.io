const mouseRotateComponent = () => ({
  schema: {speed: {default: 4}},
  init() {
    
    this.ifMouseDown = false
    this.x_cord = 0
    this.y_cord = 0
    document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this))
    document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this))
    document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this))
  },

  OnDocumentMouseDown(event) {
    this.ifMouseDown = true
    this.x_cord = event.clientX
    this.y_cord = event.clientY
  },

  OnDocumentMouseUp() {
    this.ifMouseDown = false
  },

  OnDocumentMouseMove(event) {
    if (this.ifMouseDown) {
      const tempX = event.clientX - this.x_cord
      const tempY = event.clientY - this.y_cord
      if (Math.abs(tempY) < Math.abs(tempX)) {
        this.el.object3D.rotateY((tempX * this.data.speed) / 1000)
      } else {
        this.el.object3D.rotateX((tempY * this.data.speed) / 1000)
      }
      this.x_cord = event.clientX
      this.y_cord = event.clientY
    }
  },
})
export {mouseRotateComponent}