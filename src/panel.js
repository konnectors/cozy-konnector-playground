import ReactDOM from 'react-dom'
import React from 'react'
import './compat'
import Panel from './components/Panel'


// https://developer.chrome.com/extensions/devtools.panels#event-ElementsPanel-onSelectionChanged

document.addEventListener('DOMContentLoaded', () => {
  browser.tabs.executeScript({
    file: './toInject.js'
  })
  const node = document.querySelector('#app')
  ReactDOM.render(<Panel />, node)
})
