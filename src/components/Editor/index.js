import React from 'react'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import './style.css'

const Editor = ({
  code,
  onChange
}) => (
  <CodeMirror
    className='Editor'
    value={code}
    onBeforeChange={onChange}
    options={{
      lineNumbers: true,
      mode: 'javascript'
    }}
  />
)

export default Editor
