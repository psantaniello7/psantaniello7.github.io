import {managerComponent} from './modules/experience-manager.js'
// import {spawnDeviceComponent} from './modules/device-spawn.js'
// import {colorSelectComponent} from './modules/color-selector.js'
// import {animSelectComponent} from './modules/animation-selector.js'
// import {playVideoComponent} from './modules/play-video.js'
// import {holdDragComponent} from './modules/two-finger-drag.js'
// import {oneFingerRotateComponent} from './modules/one-finger-rotate.js'
// import {pinchScaleComponent} from './modules/pinch-scale.js'
// import {wallpaperChangeComponent} from './modules/wallpaper-change.js'

AFRAME.registerComponent('experience-manager', managerComponent())
// AFRAME.registerComponent('device-spawn', spawnDeviceComponent())
// AFRAME.registerComponent('color-selector', colorSelectComponent())
// AFRAME.registerComponent('animation-selector', animSelectComponent())
// AFRAME.registerComponent('play-video', playVideoComponent())
// AFRAME.registerComponent('two-finger-drag', holdDragComponent())
// AFRAME.registerComponent('one-finger-rotate', oneFingerRotateComponent())
// AFRAME.registerComponent('pinch-scale', pinchScaleComponent())
// AFRAME.registerComponent('wallpaper-change', wallpaperChangeComponent())

console.log('WE DID IT!')