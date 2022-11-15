import { configs, dummyDataMht } from './helper'
// import moment from 'moment'
import Mht from '@target-energysolutions/mht'
import './style.scss'
const AppointmentsRequests = () => {
  return (
    <div className="admin-page-mht">
      <Mht
        id={'admin-dashboard'}
        configs={configs()}
        tableData={dummyDataMht}
        withChecked
        singleSelect
        withSearch
        commonActions
        withFooter
        hideTotal
      />
    </div>
  )
}
export default AppointmentsRequests
