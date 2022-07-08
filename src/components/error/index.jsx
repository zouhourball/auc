/* eslint-disable space-before-function-paren */
import React from 'react'
import cls from 'classnames'

import { withTranslationEx } from 'libs/langs'

import 'components/error/styles.scss'

@withTranslationEx
export default class Error extends React.PureComponent {
  render() {
    const { className, t, ...attrs } = this.props

    return (
      <div className={cls('ams-error-msg-wrapper', className)} {...attrs}>
        <div className="ams-error-msg">{t('errorMessage')}</div>
      </div>
    )
  }
}
// test
