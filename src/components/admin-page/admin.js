import Mht from '@target-energysolutions/mht'
import { useTranslation } from 'libs/langs'
import { useSelector } from 'react-redux'
// import { get } from 'lodash-es'
import { useState } from 'react'
import { Button, Avatar, Card, CardActions, CardTitle } from 'react-md'
import { configs, newBrokersConfigs } from './helper'
import { navigate } from '@reach/router'
import { useMutation, useQuery } from 'react-query'
import moment from 'moment'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
// import { getPublicUrl } from 'libs/utils/custom-function'

import {
  auctionsRequest,
  approveAuction,
  getApprovals,
  approveRejectBroker,
} from 'libs/api/auctions-api'

import BrokerHeader from 'components/broker-header'
import DocumentsContainer from 'components/docs-dialog'
// import UserInfoBySubject from 'components/user-info-by-subject'

import './style.scss'

const Admin = (logged, auctionId) => {
  const { t } = useTranslation()
  const [documentsDialog, setDocumentsDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [activeHeaderTab, setActiveHeaderTab] = useState(0)
  const [filter, setFilter] = useState(0)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

  const { data: auctionsRequestsData, refetch } = useQuery(
    ['auctionsRequest', '', ''],
    auctionsRequest,
  )

  const { data: getApprovalsList } = useQuery(['getApprovals'], getApprovals)

  const approveBrokerMutation = useMutation(approveRejectBroker, {
    onSuccess: (res) => {
      if (!res.error) {
        refetch()
      }
    },
  })

  const renderApprovalsData = () =>
    getApprovalsList?.response?.data?.map((el) => ({
      id: el?.id,
      status: el?.status,
      Logo: <Avatar src={el?.logo}></Avatar>,
      companyName: el?.name,
      country: el?.country,
      address: el?.address,
      email: el?.email,
      phone: el?.phone,
    }))
  const renderData = () =>
    auctionsRequestsData?.results?.map((el) => ({
      id: el?.uuid,
      title: el?.listing?.title,
      location: `${el?.listing?.property?.country?.['name_en']}, ${el?.listing?.property?.city?.['name_en']}`,
      owner: (
        // <UserInfoBySubject subject={el?.['submitted_by']}>
        //   {(res) => (
        <div className="subject">
          {' '}
          <Avatar
            src={auctionsRequestsData?.['organization_logo']}
            // src={
            //   get(res, 'photo.aPIURL', null)
            //     ? getPublicUrl(res?.photo?.aPIURL)
            //     : null
            // }
          >
            {auctionsRequestsData?.['organization_logo']}
          </Avatar>
          {auctionsRequestsData
            ? auctionsRequestsData?.['organization_name']
            : 'N/A'}
        </div>
        //   )}
        // </UserInfoBySubject>
      ),
      bidOpenDate: moment(el?.['auction_start_date']).format('DD MMM YYYY'),
      bidCloseDate: moment(el?.['auction_end_date']).format('DD MMM YYYY'),
      submissionDate: moment(el?.['created_date']).format('DD MMM YYYY'),
      status: el?.status,
      documents: (
        <Button
          flat
          primary
          // onClick={() => setDocAction(true)}
          onClick={() => {
            setDocumentsDialog(el?.listing?.documents)
            // navigate(`auctions/detail/${el?.uuid}/a`)
            // console.log(el?.listing?.documents, documentsDialog, 'docs')
          }}
        >
          View
        </Button>
      ),
    }))
  // const renderBrokerData = () =>
  //   auctionsRequestsData?.results?.map((el) => ({
  //     id: el?.uuid,
  //     logo: <Avatar src={''}></Avatar>,
  //     companyName: 'Test',
  //     country: 'Country, City',
  //     address: 'Address',
  //     email: 'Email@gmail.com',
  //     phone: '+968 245 375 65',
  //     status: 'Pending',
  //   }))
  const selectedRow = selectedRowSelector.map((id) => renderData()?.[id])
  const selectedRowBroker = selectedRowSelector.map(
    (id) => renderApprovalsData()?.[id],
  )
  const approveMutation = useMutation(approveAuction, {
    onSuccess: (res) => {
      if (!res.error) {
        refetch()
      }
    },
  })
  const onUpdateBrokerStatus = (apply) => {
    approveBrokerMutation.mutate({
      orgId: selectedRowBroker[0]?.id,
      apply,
    })
  }
  const onUpdateStatus = (status) => {
    approveMutation.mutate({
      uuid: selectedRow[0]?.id,
      status,
    })
  }
  const renderBidders = () =>
    auctionsRequestsData?.results?.map((el) => (
      <Card className="md-block-centered" key={'Name'}>
        <CardTitle
          title={'Faisal Alwati Taher Al Wheeb BA Omar'}
          subtitle={
            <div>
              <div className="info">
                <div className="label">+968 9703 2634</div>
              </div>
            </div>
          }
          avatar={<Avatar src={''} role="presentation" />}
        />
        <CardActions>
          <div className="email">
            Email: <div className="address"> nell .mendez@gmail.com</div>
          </div>
        </CardActions>
      </Card>
    ))
  const renderRegisteredCards = () =>
    auctionsRequestsData?.results?.map((el) => (
      <Card className="md-block-centered" key={'Name'}>
        <CardTitle
          title={'Name'}
          subtitle={
            <div>
              <div className="info">
                <div className="label">+968 9703 2634</div>
                <div className="sep"></div>
                <div className="label">Oman</div>
              </div>
              <div className="label">463 Al Kharjiyah St, Muscat, Oman</div>
            </div>
          }
          avatar={<Avatar src={''} role="presentation" />}
        />
        <CardActions>
          <div className="email">
            Email: <div className="address"> nell .mendez@gmail.com</div>
          </div>
        </CardActions>
      </Card>
    ))
  const auctionsView = (
    <>
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
                      navigate(`auctions/detail/${selectedRow[0]?.id}/a`)
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
    </>
  )
  const newBrokersView = (
    <>
      <h1>New Registered Broker</h1>
      <div className="admin-page-mht">
        <Mht
          id={'admin-dashboard'}
          configs={newBrokersConfigs}
          tableData={renderApprovalsData() || []}
          withChecked
          singleSelect
          withSearch
          // withFooter
          commonActions
          headerTemplate={
            selectedRowBroker?.length === 1 && (
              <div className="admin-page-mht-header">
                {`${selectedRowBroker.length} Row Selected`}
                <div>
                  {selectedRowBroker[0]?.status === 'New Request' && (
                    <>
                      <Button
                        className="admin-page-actionBtn"
                        primary
                        flat
                        onClick={() => onUpdateBrokerStatus('approve')}
                      >
                        {t('approve')}
                      </Button>
                      <Button
                        className="admin-page-actionBtn"
                        secondary
                        flat
                        onClick={() => onUpdateBrokerStatus('reject')}
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
    </>
  )
  const headerTabs = [
    {
      key: 'broker',
      className: `broker-header-title ${activeHeaderTab === 0 ? 'active' : ''}`,
      onClick: () => setActiveHeaderTab(0),
      title: 'Broker Company',
    },

    {
      key: 'bidder',
      className: `broker-header-title ${activeHeaderTab === 1 ? 'active' : ''}`,
      onClick: () => setActiveHeaderTab(1),
      title: 'Bidders',
    },
  ]
  const headerFilters = [
    {
      key: 'citizen',
      className: `switch-toggle ${filter === 0 ? 'active' : ''}`,
      onClick: () => setFilter(0),
      title: 'Omani Citizen',
      num: 10,
    },
    {
      key: 'resident',
      className: `switch-toggle ${filter === 1 ? 'active' : ''}`,
      onClick: () => setFilter(1),
      title: 'Omani Resident',
      num: 10,
    },
    {
      key: 'foreign',
      className: `switch-toggle ${filter === 2 ? 'active' : ''}`,
      onClick: () => setFilter(2),
      title: 'Foreign',
      num: 10,
    },
  ]
  const biddersAndBrokersView = (
    <>
      <h1>Registered Bidders & Brokers</h1>
      <div className="broker-page">
        <BrokerHeader tabs={headerTabs} filters={headerFilters} />
        <div className="broker-page-cards">
          {activeHeaderTab === 1 ? renderBidders() : renderRegisteredCards()}
        </div>
      </div>
    </>
  )
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-logo" onClick={() => navigate('/admin')}>
          LEILAM
        </div>
        <div className="admin-page-actions">
          <div
            className={`item ${currentTab === 2 && 'active'}`}
            onClick={() => setCurrentTab(2)}
          >
            Registered Bidders & Brokers
          </div>
          <div
            className={`item ${currentTab === 1 && 'active'}`}
            onClick={() => setCurrentTab(1)}
          >
            New Registered Broker
          </div>
          <div
            className={`item ${currentTab === 0 && 'active'}`}
            onClick={() => setCurrentTab(0)}
          >
            Auctions
          </div>
        </div>
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
      {currentTab === 0 && auctionsView}
      {currentTab === 1 && newBrokersView}
      {currentTab === 2 && biddersAndBrokersView}

      {documentsDialog && (
        <DocumentsContainer
          visible={documentsDialog}
          onHide={() => setDocumentsDialog(false)}
          data={documentsDialog || []}
        />
      )}
    </div>
  )
}
export default Admin
