import ReactDOM from 'react-dom'
import React from 'react'
import './compat'
import Panel from './components/Panel'
import RedBox from 'redbox-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, info) {
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (<div>
        <h1>Something went wrong.</h1>
        <RedBox error={this.state.error} />
      </div>)
    }
    return this.props.children
  }
}

// https://developer.chrome.com/extensions/devtools.panels#event-ElementsPanel-onSelectionChanged

document.addEventListener('DOMContentLoaded', () => {
  browser.tabs.executeScript({
    file: './toInject.js'
  })
  const node = document.querySelector('#app')
  ReactDOM.render(
    <ErrorBoundary>
      <Panel />
    </ErrorBoundary>, node)
})
