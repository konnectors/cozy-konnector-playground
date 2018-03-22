import React from 'react'
import './style.css'
import cx from 'classnames'

const Result = ({
  result,
  error
}) => (
  <pre className={cx('Result', {'Result-error': error})}>
    <div>{JSON.stringify(result, null, 2)}</div>
    {error}
  </pre>
)

export default Result
