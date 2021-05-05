const photoModeComponent = () => ({

  init() {
    const container = document.getElementById('photoModeContainer')
    const image = document.getElementById('photoModeImage')
    const shutterButton = document.getElementById('shutterButton')
    const closeButton = document.getElementById('closeButton')
    const confirmButton = document.getElementById('confirmButton')
    const cardAlign = document.getElementById('cardAlign')
    const imageTarget = document.getElementById('target')

    // Container starts hidden so it isn't visible when the page is still loading

    closeButton.addEventListener('click', () => {
      container.classList.remove('photo')
    })

    confirmButton.addEventListener('click', () => {
      container.classList.remove('photo')
      container.style.display = 'none'
      this.spawnPhone(imageTarget)
    })

    shutterButton.addEventListener('click', () => {
      // Emit a screenshotrequest to the xrweb component
      this.el.sceneEl.emit('screenshotrequest')

      // Show the flash while the image is being taken
      container.classList.add('flash')
    })

    this.el.sceneEl.addEventListener('screenshotready', (e) => {
      // Hide the flash
      container.classList.remove('flash')

      // If an error occurs while trying to take the screenshot, e.detail will be empty.
      // We could either retry or return control to the user
      if (!e.detail) {
        return
      }

      // e.detail is the base64 representation of the JPEG screenshot
      image.src = `data:image/jpeg;base64,${e.detail}`

      // Show the photo
      container.classList.add('photo')
    })
  },

  spawnPhone(target) {
    const phone = document.createElement('a-entity')
    phone.id = 'phoneModel'
    phone.setAttribute('gltf-model', '#phone')
    phone.setAttribute('rotation', '0 180 -90')
    phone.setAttribute('position', '1 0 0')
    phone.setAttribute('color-selector', {
      bodyColors: 'blue, gold, graphite, silver',
      buttonRGB: '(45 78 92), (252 235 211), (82 81 77), (230 231 226)',
      body: 'iphone12_pro_Body',
    })
    phone.setAttribute('scale', '.4 .4 .4')

    target.appendChild(phone)
  },
})

export {photoModeComponent}