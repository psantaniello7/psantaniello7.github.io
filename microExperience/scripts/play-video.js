const colorSelector = require('./color-selector')
const experienceManager = require('./experience-manager')
AFRAME.registerComponent("play-video", {
  schema: {
    deviceName: {type: 'string'},
    jsonData: {type: 'string'},
  },

  init() {

    this.jsonData = JSON.parse(this.data.jsonData)
    // console.log(this.jsonData.screenMesh)
    this.textureLoader = new THREE.TextureLoader()
    this.phone = document.getElementById(this.data.deviceName)
    // this.playVideo = document.getElementById('playVideoButton')
    this.expandUI = document.getElementById('expandContainer')
    this.expandButton = document.getElementById('expandButton')
    this.verizonLogo = document.getElementById('verizonLogo')
    // this.playVideoButton = document.getElementById('playVideoButton')
    this.playVideoButtonText = document.getElementById('playVideoButtonText')
    this.colorTextHolder = document.getElementById('colorText')
    this.inSpaceButton = document.getElementById('inSpaceButton')
    this.infoButton = document.getElementById('infoButton')
    this.resetButton = document.getElementById('resetButton')
    this.animations = this.jsonData.animations
    this.animTime = 1500
    // this.playVideo.style.display = 'block'
    // this.animateAndPlayVideo()
    this.isVideoPlaying = false
    this.texture = null

    this.vid = null
    this.createVideo()
    this.expandButton.addEventListener('click', () => {
      if (this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        this.resetPhoneAfterVideo()
        this.playVideoButtonText.classList.remove('videoIsPlaying')
      }
    })
  },

  animateAndPlayVideo() {
    this.playVideoButtonText.addEventListener('click', () => {
      const device = document.getElementById(this.data.deviceName)
      this.resetButton.style.display = 'none'
      // console.log(device)
      if (!this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        // const currentRotation = device.getAttribute('rotation')

        if (this.inSpaceButton.classList.contains('active')) {
          device.setAttribute('animation__rotation', {
            property: 'rotation',
            dur: this.animTime,
            from: '0 0 0',
            to: '-30 0 90',
            easing: 'easeInOutCirc',
          })
          setTimeout(() => {
            device.removeAttribute('animation__rotation')
          }, this.animTime + 1)
        } else {
          const buttons = document.querySelectorAll('.flipButton')
          if (buttons.length   > 0) {
            console.log('Button Exists')
            for (let i = 0; i < buttons.length; i++) {
              if (buttons[i].innerHTML === 'Front View') {
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
                buttons[i].innerHTML = 'Back View'
              }
            }
          }
        }

        // setTimeout(() => {
          this.playVideoAfterRotation()
        this.infoButton.classList.add('hide')
        this.infoButton.classList.remove('show')
        // }, this.animTime / 1)
      } /* else {
        const vid = document.getElementById('videoSS')
        vid.pause()
        vid.currentTime = 0
        if (this.inSpaceButton.classList.contains('active')) {
          device.setAttribute('animation__rotation', {
            property: 'rotation',
            dur: this.animTime,
            from: '-30 0 90',
            to: '0 0 0',
            easing: 'easeInOutCirc',
          })

          setTimeout(() => {
            device.removeAttribute('animation__rotation')
          }, this.animTime + 1)
        }
        //setTimeout(() => {
          // this.playVideoAfterRotation()
          // Set Wallpaper here

          const phone = document.getElementById(`${this.phone.id}`)
          const obj = phone.getObject3D('mesh').getObjectByName(this.jsonData.screenMesh)
          obj.visible = false
          this.UIResetAfterVideo()
          // const name = this.colorTextHolder.innerHTML
          // // colorSelector.colorSelectComponent().init()
          // // colorSelector.colorSelectComponent().getColors()
          // // colorSelector.colorSelectComponent().createTexArray()
          // // colorSelector.colorSelectComponent().changePhoneColor(name)
          // // console.log(colorSelector.colorSelectComponent().getTexture(name))
          // this.texture = document.getElementById(name).src
          // console.log(this.texture)
          // const phone = document.getElementById(`${this.phone.id}`)
          // // console.log(phone)
          // const obj = phone.getObject3D('mesh').getObjectByName(this.jsonData.bodyMesh)
          // // console.log(obj)
          // obj.material.map = this.textureLoader.load(this.texture)
          // obj.material.map.flipY = false
          // obj.material.map.wrapS = 1000
          // obj.material.map.wrapT = 1000
          // obj.material.map.rotation = 0
          // obj.material.map.needsUpdate = true
          //
          // phone.setAttribute('color', name)
        //}, this.animTime / 1)
        // set texture to currently selected one
      } */
      // this.isVideoPlaying = !this.isVideoPlaying
    })
  },
  playVideoAfterRotation() {
    // const vid = document.createElement('video')
    // vid.setAttribute('id', 'dynVid')  // Create a unique id for asset
    // console.log(this.jsonData.promoVideo)
    // vid.setAttribute('src', this.jsonData.promoVideo)
    // vid.setAttribute('crossorigin', 'anonymous')
    // vid.setAttribute('id', 'dynVid')
    // // Append the new video to the a-assets, where a-assets id="assets-id"
    // console.log(document.getElementById('assets-id').tagName)
    // document.getElementById('assets-id').appendChild(vid)
    // const vid = document.getElementById('videoSS')
    // const videoSource = this.jsonData.promoVideo
    // vid.setAttribute('src', `${videoSource}`)
    const phone = document.getElementById(`${this.phone.id}`)
    const imgScn = phone.getObject3D('mesh').getObjectByName('BodyScreen')
    const obj = phone.getObject3D('mesh').getObjectByName('Screen')
    const texture = new THREE.VideoTexture(this.vid)
    imgScn.visible = false
    obj.visible = true

    obj.material.map = texture
    obj.material.map.flipY = false
    obj.material.map.repeat = {x: 1, y: 1}
    obj.material.map.wrapS = THREE.ClampToEdgeWrapping
    obj.material.map.wrapT = THREE.ClampToEdgeWrapping
    obj.material.map.center.set(0.5, 0.5)
    obj.material.map.rotation = THREE.MathUtils.degToRad(90)
    // vid.load()
    this.vid.play()
    this.UIAlterForVideo()
  },
  UIAlterForVideo() {
    this.expandUI.classList.remove('active')
    this.expandUI.classList.remove('inactive')
    this.expandButton.style.display = 'block'
    this.expandButton.classList.remove('active')
    // this.playVideoButton.style.display = 'none'
    this.playVideoButtonText.style.display = 'none'
    this.playVideoButtonText.classList.add('videoIsPlaying')
    const elements = document.querySelectorAll('.UIElement')
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    }
    this.verizonLogo.style.display = 'block'
    // this.isVideoPlaying = true
    // this.expandButton.style.display = 'none'

    // this.playVideoButton.style.bottom = '0.5vh'
    // this.playVideoButtonText.innerHTML = 'Stop videos'
    // this.playVideoButtonText.style.marginTop = '0.0vmin'
  },
  UIResetAfterVideo() {
    // this.expandUI.classList.remove('active')
    // this.expandUI.classList.remove('inactive')
    this.expandButton.style.display = 'block'
    this.expandButton.classList.remove('active')
    // this.playVideoButton.classList.remove('show')
    // this.playVideoButtonText.classList.remove('show')
    // this.playVideoButton.classList.add('hide')
    // this.playVideoButtonText.classList.add('hide')
    // this.playVideoButton.style.bottom = '3.0vh'
    // this.playVideoButtonText.innerHTML = 'Watch videos'

    // this.playVideoButton.style.display = 'none'
    this.playVideoButtonText.style.display = 'none'
    // this.playVideoButton.style.bottom = '0.5vh'
    // this.playVideoButtonText.innerHTML = 'play videos'
    // this.playVideoButtonText.style.marginTop = '0.0vmin'
  },
  resetPhoneAfterVideo() {
    const device = document.getElementById(this.data.deviceName)
    // const vid = document.getElementById('videoSS')
    this.vid.pause()
    this.vid.currentTime = 0
    if (this.inSpaceButton.classList.contains('active')) {
      device.setAttribute('animation__rotation', {
        property: 'rotation',
        dur: this.animTime,
        from: '-30 0 90',
        to: '0 0 0',
        easing: 'easeInOutCirc',
      })

      setTimeout(() => {
        device.removeAttribute('animation__rotation')
      }, this.animTime + 1)
    }
    // setTimeout(() => {
    // this.playVideoAfterRotation()
    // Set Wallpaper here

    const phone = document.getElementById(`${this.phone.id}`)
    const imgScr = phone.getObject3D('mesh').getObjectByName('BodyScreen')
    const obj = phone.getObject3D('mesh').getObjectByName('Screen')
    obj.visible = false
    imgScr.visible = true
  },

  createVideo() {
    const scene = this.el.sceneEl
    this.vid = document.createElement('video')
    this.vid.setAttribute.id = 'videoSS'
    const videoSource = this.jsonData.promoVideo
    this.vid.setAttribute('src', `${videoSource}`)
    this.vid.setAttribute('crossorigin', 'anonymous')
    this.vid.setAttribute('controls', 'true')
    this.vid.setAttribute('webkit-playsinline', '')
    this.vid.setAttribute('playsinline', '')

    scene.appendChild(this.vid)
    this.vid.play()
    this.vid.pause()
    this.vid.currentTime = 0

    this.vid.addEventListener('canplaythrough', () => {
      this.playVideoButtonText.classList.add('loaded')
      this.animateAndPlayVideo()
    })
  },
})