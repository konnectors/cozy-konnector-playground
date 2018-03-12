import React from 'react'

const Items = ({ items }) => {
  return (
    <pre>
      {JSON.stringify(items, null, 2)}
    </pre>
  )
}

const wrapInTry = code => {
  return `try{ ${code} } catch (e) {e}`
}

class Panel extends React.Component {
  constructor() {
    super()
    this.sendScript = this.sendScript.bind(this)
    this.state = { items: [], err: null }
    this.first = true
  }

  componentDidMount () {
    this.sendScript()
  }

  sendScript(ev) {
    browser.tabs.executeScript(
      {
        code: wrapInTry(this.textarea.value)
      },
      x => {
        this.setState({ items: x[0], err: null })
      }
    )
  }

  render() {
    const { err, items } = this.state
    return (
      <div>
        <textarea
          ref={ref=>{ this.textarea = ref }}
          rows="10"
          cols="30"
          onChange={this.sendScript}
          style={{ fontFamily: 'courier' }}
        >
          {`scrape($, {
          title: '.title',
          content: '.content'
        }, '.article')`}
        </textarea>
        <Items items={items} />
        {err
          ? <div style={{ background: 'crimson' }}>
              {err}{' '}
            </div>
          : null}
      </div>
    )
  }
}

export default Panel
