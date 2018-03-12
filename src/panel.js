import ReactDOM from 'react-dom'
import React from 'react'
import './compat'
import Panel from './components/Panel'


// https://developer.chrome.com/extensions/devtools.panels#event-ElementsPanel-onSelectionChanged

document.addEventListener('DOMContentLoaded', () => {
  const node = document.querySelector('#app')
  console.log('Trying to inject')
  chrome.tabs.executeScript({
    file: './toInject.js'
  })
  ReactDOM.render(<Panel />, node)
})
