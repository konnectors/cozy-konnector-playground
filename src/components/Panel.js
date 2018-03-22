import React from 'react'
import Editor from './Editor'

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

    this.state = {
      items: [],
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
      x => {
        this.setState({ items: x[0], err: null })
      }
    )
  }

  render() {
    const { err, items, code } = this.state

    return (
      <div>
        <Editor
          code={code}
          onChange={newCode => this.update(newCode)}
        />
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
