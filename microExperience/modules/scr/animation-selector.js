AFRAME.registerComponent("animation-selector", {
  schema: {
    deviceName: {type: 'string'},
    jsonData: {type: 'string'},
    // sideBool: {type: 'bool'},
  },

  init() {
    this.jsonData = this.data.jsonData
    this.phone = document.getElementById(this.data.deviceName)
    this.container = document.getElementById('animateUIContainer')
    this.animations = JSON.parse(this.jsonData).animations
    this.isFront = false
    // this.sideBool = this.isFront
    this.animTime = 1000
    this.container.style.display = 'block'
    this.createUI()
    this.animState = 'closed'
    this.openDevice()

    document.getElementById('inHandButton').addEventListener('resetAnim', () => {
      console.log('RESETTING')
      this.animState = 'open'
      document.getElementById('openButton').style.display = 'none'
      document.getElementById('closeAnimButton').style.display = 'inline-block'
    })
  },

  createUI() {
    const buttons = document.querySelectorAll('.flipButton')
    if (buttons.length > 0) {
      console.log('Button Exists')
      return
    } else {
      const flip = document.createElement('div')
      flip.id = 'flipButton'
      flip.innerHTML = 'Back View'
      flip.classList.add('flipButton')
      this.container.appendChild(flip)

      flip.addEventListener('click', () => {
        if (this.container.classList.length !== 0) {
          const device = document.getElementById(this.data.deviceName)
          const currentRotation = device.getAttribute('rotation')

          device.setAttribute('animation__rotation', {
            property: 'rotation',
            dur: this.animTime,
            from: `0 ${currentRotation.y} 0`,
            to: `0 ${currentRotation.y + 180} 0`,
            easing: 'easeInOutCirc',
          })

          device.setAttribute('animation__transform', {
            property: 'position',
            dur: this.animTime / 2,
            from: '0 0 0',
            to: '0 0 .25',
            easing: 'easeInOutCirc',
          })
          setTimeout(() => {
            device.setAttribute('animation__transform', {
              property: 'position',
              dur: this.animTime / 2,
              from: '0 0 .25',
              to: '0 0 0',
              easing: 'easeInOutCirc',
            })
          }, this.animTime / 2)

          setTimeout(() => {
            device.removeAttribute('animation__transform')
            device.removeAttribute('animation__rotation')
          }, this.animTime + 1)
        }
        if (this.isFront) {
          flip.innerHTML = 'Back View'
        } else {
          flip.innerHTML = 'Front View'
        }
        this.isFront = !this.isFront
      })
    }
    if (this.animations.length > 0) {
      const animOpen = document.createElement('div')
      animOpen.id = 'openButton'
      animOpen.innerHTML = 'Open'
      animOpen.classList.add('animButton')
      this.container.appendChild(animOpen)

      const animClose = document.createElement('div')
      animClose.id = 'closeAnimButton'
      animClose.innerHTML = 'Close'
      animClose.classList.add('animButton')
      this.container.appendChild(animClose)
      animClose.style.display = 'none'

      animOpen.addEventListener('click', () => {
        if (this.animState === 'closed') {
          this.animateDevice('ClosedToMid')
          animClose.style.display = 'inline-block'
          this.animState = 'midway'
        } else if (this.animState === 'midway') {
          this.animateDevice('MidToOpen')
          animOpen.style.display = 'none'
          this.animState = 'open'
        }
      })
      animClose.addEventListener('click', () => {
        if (this.animState === 'open') {
          this.animateDevice('OpenToMid')
          animOpen.style.display = 'inline-block'
          this.animState = 'midway'
        } else if (this.animState === 'midway') {
          this.animateDevice('MidToClosed')
          animClose.style.display = 'none'
          this.animState = 'closed'
        }
      })
    }
  },

  animateDevice(dir) {
    let anim
    const device = document.getElementById(this.data.deviceName)
    switch (dir) {
      case 'OpenToMid':
        anim = 'CloseHalf'
        this.animState = 'midway'
        break
      case 'MidToOpen':
        anim = 'OpenFull'
        this.animState = 'open'
        break
      case 'ClosedToMid':
        anim = 'OpenHalf'
        this.animState = 'midway'
        break
      case 'MidToClosed':
        anim = 'CloseFull'
        this.animState = 'closed'
        break
      default:
        anim = 'idle'
    }

    device.setAttribute('animation-mixer', {
      clip: anim,
      loop: 'once',
      clampWhenFinished: true,
    })
  },

  openDevice() {
    if (this.animations.length > 0) {
      this.animateDevice('MidToOpen')
      this.animState = 'open'
      document.getElementById('openButton').style.display = 'none'
      document.getElementById('closeAnimButton').style.display = 'inline-block'
    }
  },

})