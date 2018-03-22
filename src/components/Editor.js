import React from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

const Editor = ({
  code,
  onChange
}) => (
  <CodeMirror
    value={code}
    onChange={onChange}
    options={{
      lineNumbers: true,
      mode: 'javascript'
    }}
  />
)

export default Editor
