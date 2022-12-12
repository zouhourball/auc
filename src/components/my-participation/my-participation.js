import { useEffect, useState } from 'react'
// import moment from 'moment'

import { useSelector } from 'react-redux'
import { useTranslation } from 'libs/langs'

import { Button } from 'react-md'
import { useMutation, useQuery } from 'react-query'
import {
  getMyAuctions,
  myWalletBalance,
  depositAmount,
} from 'libs/api/auctions-api'
import BiddingCard from 'components/bidding-card'
import MyWallet from 'components/my-wallet'
import PaymentDetailsDialog from 'components/payment-details-dialog'

import './style.scss'

const ParticipatedAuctions = ({ meOrgs }) => {
  const { t } = useTranslation()
  const user = useSelector(({ app }) => app?.userInfos)

  const [tab, setTab] = useState(0)
  const [paymentDetails, setPaymentDetails] = useState(false)
  const [depositData, setDepositData] = useState({})
  const tabsData = [
    { id: 0, label: t('active') },
    { id: 1, label: t('won') },
    { id: 2, label: t('lost') },
    { id: 3, label: t('my_deposit') },
  ]

  const renderTabName = () => {
    switch (tab) {
      case 0:
        return 'Active'
      case 1:
        return 'Awarded'
      case 2:
        return 'Lost'
      default:
        return 'Active'
    }
  }
  const { data: myAuctions } = useQuery(
    [
      'getMyAuctions',
      {
        filter: {},
        sort: [],
        limit: 10,
        offset: 0,
      },
      renderTabName(),
    ],
    getMyAuctions,
  )
  const { data: myWalletData, refetch: refetchWallet } = useQuery(
    ['myWalletBalance'],
    myWalletBalance,
  )
  const depositAmountMutation = useMutation(depositAmount, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchWallet()
        setPaymentDetails(false)
        window.open(res?.['payment_url'])
      }
    },
  })
  useEffect(() => {
    setDepositData({
      return_url: `${PRODUCT_APP_URL_AUCTION}/auctions/my-participation`,
      wallet_id: myWalletData?.uuid,
      amount: {
        currency: myWalletData?.currency?.name,
      },
    })
  }, [myWalletData])
  // Payment callback goes here
  useEffect(() => {}, [])
  const renderCards = () => {
    return myAuctions?.results?.map((el, i) => (
      <BiddingCard
        user={user}
        className="md-cell md-cell--4"
        key={i}
        auctionData={el}
        status={tab === 0 && 'Active'}
        saveAuctionTag
        participated
        logged
        meOrgs={meOrgs}
      />
    ))
  }
  const renderTabs = () =>
    tabsData?.map((el) => (
      <Button
        className={`${tab === el?.id ? 'active' : ''}`}
        key={el.id}
        onClick={() => setTab(el.id)}
        primary={tab === el.id}
      >
        <span>{el.label}</span>
      </Button>
    ))
  const onDepositAmount = () => {
    depositAmountMutation.mutate({
      body: depositData,
    })
  }
  // const renderStatus = (auction) => {
  //   if (
  //     +moment.utc(auction?.['auction_end_date']).add(2, 'seconds') <
  //       +moment() ||
  //     auction?.['awarded_to']?.uuid
  //   ) {
  //     return 'Ended'
  //   } else if (+moment.utc(auction?.['auction_start_date']) > +moment()) {
  //     return 'Upcoming'
  //   } else return 'Active'
  // }

  return (
    <div className="my-participation-page md-grid">
      <div className="md-cell md-cell--3">
        {myWalletData && (
          <MyWallet
            myWalletData={myWalletData}
            refetchWallet={refetchWallet}
            amount={0}
            setAmount={() => {}}
            onContinue={() => {
              setPaymentDetails(true)
            }}
          />
        )}
      </div>
      <div className="sep"></div>
      <div className="auction-participation-list md-cell md-cell--8">
        <div className="auction-participation-list-header">
          <div className="title">{t('my_participation')}</div>
          <div className="tabs-list">{renderTabs()}</div>
        </div>

        <div className="md-grid auction-participation-list-cards">
          {renderCards()}
        </div>
        {paymentDetails && (
          <PaymentDetailsDialog
            visible={paymentDetails}
            onHide={() => setPaymentDetails(false)}
            depositData={depositData}
            setDepositData={setDepositData}
            actions={[
              <Button
                key={'cancel-btn'}
                raised
                className="cancel-btn"
                onClick={() => {
                  setPaymentDetails(false)
                }}
              >
                Cancel
              </Button>,
              <Button
                key={'deposit-btn'}
                raised
                primary
                className="confirm-btn"
                onClick={() => {
                  onDepositAmount()
                }}
              >
                Deposit Amount
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  )
}
export default ParticipatedAuctions
