import React from 'react'
import Error from 'components/error'

export default class GeneralErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  render () {
    if (this.state.hasError) {
      return <Error />
    } else {
      return this.props.children
    }
  }

  componentDidCatch () {
    this.setState({ hasError: true })
  }
}
