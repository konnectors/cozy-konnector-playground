import React from 'react'
import { snippets } from '../utils/storage'

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
      <span>
        { snipps.length > 0 ? 'Load snippet :' : null } 
        { snipps.length > 0 ? <select onChange={this.onChange}>
          <option>-</option>
          {
            snipps.map(x => <option key={x} value={x}>{ x }</option>)
          }
        </select> : null }
      </span>
    )
  }
}

class Controls extends React.Component {
  render () {
    return (
      <div>
        <button onClick={this.props.onSaveSnippet}>Save snippet</button>&nbsp;
        <SnippetSelector onChange={this.props.onLoadSnippet}/>
      </div>
    )
  }
}

export default Controls
