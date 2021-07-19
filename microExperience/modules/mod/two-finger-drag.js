const holdDragComponent = () => ({
  schema: {
    cameraId: {default: 'camera'},
    groundId: {default: 'ground'},
    factor: {default: 6},
  },
  init() {
    this.camera = document.getElementById(this.data.cameraId)
    this.threeCamera = this.camera.getObject3D('camera')
    this.ground = document.getElementById(this.data.groundId)

    this.resetButton = document.getElementById('resetButton')

    this.internalState = {
      fingerDown: false,
      dragging: false,
      distance: 0,
      fingerMoving: true,
      startDragTimeout: null,
      raycaster: new THREE.Raycaster(),
    }

    this.fingerDown = this.fingerDown.bind(this)
    this.startDrag = this.startDrag.bind(this)
    this.fingerMove = this.fingerMove.bind(this)
    this.fingerUp = this.fingerUp.bind(this)

    this.el.sceneEl.addEventListener('touchend', this.fingerUp)
    this.el.sceneEl.addEventListener('twofingermove', this.fingerMove)
    this.el.classList.add('cantap')  // Needs "objects: .cantap" attribute on raycaster.
  },
  tick() {
    if (this.internalState.dragging) {
      let desiredPosition = null
      if (this.internalState.positionRaw) {
        const screenPositionX = this.internalState.positionRaw.x / document.body.clientWidth * 2 - 1
        const screenPositionY = this.internalState.positionRaw.y / document.body.clientHeight * 2 - 1
        const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

        this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')

        this.internalState.raycaster.setFromCamera(screenPosition, this.threeCamera)
        const intersects = this.internalState.raycaster.intersectObject(this.ground.object3D, true)

        if (intersects.length > 0) {
          const intersect = intersects[0]
          this.internalState.distance = intersect.distance
          desiredPosition = intersect.point
        }
      }

      if (!desiredPosition) {
        desiredPosition = this.camera.object3D.localToWorld(new THREE.Vector3(0, 0, -this.internalState.distance))
      }

      desiredPosition.y = 0.5
      this.el.object3D.position.lerp(desiredPosition, 0.2)

      if (this.resetButton.style.display === 'none') {
        this.resetButton.style.display = 'block'
      }
    }
  },
  remove() {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  fingerDown(event) {
    this.internalState.fingerDown = true

    this.internalState.startDragTimeout = setTimeout(this.startDrag, this.data.dragDelay)
    this.internalState.positionRaw = event.detail.positionRaw
  },
  startDrag(event) {
    if (!this.internalState.fingerDown) {
      return
    }
    this.internalState.dragging = true
    this.internalState.distance = this.el.object3D.position.distanceTo(this.camera.object3D.position)
  },
  fingerMove(event) {
    this.fingerDown(event)
    this.internalState.positionRaw = event.detail.positionRaw
  },
  // handleEvent(event) {
  //   this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
  // },
  fingerUp(event) {
    this.internalState.fingerDown = false
    clearTimeout(this.internalState.startDragTimeout)

    this.internalState.positionRaw = null

    if (this.internalState.dragging) {
      const endPosition = this.el.object3D.position.clone()
      this.el.setAttribute('animation__drop', {
        property: 'position',
        to: `${endPosition.x} 0 ${endPosition.z}`,
        dur: 300,
        easing: 'easeOutQuad',
      })
    }
    this.internalState.dragging = false
  },
})

export {holdDragComponent}