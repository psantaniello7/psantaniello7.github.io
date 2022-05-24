let container;
let visisble;
let list = [];

export function updateList(data) {
    list.push([list.length, data])
    const listItem = document.createElement('h2')
    listItem.id = 'listData' + list.length
    listItem.innerHTML = 'Line ' + list.length + '  :  ' + data
    container.appendChild(listItem)

}

export function getList() {
    console.log(list)
    if (visisble) {
        document.getElementById('list-container').style.display = 'none'
        visisble = false;
    } else {
        document.getElementById('list-container').style.display = 'block'
        visisble = true;
    }
}

export function createListContainer(parent) {
    const containList = document.createElement('div')
    container = containList;
    containList.id = 'list-container'
    parent.appendChild(containList)
    containList.style.display = 'none'
    visisble = false;
}
