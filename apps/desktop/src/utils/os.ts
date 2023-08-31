export const isMac = () => {
    return navigator.platform.toUpperCase().indexOf('MAC') > -1
}
  
export const isWindows = () => {
    return navigator.platform.toUpperCase().indexOf('WIN') > -1
}