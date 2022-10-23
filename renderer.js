document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

const apiVer  = document.getElementById('api-version')
const appVer  = document.getElementById('app-version')
const saveVer = document.getElementById('save-path')
window.electronAPI.onUpdateVersions((_event, value, value2, value3) => {
    apiVer.innerText  = value
    appVer.innerText  = value2
    saveVer.innerText = value3
})

const totalDown = document.getElementById('totalDown')
const currDown  = document.getElementById('currDown')
const totalUp   = document.getElementById('totalUp')
const currUp    = document.getElementById('currUp')

window.electronAPI.onUpdateBytes((_event, value, value2, value3, value4) => {
    totalDown.innerText  = value
    currDown.innerText   = value2
    totalUp.innerText    = value3
    currUp.innerText     = value4
})



