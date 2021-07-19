const oneFingerRotateComponent = () => ({
  schema: {
    factor: {default: 6},
  },
  init() {
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
    this.el.classList.add('cantap')

    this.resetButton = document.getElementById('resetButton')
  },
  remove() {
    this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
  },
  handleEvent(event) {
    this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
    this.el.object3D.rotation.x += event.detail.positionChange.y * this.data.factor

    if (this.resetButton.style.display === 'none') {
      this.resetButton.style.display = 'block'
    }
  },

})

export {oneFingerRotateComponent}