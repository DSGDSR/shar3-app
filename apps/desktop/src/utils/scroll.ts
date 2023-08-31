export const toggleScroll = (state = true) => {
    document.documentElement.style.overflowY = state ? 'auto' : 'hidden'
}