import { connect } from 'react-redux'
import { initialModule } from 'modules/analytics/actions'
import { dispatch } from 'libs/store'
export function analyticsConnect (moduleName, ...args2conn) {
  dispatch(initialModule(moduleName))
  return connect(...args2conn)
}
