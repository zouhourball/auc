import Mht from '@target-energysolutions/mht'
import { useTranslation } from 'libs/langs'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button } from 'react-md'
import { configs, dummyDataMht } from './helper'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import moment from 'moment'

import { auctionsRequest } from 'libs/api/auctions-api'

import DocumentsContainer from 'components/docs-dialog'
import UserInfoBySubject from 'components/user-info-by-subject'

import './style.scss'

const Admin = () => {
  const { t } = useTranslation()
  const [documentsDialog, setDocumentsDialog] = useState(false)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const selectedRow = selectedRowSelector.map((id) => dummyDataMht()?.[id])

  const { data: auctionsRequestsData } = useQuery(
    ['auctionsRequest', '', ''],
    auctionsRequest,
  )

  const renderData = () =>
    auctionsRequestsData?.results?.map((el) => ({
      id: el?.uuid,
      title: el?.listing?.title,
      location: `${el?.listing?.property?.['country_id']}, ${el?.listing?.property?.['city_id']}`,
      owner: (
        <UserInfoBySubject subject={el?.['submitted_by']}>
          {(res) => <div className="subject">{res ? res.fullName : 'N/A'}</div>}
        </UserInfoBySubject>
      ),
      bidOpenDate: moment(el?.['auction_start_date']).format('DD MMM YYYY'),
      bidCloseDate: moment(el?.['auction_end_date']).format('DD MMM YYYY'),
      submissionDate: moment(el?.['created_date']).format('DD MMM YYYY'),
      status: el?.status,
      documents: (
        <Button onClick={() => setDocumentsDialog(el?.listing?.documents)}>
          View
        </Button>
      ),
    }))

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-logo">LOGO</div>
        <Button flat swapTheming primary className="admin-page-loginBtn">
          {t('log_out')}
        </Button>
      </div>
      <h1>{t('auctions')}</h1>
      <div className="admin-page-mht">
        <Mht
          id={'admin-dashboard'}
          configs={configs}
          tableData={renderData() || []}
          withChecked
          singleSelect
          withSearch
          withFooter
          commonActions
          headerTemplate={
            (selectedRow?.length === 1 && (
              <div className="admin-page-mht-header">
                <div> {`${selectedRow.length} Row Selected`}</div>
                <div>
                  <Button
                    className="admin-page-actionBtn"
                    flat
                    onClick={() => navigate(`detail/${'1'}`)}
                  >
                    {t('view_details')}
                  </Button>
                  <Button className="admin-page-actionBtn" primary flat>
                    {t('approve')}
                  </Button>
                  <Button className="admin-page-actionBtn" secondary flat>
                    {t('reject')}
                  </Button>
                </div>
              </div>
            )) || <div />
          }
        />
      </div>
      {documentsDialog && (
        <DocumentsContainer
          visible={documentsDialog}
          onHide={() => setDocumentsDialog(false)}
          data={documentsDialog}
        />
      )}
    </div>
  )
}
export default Admin
