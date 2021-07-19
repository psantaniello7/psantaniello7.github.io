AFRAME.registerComponent("color-selector", {
  schema: {
    deviceName: {type: 'string'},
    jsonData: {type: 'string'},
    // bodyColors: {type: 'array'},
    // buttonRGB: {type: 'array'},
    // body: {type: 'string'},
  },

  init() {
    this.jsonData = JSON.parse(this.data.jsonData)
    this.textureLoader = new THREE.TextureLoader()
    this.testValue = false
    this.phone = document.getElementById(this.data.deviceName)
    this.texture = null
    this.container = document.getElementById('colorUIContainer')
    this.colorTextHolder = document.getElementById('colorText')
    this.colors = this.data.bodyColors
    this.rgbValues = this.data.buttonRGB
    this.bodyName = this.data.body
    this.container.style.display = 'block'

    this.texArray = []
    this.colorArray = []
    this.phone.addEventListener('model-loaded', () => {
      const obj = this.phone.getObject3D('mesh').getObjectByName('Body')
      this.getColors()
      this.createTexArray(obj)
      this.createUI()
    })
  },
  getImageColor(color) {
    const texture = document.getElementById(color).src
    return texture
  },

  createUI() {
    const buttons = document.querySelectorAll('.colorButtonHolder')
    if (buttons.length > 0) {
      console.log('Buttons Exist')
    } else {
      for (let i = 0; i < this.colorArray.length; i++) {
        const buttonHolder = document.createElement('div')
        const button = document.createElement('div')
        const name = `${this.colorArray[i].name.split(' ').join('')}`
        const firstName = `${this.colorArray[0].name.split(' ').join('')}`
        this.setColorToColorTextHolder(firstName)
        buttonHolder.id = `${name}buttonHolder`
        button.id = `${name}button`
        buttonHolder.classList.add('colorButtonHolder')
        button.classList.add('colorButton')
        button.setAttribute('style', `background-color:rgb${this.colorArray[i].rgbValues}`)

        buttonHolder.appendChild(button)
        this.container.appendChild(buttonHolder)

        buttonHolder.addEventListener('click', () => {
          this.setActiveState(buttonHolder)
          this.changePhoneColor(name)
          this.setColorToColorTextHolder(this.colorArray[i].name)
        })

        if (i === 0) {
          buttonHolder.classList.add('colorActive')
        }
      }
      if (window.matchMedia('(orientation: portrait)').matches) {
        this.container.style.marginTop = '-5vmin'
        this.colorTextHolder.style.top = '15vh'
      } else if (window.matchMedia('(orientation: landscape)').matches) {
        this.container.style.marginTop = '-10vmin'
        this.colorTextHolder.style.top = '30%'
      }
    }
  },

  getRGB(color) {
    let rgb = 'rgb(0, 0, 0)'
    const index = this.colorArray.indexOf(color)
    const values = color
    rgb = `rgb${values}`
    return rgb
  },

  changePhoneColor(color) {
    let texture
    let material
    for (let i = 0; i < this.texArray.length; i++) {
      if (this.texArray[i][0] === color) {
        texture = this.texArray[i][1]
        material = this.texArray[i][2]
      }
    }

    const phone = document.getElementById(`${this.phone.id}`)
    const obj = phone.getObject3D('mesh').getObjectByName('Body')
    const imgScreen = phone.getObject3D('mesh').getObjectByName('BodyScreen')
    const objScreen = phone.getObject3D('mesh').getObjectByName('Screen')
    if (obj.children.length > 1) {
      for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material[i]
        imgScreen.material = material[1]
      }
    } else {
      obj.material = material[0]
      imgScreen.material = material[0]
    }
    objScreen.visible = false
    // obj.material = material

    phone.setAttribute('color', color)
  },

  setActiveState(button) {
    let activeButtons = []
    activeButtons = document.querySelectorAll('.colorActive')
    for (let i = 0; i < activeButtons.length; i++) {
      activeButtons[i].classList.remove('colorActive')
    }

    button.classList.add('colorActive')
  },

  setColorToColorTextHolder(name) {
    this.colorTextHolder.innerHTML = name
  },

  createTexArray(obj) {

    let texture
    let newMaterial
    let materialArray = []
    const array = this.colorArray
    for (let i = 0; i < array.length; i++) {
      const texName = array[i].name.split(' ').join('')
      texture = require(`${array[i].texture}`)
      if (obj.children.length > 1) {
        materialArray = []
        for (let j = 0; j < obj.children.length; j++) {
          newMaterial = new THREE.MeshStandardMaterial().copy(obj.children[j].material)
          newMaterial.map = this.textureLoader.load(texture)
          newMaterial.map.flipY = false
          newMaterial.map.wrapS = 1000
          newMaterial.map.wrapT = 1000
          newMaterial.map.rotation = 0
          newMaterial.map.needsUpdate = true
          newMaterial.skinning = true
          materialArray.push(newMaterial)
        }
      } else {
        materialArray = []
        newMaterial = new THREE.MeshStandardMaterial().copy(obj.material)
        newMaterial.map = this.textureLoader.load(texture)
        newMaterial.map.flipY = false
        newMaterial.map.wrapS = 1000
        newMaterial.map.wrapT = 1000
        newMaterial.map.rotation = 0
        newMaterial.map.needsUpdate = true
        newMaterial.skinning = true
        materialArray.push(newMaterial)
      }
      this.texArray.push([texName, texture, materialArray])
    }

  },
  getColors() {
    const json = this.jsonData

    for (let i = 0; i < json.colors.length; i++) {
      const device = json.colors[i]
      for (const colorName in device) {
        this.colorArray.push(device[colorName])
      }
    }
  },

})