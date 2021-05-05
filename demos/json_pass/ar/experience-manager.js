const managerComponent = () => ({
  init() {
    const photoModeContainer = document.getElementById('photoModeContainer')
    const mainUIContainer = document.getElementById('mainUIContainer')
    const colorChangeContainer = document.getElementById('colorChangeContainer')
    const tryOnButton = document.getElementById('tryOnButton')

    mainUIContainer.style.display = 'block'

    tryOnButton.addEventListener('click', () => {
      mainUIContainer.style.display = 'none'
      photoModeContainer.style.display = 'block'
    })

    
    
  },
})

export {managerComponent}