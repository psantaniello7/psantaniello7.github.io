const colorSelector = require('./color-selector')
const experienceManager = require('./experience-manager')
const playVideo = require('./play-video.js')
const deviceData = require('./config.json')
const wallpaperChangeComponent = () => ({
  schema: {
    deviceName: {type: 'string'},
    jsonData: {type: 'string'},
  },

  init() {
    this.playVideoButtonText = document.getElementById('playVideoButtonText')

    this.jsonData = JSON.parse(this.data.jsonData)

    // this.textureLoader = new THREE.TextureLoader()
    this.phone = document.getElementById(this.data.deviceName)
    this.canChange = true
    const texture = null
    this.texArray = []
    this.createTexArray()
    this.changeWallpaper()
  },

  changeWallpaper() {
    const phone = document.getElementById(`${this.phone.id}`)
    // console.log('Video Mesh in wallpaper-change:')
    // console.log(obj)
    phone.setAttribute('class', 'cantap')
    let count = 0

    phone.addEventListener('click', () => {
      if (this.playVideoButtonText.classList.contains('videoIsPlaying')) {
        this.canChange = false
      } else {
        // phone.setAttribute('wallpaper-change')
        this.canChange = true
        
        const imgScn = phone.getObject3D('mesh').getObjectByName('BodyScreen')
        const obj = phone.getObject3D('mesh').getObjectByName('Screen')
        // console.log('Wallpaper textures lenghth:')
        // console.log(wallpaperTextures.length)

        // const texture = new THREE.TextureLoader().load(wallpaperTextures[count].src)
        const texture = this.texArray[count]
        if (count === this.texArray.length - 1) {
          count = 0
        } else {
          count += 1
        }
        // imgScn.visible = false
        obj.visible = true

        obj.material.map = texture
        obj.material.map.flipY = false
        // obj.material.map.repeat = {x: 1, y: 1}
        obj.material.map.wrapS = THREE.ClampToEdgeWrapping
        obj.material.map.wrapT = THREE.ClampToEdgeWrapping
        // obj.material.map.center.set(0.5, 0.5)
        obj.material.map.rotation = 0
      }
    })
  },

  createTexArray() {
    let texture
    let material
    let materialArray = []
    const wallpaperTextures = deviceData.wallpapers
    // const array = this.colorArray

    for (let i = 0; i < wallpaperTextures.length; i++) {
      texture = require(`${wallpaperTextures[i]}`)
      texture = new THREE.TextureLoader().load(texture)
      // material = new THREE.MeshStandardMaterial()
      // material.map = this.textureLoader.load(texture)
      // material.map.flipY = false
      // material.map.wrapS = 1000
      // material.map.wrapT = 1000
      // material.map.rotation = 0
      // material.map.needsUpdate = true
      this.texArray.push(texture)
    }
  },

})
export {wallpaperChangeComponent}