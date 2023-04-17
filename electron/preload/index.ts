import { Settings } from "../../shared"

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
const useLoading = () => {
  let settings: Settings;
  try {
    settings = JSON.parse(localStorage.getItem('settings')) ?? null
  } catch {
    settings = null
  }

  console.log(settings)
  const styleContent = `
    .ring {
      --uib-size: 55px;
      --uib-speed: 2s;
      --uib-color: ${settings?.theme === 'light' ? '#111827' : '#f9fafb'};
      
      height: var(--uib-size);
      width: var(--uib-size);
      vertical-align: middle;
      transform-origin: center;
      animation: rotate var(--uib-speed) linear infinite;
    }
    
    .ring circle {
      fill: none;
      stroke: var(--uib-color);
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: stretch calc(var(--uib-speed) * 0.75) ease-in-out infinite;
    }
    
    @keyframes rotate { 100% { transform: rotate(360deg); } }
    
    @keyframes stretch {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dashoffset: -124px;
      }
    }
  
    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${settings?.theme === 'light' ? '#f9fafb' : '#111827'};
      z-index: 10;
    }`
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<svg class="ring" viewBox="25 25 50 50" stroke-width="5">
    <circle cx="50" cy="50" r="20" />
  </svg>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(() => {
  appendLoading()
})

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)