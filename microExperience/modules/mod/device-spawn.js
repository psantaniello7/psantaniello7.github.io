const deviceData = require('./config.json')
let devHeight

const spawnDeviceComponent = () => ({
  schema: {
    deviceName: {type: 'string'},
    defaultColor: {type: 'string'},
  },
  init() {
    this.ratingsContainer = document.getElementById('ratingsContainer')
    this.currentRating = null
    const displayTime = 1
    this.jsonData = null
    this.deviceHeight = null
    this.calculateRating()
    this.deviceSrc = null
    this.aninArray = null
    this.refineJson(this.data.deviceName)
    this.spawnDevice(this.data.deviceName)
  },

  spawnDevice(name) {
    const device = document.createElement('a-entity')
    const parent = document.createElement('a-entity')
    parent.id = 'deviceParent'
    device.id = `${this.data.deviceName}3D`
    const modelSource = require(`${this.deviceSrc}`)

    parent.setAttribute('position', '0 0 0')
    parent.setAttribute('two-finger-drag', '')
    parent.setAttribute('pinch-scale', '')
    this.el.appendChild(parent)
    device.setAttribute('gltf-model', modelSource)
    device.setAttribute('position', '0 0 0')
    device.setAttribute('scale', '1 1 1')
    device.setAttribute('rotation', '0 0 0')
    device.setAttribute('class', 'cantap')
    device.setAttribute('one-finger-rotate', '')

    device.setAttribute('color', `${this.data.defaultColor}`)
    device.setAttribute('color-selector', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    //   bodyColors: 'blue, gold, graphite, silver',
    //   buttonRGB: '(45 78 92), (252 235 211), (82 81 77), (230 231 226)',
    //   body: 'iphone12_pro_Body',
    })
    device.setAttribute('play-video', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })

    device.setAttribute('wallpaper-change', {
      deviceName: `${device.id}`,
      jsonData: `${JSON.stringify(this.jsonData)}`,
    })
    // device.setAttribute('animation-selector', 'jsonData', deviceData)
    device.setAttribute('shadow', 'receive: false')

    parent.appendChild(device)

    device.addEventListener('model-loaded', () => {
      device.setAttribute('animation-selector', {
        deviceName: `${device.id}`,
        jsonData: `${JSON.stringify(this.jsonData)}`,
      })
      this.setDevicePos()
      this.hideScreenMesh()
    })
  },

  calculateRating() {
    this.currentRating = 3
  },

  spawnRatings(value) {
    let pos
    for (let i = 1; i <= value; i++) {
      switch (i) {
        case 1:
          pos = '0 0 -2.5'
          break
        case 2:
          pos = '-.75 0 -2.25'
          break
        case 3:
          pos = '.75 0 -2.25'
          break
        case 4:
          pos = '-1.5 0 -2'
          break
        case 5:
          pos = '1.5 0 -2'
          break
        default:
          pos = '0 0 0'
      }

      const star = document.createElement('a-entity')
      star.id = `star${i}`
      star.setAttribute('gltf-model', '#star')
      star.setAttribute('position', pos)
      star.setAttribute('scale', '3 3 3')
      star.setAttribute('rotation', '0 0 0')
      star.setAttribute('shadow', '')
      star.setAttribute('animation', {
        property: 'rotation',
        dur: '2000',
        to: '0 360 0',
        loop: 'true',
        easing: 'linear',
      })

      this.ratingsContainer.appendChild(star)
    }
  },

  showRotate() {
    const parent = document.getElementById(`${this.data.deviceName}3D`)
    const arrow = document.createElement('a-entity')
    const arrow2 = document.createElement('a-entity')
    arrow2.id = 'arrow2'
    arrow.id = 'arrow1'

    arrow.setAttribute('gltf-model', '#rotate')
    arrow.setAttribute('position', '-1 1.5 0')
    arrow.setAttribute('scale', '.25 .25 .25')
    arrow.setAttribute('rotation', '0 90 0')
    arrow.setAttribute('shadow', '')

    arrow2.setAttribute('gltf-model', '#rotate')
    arrow2.setAttribute('position', '1 1.5 0')
    arrow2.setAttribute('scale', '.25 .25 .25')
    arrow2.setAttribute('rotation', '0 270 0')
    arrow2.setAttribute('shadow', '')

    parent.appendChild(arrow)
    parent.appendChild(arrow2)

    function removeArrows() {
      arrow.parentNode.removeChild(arrow)
      arrow2.parentNode.removeChild(arrow2)
      parent.removeEventListener('mousedown', removeArrows)
    }

    parent.addEventListener('mousedown', removeArrows)
  },
  refineJson(device) {
    const json = deviceData
    for (const key in json) {
      const brands = json[key]
      for (const dev in brands) {
        const devices = brands[dev]
        for (const id in devices) {
          const devName = devices[id]
          if (this.data.deviceName === devName.deviceName) {
            this.jsonData = devName
            this.deviceSrc = this.jsonData.model3d
            this.animArray = this.jsonData.animations
          }
        }
      }
    }
  },

  setDevicePos() {
    const dev = document.getElementById(`${this.data.deviceName}3D`)
    const device = dev.getObject3D('mesh')
    const box = new THREE.Box3().setFromObject(device)
    this.deviceHeight = box.getSize().y / 2
    devHeight = this.deviceHeight
    dev.setAttribute('position', `0 ${this.deviceHeight} 0`)
  },

  getHeight() {
    return devHeight
  },

  hideScreenMesh() {
    const phone = document.getElementById(`${this.data.deviceName}3D`)

    const obj = phone.getObject3D('mesh').getObjectByName('Screen')
    obj.visible = false
  },

})

export {spawnDeviceComponent}
export {devHeight}