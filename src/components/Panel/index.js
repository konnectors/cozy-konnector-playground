import React from 'react'
import Editor from '../Editor'
import Result from '../Result'
import './style.css'

const wrapInTry = code => {
  return `try{ ${code} } catch (e) {e}`
}

class Panel extends React.Component {
  constructor() {
    super()

    this.state = {
      result: [],
      err: null,
      code: `scrape($, {
  title: '.title',
  content: '.content'
}, '.article')`
    }
  }

  componentDidMount () {
    this.sendScript(this.state.code)
  }

  update(code) {
    this.setState({code})
    this.sendScript(code)
  }

  sendScript(code) {
    browser.tabs.executeScript(
      {
        code: wrapInTry(code)
      },
      result => {
        this.setState({ result: result[0], err: null })
      }
    )
  }

  render() {
    const { err, result, code } = this.state

    return (
      <div className="Panel">
        <Editor
          code={code}
          onChange={newCode => this.update(newCode)}
        />
        <Result
          result={result}
          error={err}
        />
      </div>
    )
  }
}

export default Panel
