// const deviceData = require('./config.json')
// const msgData = require('./data.json')
const spawn = require('./device-spawn.js')
const playVideo = require('./play-video.js')

const managerComponent = () => ({
  init() {
    this.screenUI = document.getElementById('onScreenUIContainer')
    this.mainUI = document.getElementById('mainUIContainer')
    this.colorUI = document.getElementById('colorUIContainer')
    this.animateUI = document.getElementById('animateUIContainer')
    this.subMenu = document.getElementById('subMenuContainer')
    this.infoUI = document.getElementById('infoContainer')
    this.expandUI = document.getElementById('expandContainer')
    this.target = document.getElementById('target')
    this.resetButton = document.getElementById('resetButton')
    this.closeButton = document.getElementById('closeButton')
    this.whiteLine = document.getElementById('whiteLine')

    this.defaultInfo = document.getElementById('defaultInfo')
    this.inHandInfo = document.getElementById('inHandInfo')
    this.continueButtonDefault = document.getElementById('continueButtonDefault')
    this.continueButtonInHand = document.getElementById('continueButtonInHand')
    this.helpBackgroundImage = document.getElementById('helpBackgroundImage')

    // this.colorSelectButton = document.getElementById('colorSelectButton')
    this.inHandButton = document.getElementById('inHandButton')
    this.inSpaceButton = document.getElementById('inSpaceButton')
    this.infoButton = document.getElementById('infoButton')
    this.verizonLogo = document.getElementById('verizonLogo')
    this.expandButton = document.getElementById('expandButton')
    this.flipButton = document.getElementById('flipButton')
    this.colorTextHolder = document.getElementById('colorText')

    // this.playVideoButton = document.getElementById('playVideoButton')
    this.playVideoButtonText = document.getElementById('playVideoButtonText')

    this.isColorMenuOpen = false
    this.isInHandOpen = false
    this.isAnimateMenuOpen = false
    this.deviceName = null
    this.selectedColor = null
    this.menuExpanded = false
    this.isInHand = false
    this.isHowToInHandDisplayFirstTime = true

    this.isMenuClicked = false

    this.screenUI.style.display = 'block'
    this.mainUI.style.display = 'block'
    this.infoUI.style.display = 'block'
    this.expandUI.style.display = 'block'
    this.helpBackgroundImage.style.display = 'block'
    this.defaultInfo.style.display = 'block'
    this.inHandInfo.style.display = 'none'
    this.resetButton.style.display = 'none'
    const deviceArray = []
    this.loadColorMenu()
    this.showInSpaceRelatedUI()
    this.stuffToLoadAtStart()
    this.isLandscape = false
    this.isPortrait = false
    // this.colorSelectButton.addEventListener('click', () => {
    // this.activeMenu(this.colorSelectButton)
    // })

    this.inHandButton.addEventListener('click', () => {
      // this.toggleInHandMenu(this.inHandButton)
      if (this.isHowToInHandDisplayFirstTime) {
        this.isInHand = true
        this.showInfo()
        this.isHowToInHandDisplayFirstTime = false
      }
      this.showInHandRelatedUI()
    })

    this.inSpaceButton.addEventListener('click', () => {
      // this.toggleInHandMenu(this.inHandButton)
      this.showInSpaceRelatedUI()
    })

    this.infoButton.addEventListener('click', () => {
      this.showInfo()
    })

    this.resetButton.addEventListener('click', () => {
      this.resetDevice()
    })

    // this.closeButton.addEventListener('click', () => {
    //   alert('This will close the AR Experience. Functionality to be implemented once integrated completely.')
    // })

    this.expandButton.addEventListener('click', () => {
      this.expandMenu()
    })
    if (window.matchMedia('(orientation: portrait)').matches) {
      console.log('orientation portrait')
      // this.colorTextHolder.style.top = '19.5vh'
    } else if (window.matchMedia('(orientation: landscape)').matches) {
      console.log('orientation landscape')
      // this.colorTextHolder.style.top = '35vh'
    }
    window.addEventListener('resize', () => {
      if (window.matchMedia('(orientation: portrait)').matches) {
        this.verizonLogo.style.display = 'block'
        this.setPortraitUI()
      } else if (window.matchMedia('(orientation: landscape)').matches) {
        // this.verizonLogo.style.display = 'none'
        this.setLandscapeUI()
      }
    })

    const createDeviceArray = () => {
      let list = []
      list = this.el.sceneEl.querySelectorAll('.device')
      for (let i = 0; i < list.length; i++) {
        deviceArray.push(list[i].id)
      }
    }

    createDeviceArray()

    const getDevice = () => {
      this.deviceName = this.getDeviceName(msgData)
    }
    getDevice()

    this.spawnDevice(this.deviceName)

    this.myEvent = new Event('resetAnim', {
      open: true,
      closed: false,
    })

    THREE.EventDispatcher.call(this.inHandButton)
  },

  setPortraitUI() {
    if (!this.isInHand) {
      // set color swatch container and colorTextHolder Position in InSpace - Portrait Mode
      this.colorUI.style.marginTop = '-5vmin'
      this.colorTextHolder.style.top = '15vh'
    } else {
      // set color swatch container and colorTextHolder Position in InHand - Portrait Mode
      this.colorUI.style.marginTop = '0.5vmin'
      this.colorTextHolder.style.top = '19.5vh'
    }
  },

  setLandscapeUI() {
    if (!this.isInHand) {
      // set color swatch container and colorTextHolder Position in InSpace - Landscape Mode
      this.colorUI.style.marginTop = '-8vmin'
      this.colorTextHolder.style.top = '30%'
    } else {
      // set color swatch container and colorTextHolder Position in InHand - Landscape Mode
      this.colorUI.style.marginTop = '2vmin'
      this.colorTextHolder.style.top = '42%'
    }
    console.log(this.expandUI.classList.contains('active'))
    if (this.expandUI.classList.contains('active')) {
      this.verizonLogo.style.display = 'none'
    }
  },

  stuffToLoadAtStart() {
    this.helpBackgroundImage.style.display = 'block'
    this.defaultInfo.style.display = 'block'
    this.infoUI.style.display = 'block'
    this.infoButton.style.display = 'none'
    this.inSpaceButton.style.display = 'none'
    this.inHandButton.style.display = 'none'
    this.whiteLine.style.display = 'none'
    this.colorTextHolder.style.display = 'none'
    this.resetButton.style.display = 'none'

    // this.verizonLogo.style.display = 'block'
    this.continueButtonDefault.addEventListener('click', () => {
      this.infoUI.style.display = 'block'
      this.resetButton.style.display = 'none'
      // this.infoButton.style.display = 'block'
      // this.verizonLogo.style.display = 'block'
      this.screenUI.style.display = 'block'
      this.menuExpanded = false
      this.expandUI.classList.remove('active')
      this.expandUI.classList.remove('inactive')

      this.colorUI.classList.remove('close')
      this.colorUI.classList.remove('open')
      this.inSpaceButton.style.display = 'none'
      this.inHandButton.style.display = 'none'
      this.whiteLine.style.display = 'none'
      this.colorTextHolder.style.display = 'none'
      this.infoButton.style.display = 'none'
      // this.playVideoButton.style.display = 'none'
      this.playVideoButtonText.style.display = 'none'

      this.showUIElements(false)
      this.helpBackgroundImage.style.display = 'none'
      this.defaultInfo.style.display = 'none'
      const buttons = document.querySelectorAll('.flipButton, .animButton')
      if (buttons.length > 0) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].style.display = 'none'
        }
      }
    })
  },

  showInSpaceRelatedUI() {
    this.inSpaceButton.classList.add('active')
    this.inHandButton.classList.remove('active')
    // this.animateUI.classList.remove('open')
    // this.animateUI.classList.add('close')
    const buttons = document.querySelectorAll('.flipButton, .animButton')

    console.log(buttons.length)

    if (buttons.length > 0) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = 'none'
      }
    }
    if (this.isInHand) {
    // console.log('calling endInHand')
      const device = document.querySelector(`#${this.deviceName}3D`)
      this.endInHand()
      device.setAttribute('rotation', '0 180 0')
      this.setInSpaceColorButtonPosition()
      this.isInHand = false
    }
  },

  showInHandRelatedUI() {
    // to highlight the InSpace and InHand Buttons - Red Color Underline and Bold font
    this.inSpaceButton.classList.remove('active')
    this.inHandButton.classList.add('active')
    // to show/hide the animation buttons
    // this.animateUI.classList.remove('close')
    // this.animateUI.classList.add('open')
    const buttons = document.querySelectorAll('.flipButton, .animButton')
    if (buttons.length > 0) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = 'inline-block'
      }
    }
    const device = document.querySelector(`#${this.deviceName}3D`)
    this.startInHand()
    device.setAttribute('rotation', '0 0 0')
    this.isInHand = true
    this.setInHandColorButtonPosition()
  },
  setInSpaceColorButtonPosition() {
    // const buttons = document.querySelectorAll('.colorButtonHolder')
    // if (buttons.length > 0) {
    // for (let i = 0; i < buttons.length; i++) {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.colorUI.style.marginTop = '-5vmin'
      this.colorTextHolder.style.top = '15vh'
    } else if (window.matchMedia('(orientation: landscape)').matches) {
      this.colorUI.style.marginTop = '-8vmin'
      this.colorTextHolder.style.top = '30%'
    }
    // }
    // }
  },

  setInHandColorButtonPosition() {
    // const buttons = document.querySelectorAll('.colorButtonHolder')
    // if (buttons.length > 0) {
    // for (let i = 0; i < buttons.length; i++) {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.colorUI.style.marginTop = '0.5vmin'
      this.colorTextHolder.style.top = '19.5vh'
    } else if (window.matchMedia('(orientation: landscape)').matches) {
      this.colorUI.style.marginTop = '2vmin'
      this.colorTextHolder.style.top = '42%'
    }
    // }
    // }
  },

  activeMenu(button) {
    // console.log(this.isColorMenuOpen)
    if (this.isColorMenuOpen) {
      this.inactiveMenu(button)
      this.isColorMenuOpen = false
      this.colorUI.classList.remove('open')
      this.colorUI.classList.add('close')
      this.subMenu.classList.remove('open')
      this.subMenu.classList.add('close')
    } else {
      button.classList.add('active')
      this.isColorMenuOpen = true
      this.colorUI.classList.remove('close')
      this.colorUI.classList.add('open')
      this.subMenu.classList.remove('close')
      this.subMenu.classList.add('open')
    }
  },

  // Blessons Change
  loadColorMenu() {
    this.colorUI.classList.remove('close')
    this.colorUI.classList.add('open')
    this.subMenu.classList.remove('close')
    this.subMenu.classList.add('open')
  },
  // end change

  toggleInHandMenu(button) {
    const device = document.querySelector(`#${this.deviceName}3D`)
    if (this.isInHandOpen) {
      this.inactiveMenu(button)
      this.isInHandOpen = false
      this.endInHand()
      // this.animateUI.classList.remove('open')
      // this.animateUI.classList.add('close')
      device.setAttribute('rotation', '0 180 0')
    } else {
      button.classList.add('active')
      this.isInHandOpen = true
      this.startInHand()
      // this.animateUI.classList.remove('close')
      // this.animateUI.classList.add('open')
      device.setAttribute('rotation', '0 180 0')
    }
  },

  inactiveMenu(button) {
    button.classList.remove('active')
  },

  spawnDevice(deviceName) {
    const devName = deviceName
    const ratingsContainer = document.createElement('a-entity')
    ratingsContainer.id = 'ratingsContainer'
    this.el.sceneEl.appendChild(ratingsContainer)

    const deviceContainer = document.createElement('a-entity')
    deviceContainer.id = 'deviceContainer'
    deviceContainer.setAttribute('device-spawn', {
      deviceName: `${deviceName}`,
      defaultColor: `${this.selectedColor}`,
    })
    this.el.sceneEl.appendChild(deviceContainer)
  },

  startInHand() {
    this.resetDevice()
    const device = document.querySelector(`#${this.deviceName}3D`)
    const {bodyMesh} = JSON.parse(device.getAttribute('color-selector').jsonData)
    const targetMesh = bodyMesh
    const obj = device.getObject3D('mesh').getObjectByName('Body')
    const {material} = obj

    const {target} = this

    device.flushToDOM()
    const copy = device.cloneNode()
    copy.removeAttribute('two-finger-drag')
    copy.removeAttribute('one-finger-rotate')
    copy.removeAttribute('pinch-scale')
    copy.setAttribute('scale', '1 1 1')
    copy.setAttribute('position', '0 0 0')
    copy.removeAttribute('shadow')
    // copy.setAttribute('rotation', '0 0 0')

    target.appendChild(copy)

    copy.addEventListener('model-loaded', () => {
      const copyObj = copy.getObject3D('mesh').getObjectByName('Body')
      copyObj.material.map = material.map
    })

    device.parentNode.removeChild(device)

    const buttons = document.querySelectorAll('.flipButton')
    // const buttonBool = device.getAttribute('animation-selector').sideBool
    // console.log(buttonBool)
    // if (buttons.length > 0) {
    //   for (let i = 0; i < buttons.length; i++) {
    //     buttons[i].innerHTML = 'Back View'
    //     device.setAttribute('animation-selector', '')
    //   }
    // }
    this.animateUI.classList.add('show')
    this.animateUI.classList.remove('hide')
  },

  endInHand() {
    const devHeight = spawn.spawnDeviceComponent().getHeight()

    const device = document.querySelector(`#${this.deviceName}3D`)
    const {bodyMesh} = JSON.parse(device.getAttribute('color-selector').jsonData)
    console.log(bodyMesh)
    const targetMesh = bodyMesh
    const obj = device.getObject3D('mesh').getObjectByName('Body')
    const {material} = obj

    // const container = document.getElementById('deviceContainer')
    const container = document.getElementById('deviceParent')
    const {target} = this
    device.flushToDOM()
    const copy = device.cloneNode()
    copy.setAttribute('one-finger-rotate', '')
    // copy.setAttribute('scale', '.25 .25 .25')
    copy.setAttribute('position', `0 ${devHeight} 0`)
    copy.setAttribute('rotation', '0 0 0')
    copy.setAttribute('shadow', 'receive: false')

    container.appendChild(copy)

    copy.addEventListener('model-loaded', () => {
      const copyObj = copy.getObject3D('mesh').getObjectByName('Body')
      copyObj.material.map = material.map
    })

    device.parentNode.removeChild(device)
    this.animateUI.classList.add('hide')
    this.animateUI.classList.remove('show')
    this.inHandButton.dispatchEvent(this.myEvent)
  },

  showInfo() {
    let infoScreen
    let resetNeeded
    let continueButton
    if (this.isInHand) {
      infoScreen = this.inHandInfo
      continueButton = this.continueButtonInHand
      this.resetDevice()
    } else {
      infoScreen = this.defaultInfo
      continueButton = this.continueButtonDefault
    }

    if (this.resetButton.style.display === 'block') {
      resetNeeded = true
    } else {
      resetNeeded = false
    }

    this.inSpaceButton.style.display = 'none'
    this.inHandButton.style.display = 'none'
    this.whiteLine.style.display = 'none'
    this.colorTextHolder.style.display = 'none'
    this.infoButton.style.display = 'none'
    this.resetButton.style.display = 'none'
    this.screenUI.style.display = 'none'
    if (window.matchMedia('(orientation: landscape)').matches) {
      this.verizonLogo.style.display = 'block'
    }
    this.helpBackgroundImage.style.display = 'block'
    infoScreen.style.display = 'block'

    this.colorUI.classList.remove('close')
    this.colorUI.classList.remove('open')

    this.menuExpanded = false
    this.expandUI.classList.remove('active')
    this.expandUI.classList.remove('inactive')
    continueButton.addEventListener('click', () => {
      if (this.isHowToInHandDisplayFirstTime) {
        this.isHowToInHandDisplayFirstTime = false
      }
      this.screenUI.style.display = 'block'
      this.menuExpanded = false

      this.helpBackgroundImage.style.display = 'none'
      infoScreen.style.display = 'none'

      this.expandUI.classList.remove('active')
      this.expandUI.classList.remove('inactive')
      this.expandButton.classList.add('inactive')
      this.expandButton.classList.remove('active')
      // this.playVideoButton.style.display = 'block'
      // this.playVideoButtonText.style.display = 'block'

      // this.inSpaceButton.style.display = 'none'
      // this.inHandButton.style.display = 'none'
      // this.whiteLine.style.display = 'none'
      // this.colorTextHolder.style.display = 'none'
      // this.infoButton.style.display = 'none'
      // // this.playVideoButton.style.display = 'none'
      // this.playVideoButtonText.style.display = 'none'
      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none'
        }
      }
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none'
          }
        }
      }
      this.showUIElements(false)
      if (resetNeeded) {
        this.resetButton.style.display = 'block'
      }
    })
  },

  resetDevice() {
    this.resetButton.style.display = 'none'
    const device = document.querySelector(`#${this.deviceName}3D`)
    const parent = document.querySelector('#deviceParent')

    parent.removeAttribute('pinch-scale')
    device.setAttribute('rotation', '0 0 0')
    parent.setAttribute('scale', '1 1 1')
    parent.setAttribute('position', '0 0 0')
    parent.setAttribute('pinch-scale', '')
    this.resetButton.style.display = 'none'
  },

  getDeviceName(msg) {
    const brand = msg.brandName
    const disName = msg.productDisplayName
    const name = disName.split(' ').join('')
    const selColor = msg.childSkus[0].color
    const color = selColor.split(' ').join('')
    const {deviceName} = deviceData.brands[brand][name]
    this.selectedColor = color

    return deviceName
  },

  expandMenu() {
    this.isMenuClicked = true
    if (!this.expandUI.classList.contains('active')) {
      this.colorUI.classList.remove('close')
      this.colorUI.classList.add('open')
      this.expandUI.classList.add('active')
      this.expandUI.classList.remove('inactive')
      this.expandButton.classList.add('active')

      // this.inSpaceButton.style.display = 'block'
      // this.inHandButton.style.display = 'block'
      // this.whiteLine.style.display = 'block'
      // this.colorTextHolder.style.display = 'block'
      // this.infoButton.style.display = 'block'
      // // this.playVideoButton.style.display = 'block'
      // this.playVideoButtonText.style.display = 'block'
      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'block'
        }
      }
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'inline-block'
            if (buttons[i].id === 'openButton') {
              buttons[i].style.display = 'none'
            }
          }
        }
      }
      this.showUIElements(true)
      if (window.matchMedia('(orientation: landscape)').matches) {
        this.verizonLogo.style.display = 'none'
      }
      // this.menuExpanded = true
    } else if (this.expandUI.classList.contains('active')) {
      this.colorUI.classList.remove('close')
      this.colorUI.classList.remove('open')
      this.expandUI.classList.add('inactive')
      this.expandUI.classList.remove('active')
      this.expandButton.classList.remove('active')

      // this.inSpaceButton.style.display = 'none'
      // this.inHandButton.style.display = 'none'
      // this.whiteLine.style.display = 'none'
      // this.colorTextHolder.style.display = 'none'
      // this.infoButton.style.display = 'none'
      // // this.playVideoButton.style.display = 'none'
      // this.playVideoButtonText.style.display = 'none'
      const elements = document.querySelectorAll('.UIElement')
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none'
        }
      }
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none'
          }
        }
      }
      this.showUIElements(false)
      if (window.matchMedia('(orientation: landscape)').matches) {
        this.verizonLogo.style.display = 'block'
      }
      // this.menuExpanded = false
    }
  },
  showUIElements(show) {
    if (show) {
      this.inSpaceButton.classList.remove('hide')
      this.inSpaceButton.classList.add('show')
      //
      this.inHandButton.classList.remove('hide')
      this.inHandButton.classList.add('show')
      //
      this.whiteLine.classList.remove('hide')
      this.whiteLine.classList.add('show')
      //
      this.colorTextHolder.classList.remove('hide')
      this.colorTextHolder.classList.add('show')
      //
      this.infoButton.classList.remove('hide')
      this.infoButton.classList.add('show')
      //
      // this.playVideoButton.classList.remove('hide')
      // this.playVideoButton.classList.add('show')
      //
      this.playVideoButtonText.classList.remove('hide')
      this.playVideoButtonText.classList.add('show')
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('hide')
            buttons[i].classList.add('show')
          }
        }
      }
    } else {
      this.inSpaceButton.classList.remove('show')
      this.inSpaceButton.classList.add('hide')
      //
      this.inHandButton.classList.remove('show')
      this.inHandButton.classList.add('hide')
      //
      this.whiteLine.classList.remove('show')
      this.whiteLine.classList.add('hide')
      //
      this.colorTextHolder.classList.remove('show')
      this.colorTextHolder.classList.add('hide')
      //
      this.infoButton.classList.remove('show')
      this.infoButton.classList.add('hide')
      //
      // this.playVideoButton.classList.remove('show')
      // this.playVideoButton.classList.add('hide')
      //
      this.playVideoButtonText.classList.remove('show')
      this.playVideoButtonText.classList.add('hide')
      if (this.isInHand) {
        const buttons = document.querySelectorAll('.flipButton, .animButton')
        if (buttons.length > 0) {
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('show')
            buttons[i].classList.add('hide')
          }
        }
      }
    }
  },

})

export {managerComponent}