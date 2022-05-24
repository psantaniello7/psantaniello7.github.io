export function Test() {
    console.log('Navigate')
}
let container;
let parentContainer;
let ARbutton;
export function createNavigation(parent) {
    const navContainer = document.createElement('div')
    container = navContainer;
    navContainer.id = 'nav-container'
    parentContainer = parent;
    parent.appendChild(navContainer)
    ARbutton = document.getElementById('ARButton')
    document.getElementById('nav-container').style.display = "none"
    createButtons()
}

export function showNav() {
    document.getElementById('nav-container').style.display = "block"
}

export function hideNav() {
    document.getElementById('nav-container').style.display = "none"
}


function createButtons() {
    ARbutton.addEventListener('click', ()=> {
        if(ARbutton.classList.contains('enabled')) {
            hideNav()
        } else {
            showNav()
        }
    })

    // const buttonCamera= document.createElement('div')
    // buttonCamera.id = 'camera-button'
    // container.appendChild(buttonCamera)

    const buttonRemove= document.createElement('div')
    buttonRemove.id = 'remove-button'
    container.appendChild(buttonRemove)

    const buttonList= document.createElement('div')
    buttonList.id = 'list-button'
    container.appendChild(buttonList)

    const buttonAdd = document.createElement('div')
    buttonAdd.id = 'add-button'
    container.appendChild(buttonAdd)

    // const buttonSubmit= document.createElement('div')
    // buttonSubmit.id = 'submit-button'
    // container.appendChild(buttonSubmit)

}
