const colorSelectComponent = () => ({
  schema: {
    bodyColors: {type: 'array'},
    buttonRGB: {type: 'array'},
    body: {type: 'string'},
  },
  init() {
    this.phone = this.el.sceneEl
    this.texture = null
    this.container = document.getElementById('colorSelectContainer')
    this.colors = this.data.bodyColors
    this.rgbValues = this.data.buttonRGB
    this.bodyName = this.data.body
    this.container.style.display = 'block'
    this.createUI()
  },
  getImageColor(color) {
    const texture = document.getElementById(color).src
    return texture
  },

  createUI() {
    for (let i = 0; i < this.colors.length; i++) {
      const button = document.createElement('div')
      button.id = `${this.colors[i]}button`
      button.classList.add('colorButton')
      button.setAttribute('style', `background-color:${this.getRGB(this.colors[i])}`)
      this.container.appendChild(button)

      button.addEventListener('click', () => {
        this.changePhoneColor(this.colors[i])
      })
    }
  },

  getRGB(color) {
    let rgb = 'rgb(0, 0, 0)'
    const index = this.colors.indexOf(color)
    const values = this.rgbValues[index]
    rgb = `rgb${values}`
    return rgb
  },

  changePhoneColor(color) {
    this.texture = document.getElementById(color).src

    const obj = this.el.getObject3D('mesh').getObjectByName(this.bodyName)

    obj.material.map = THREE.ImageUtils.loadTexture(this.texture)
    obj.material.map.flipY = false
    obj.material.map.wrapS = 1000
    obj.material.map.wrapT = 1000
    obj.material.map.rotation = 0
  },

})

export {colorSelectComponent}