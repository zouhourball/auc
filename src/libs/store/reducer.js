import { combineReducers } from 'redux'
import { reducer as query } from '@target-energysolutions/react-hoc-query'
import { shell, reducers } from '@target-energysolutions/app-shell'
import mutation from 'modules/mutate/reducers'
import { selectRowsReducers } from '@target-energysolutions/mht'

import app from 'modules/app/reducers'

const reducer = combineReducers({
  query,
  app,
  shell,
  mutation,
  selectRowsReducers,
  ...reducers,
})

export default reducer
