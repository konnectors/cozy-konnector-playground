import React from 'react'
import Editor from '../Editor'
import Result from '../Result'
import storage, { mkStore } from '../../utils/storage'
import './style.css'

const wrapInTry = code => {
  return `try{ ${code} } catch (e) {e}`
}

const snippets = mkStore('snippet__')

class SnippetSelector extends React.Component {
  constructor () {
    super()
    this.onChange = this.onChange.bind(this)
  }

  onChange (ev) {
    this.props.onChange(ev.target.value)
  }

  render () {
    const snipps = snippets.ls()
    return (
      snipps.length > 0 ? <select onChange={this.onChange}>
        <option>-</option>
      {
        snipps.map(x => <option key={x} value={x}>{ x }</option>)
      }</select> : null
    )
  }
}

class Controls extends React.Component {
  render () {
    return (
      <div>
        <button onClick={this.props.onSaveSnippet}>Save snippet</button>&nbsp;
        Load snippet : <SnippetSelector onChange={this.props.onLoadSnippet}/>
      </div>
    )
  }
}

const DEFAULT_CODE = `scrape($, {
  title: '.title',
  content: '.content'
}, '.article')`

class Panel extends React.Component {
  constructor() {
    super()

    this.state = {
      result: [],
      err: null,
      code: storage.load('code') || DEFAULT_CODE
    }

    this.handleSaveSnippet = this.handleSaveSnippet.bind(this)
    this.handleLoadSnippet = this.handleLoadSnippet.bind(this)
  }

  handleSaveSnippet () {
    const name = window.prompt('name of the snippet ?')
    snippets.save(name, this.state.code)
    this.forceUpdate()
  }

  handleLoadSnippet (snippetName) {
    const code = snippets.load(snippetName)
    this.setState({ code })
    this.sendScript(code)
  }

  componentDidMount () {
    this.sendScript(this.state.code)
  }

  update(code) {
    this.setState({code})
    this.sendScript(code)
    storage.save('code', code)
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
          onChange={(editor, data, value) => this.update(value)}
        />
        <Controls
          onSaveSnippet={this.handleSaveSnippet}
          onLoadSnippet={this.handleLoadSnippet}
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
