const pinchScaleComponent = () => ({
  schema: {
    min: {default: 0.33},
    max: {default: 3},
    scale: {default: 0},
  },
  init() {
    const s = this.data.scale
    this.initialScale = (s && {x: s, y: s, z: s}) || this.el.object3D.scale.clone()
    this.scaleFactor = 1
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    this.el.classList.add('cantap')
    this.resetButton = document.getElementById('resetButton')
  },
  remove() {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent(event) {
    this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
    this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z

    if (this.resetButton.style.display === 'none') {
      this.resetButton.style.display = 'block'
    }
  },
})
export {pinchScaleComponent}