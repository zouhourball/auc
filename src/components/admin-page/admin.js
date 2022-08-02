import Mht from '@target-energysolutions/mht'
import { useTranslation } from 'libs/langs'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button } from 'react-md'
import { configs } from './helper'
import { navigate } from '@reach/router'
import { useMutation, useQuery } from 'react-query'
import moment from 'moment'
import { cleanUp } from '@target-energysolutions/hoc-oauth'

import { auctionsRequest, approveAuction } from 'libs/api/auctions-api'

import DocumentsContainer from 'components/docs-dialog'
import UserInfoBySubject from 'components/user-info-by-subject'

import './style.scss'

const Admin = () => {
  const { t } = useTranslation()
  const [documentsDialog, setDocumentsDialog] = useState(false)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

  const { data: auctionsRequestsData, refetch } = useQuery(
    ['auctionsRequest', '', ''],
    auctionsRequest,
  )
  const approveMutation = useMutation(approveAuction, {
    onSuccess: (res) => {
      if (!res.error) {
        refetch()
      }
    },
  })
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
        <Button
          flat
          primary
          onClick={() => {
            setDocumentsDialog(el?.listing?.documents)
            navigate(`auctions/detail/${el?.uuid}/a`)
            // console.log(el?.listing?.documents, 'docs')
          }}
        >
          View
        </Button>
      ),
    }))
  const selectedRow = selectedRowSelector.map((id) => renderData()?.[id])
  const onUpdateStatus = (status) => {
    approveMutation.mutate({
      uuid: selectedRow[0]?.id,
      status,
    })
  }
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-logo">LOGO</div>
        <Button
          onClick={() => {
            cleanUp()
            navigate('/public/home')
          }}
          flat
          swapTheming
          primary
          className="admin-page-loginBtn"
        >
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
          // withFooter
          commonActions
          headerTemplate={
            selectedRow?.length === 1 && (
              <div className="admin-page-mht-header">
                {`${selectedRow.length} Row Selected`}
                <div>
                  <Button
                    className="admin-page-actionBtn"
                    flat
                    onClick={() =>
                      navigate(`auctions/detail/${selectedRow[0]?.id}`)
                    }
                  >
                    {t('view_details')}
                  </Button>
                  {selectedRow[0]?.status === 'Pending' && (
                    <>
                      <Button
                        className="admin-page-actionBtn"
                        primary
                        flat
                        onClick={() => onUpdateStatus('Approved')}
                      >
                        {t('approve')}
                      </Button>
                      <Button
                        className="admin-page-actionBtn"
                        secondary
                        flat
                        onClick={() => onUpdateStatus('Rejected')}
                      >
                        {t('reject')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
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
