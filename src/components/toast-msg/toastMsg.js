import React from 'react'

import { FontIcon } from 'react-md'

import './style.scss'

class ToastMsg extends React.Component {
  renderIcon = () => {
    const { type } = this.props
    switch (type) {
      case 'success':
        return (
          <FontIcon className="toastMsg_icon success">check_circle</FontIcon>
        )
      case 'error':
        return <FontIcon className="toastMsg_icon error">error</FontIcon>
      case 'warning':
        return <FontIcon className="toastMsg_icon warning">cancel</FontIcon>
      case 'info':
        return <FontIcon className="toastMsg_icon info">info</FontIcon>
      case 'outbid':
        return <FontIcon className="toastMsg_icon info">outbid</FontIcon>
      default:
        return <></>
    }
  }
  render () {
    const { text, type } = this.props

    return (
      <div className={`toastMsg ${type === 'outbid' ? 'class-outbid' : ''}`}>
        {this.renderIcon()}
        <div className="toastMsg_text">{text}</div>
      </div>
    )
  }
}
export default ToastMsg
