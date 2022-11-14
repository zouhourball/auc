import { configs } from './helper'
// import moment from 'moment'
import Mht from '@target-energysolutions/mht'
const AppointmentsRequests = () => {
  return (
    <div className="admin-page-mht">
      <Mht
        id={'admin-dashboard'}
        configs={configs()}
        tableData={[]}
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
