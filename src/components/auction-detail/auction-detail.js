import { useEffect, useState } from 'react'
import { Avatar, Button, FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'
import { useQuery, useMutation as useMutationQuery } from 'react-query'
import store from 'libs/store'
import moment from 'moment'

import { useDispatch } from 'react-redux'

import { addToast } from 'modules/app/actions'

import { get } from 'lodash-es'
import { getPublicUrl } from 'libs/utils/custom-function'
import { useSubscription, useMutation } from 'react-apollo'

import UserInfoBySubject from 'components/user-info-by-subject'
import ToastMsg from 'components/toast-msg'

import {
  getAuction,
  auctionProperty,
  auctionFeaturedProperty,
  checkParticipant,
  getFeaturedAuction,
  approveAuction,
} from 'libs/api/auctions-api'

import subscribeNewBid from 'libs/queries/auction/subscription-new-bid.gql'
import subscribeTimeExtension from 'libs/queries/auction/subscription-time-extension.gql'

import placeBid from 'libs/queries/auction/place-bid.gql'

// import subscribeTimeExtension from 'libs/queries/auction/subscription-time-extension.gql'

import AuctionTimer from 'components/auction-timer'
import TermsCondition from 'components/terms-conditions'
import DocumentsContainer from 'components/docs-dialog'
import TermsDialogContainer from 'components/terms-dialog'
import BidDialog from 'components/place-bid-dialog'

import mailIcon from 'images/mail_gray.svg'
import phoneIcon from 'images/phone_white.svg'
import icon1 from './icons/bedroom.svg'
import icon2 from './icons/bath.svg'
import icon3 from './icons/area.svg'

import './style.scss'

const AuctionDetail = ({ auctionId, isAdmin, logged }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const downloadToken = store?.getState()?.app?.dlToken

  const [docAction, setDocAction] = useState(false)
  const { data: auctionData, refetch: refetchAuction } = useQuery(
    [logged ? 'auctionData' : 'featAuctionData', auctionId],
    logged ? getAuction : getFeaturedAuction,
  )
  const { data: auctionPropertyData } = useQuery(
    [logged ? 'auctionProperty' : 'auctionFeaturedProperty', auctionId],
    logged ? auctionProperty : auctionFeaturedProperty,
  )
  const { data: isParticipant } = useQuery(
    ['checkParticipant', auctionId],
    logged && checkParticipant,
  )
  const approveMutation = useMutationQuery(approveAuction, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchAuction()
      }
    },
  })
  const onUpdateStatus = (status) => {
    approveMutation.mutate({
      uuid: auctionId,
      status,
    })
  }
  const paymentCallback = location.pathname
    .split('/')
    .filter((v) => v === 'success' || v === 'error')[0]
  useEffect(() => {
    if (paymentCallback === 'success') {
      dispatch(
        addToast(
          <ToastMsg text={'Payment done successfully '} type="success" />,
          'hide',
        ),
      )
    } else if (paymentCallback === 'error') {
      dispatch(
        addToast(
          <ToastMsg text={'Payment procedure has failed'} type="error" />,
          'hide',
        ),
      )
    } else {
    }
  }, [paymentCallback])
  const [currentImg, setCurrentImg] = useState('')
  const [termsDialog, setTermsDialog] = useState(false)
  const [bidDialog, setBidDialog] = useState(false)
  const [bidAmount, setBidAmount] = useState('')

  useEffect(() => {
    setCurrentImg(auctionData?.listing?.images[0]?.url)
  }, [auctionData])
  const [placeNewBid] = useMutation(placeBid, {
    context: { uri: `${PRODUCT_APP_URL_API}/auction/graphql/query` },
  })

  const onConfirmBid = () => {
    placeNewBid({
      variables: {
        input: {
          auctionUUID: auctionData?.uuid,
          LastBidID: auctionData?.['last_bid']?.uuid || '',
          Amount: +bidAmount,
        },
      },
    }).then((res) => {
      if (!res.error) {
        refetchAuction()
        setBidAmount('')
        setBidDialog(false)
        dispatch(
          addToast(
            <ToastMsg
              text={res.message || 'Bid placed successfully !'}
              type="success"
            />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res.error?.body?.message || 'error'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    })
  }

  const { data: subNewBid } = useSubscription(subscribeNewBid, {
    variables: { auctionID: auctionId },
    // uri: `${appUrl}/auction/graphql/query`,
  })
  const { data: timeExtension } = useSubscription(subscribeTimeExtension, {
    variables: { auctionID: '7d35ae96-6380-46ed-a25f-b3e4a468c34d' },
  })

  useEffect(() => {
    refetchAuction()
  }, [subNewBid, timeExtension])

  const isActive =
    +moment.utc(auctionData?.['auction_start_date']) < +moment() &&
    +moment.utc(auctionData?.['auction_end_date']) > +moment()
  // console.log(
  //   Date.parse(auctionData?.['created_date']),
  //   Date.now(),
  //   isActive,
  //   'isActive',
  // )
  const renderPropertyImages = () =>
    auctionData?.listing?.images?.map((image) => (
      <img
        key={image?.uuid}
        className="gallery-image item"
        onClick={() => setCurrentImg(image?.url)}
        src={`${image?.url}?token=${downloadToken}&view=true`}
      />
    ))

  const renderDays = () => {
    let date = moment(auctionData?.['created_date'])
    return moment([
      date.format('YYYY'),
      date.format('MM') - 1,
      date.format('DD'),
    ]).fromNow()
  }
  const renderKeyFeatures = () =>
  // .filter((el) => el?.['availability_status'])

    auctionData?.listing?.features?.map((el) => (
      <div key={el?.feature?.uuid} className="key-features-item">
        <FontIcon primary>task_alt</FontIcon> {el?.feature?.name}
      </div>
    ))
  return (
    <div className="auction-details md-grid md-grid--no-spacing">
      <div className="auction-details-gallery md-cell md-cell--7 md-grid">
        <div className="auction-details-header md-cell md-cell--12">
          <div className="title">{t('auction_detail')}</div>
          <Button
            flat
            primary
            className=""
            iconClassName="mdi mdi-map-marker-outline"
          >
            {t('view_map')}
          </Button>
        </div>

        <img
          className="gallery-image md-cell md-cell--12"
          src={`${currentImg}?token=${downloadToken}&view=true`}
        />
        <div className="gallery-image-wrapper md-cell md-cell--12">
          {renderPropertyImages()}
        </div>
      </div>
      <div className="auction-details-info md-cell md-cell--5 md-grid">
        <div className="auction-details-info-header md-cell md-cell--12">
          {isAdmin &&
            (auctionData?.status !== 'Pending' ? (
              <div>{auctionData?.status}</div>
            ) : (
              <>
                <Button
                  flat
                  primary
                  swapTheming
                  onClick={() => onUpdateStatus('Approved')}
                  className="auction-details-action"
                >
                  {t('approve')}
                </Button>
                <Button
                  flat
                  secondary
                  swapTheming
                  onClick={() => onUpdateStatus('Rejected')}
                  className="auction-details-action"
                >
                  {t('reject')}
                </Button>
              </>
            ))}
        </div>
        <div className="auction-details-card md-cell md-cell--12">
          <div className="note">Posted {renderDays()}</div>
          <div className="title">{auctionData?.listing?.title}</div>
          <div className="auction-details-card-details">
            <div className="auction-details-card-details-item">
              <img src={icon1} /> {auctionPropertyData?.['count_bedrooms']}{' '}
              Bedrooms
            </div>
            <div className="auction-details-card-details-item">
              <img src={icon2} />
              {auctionPropertyData?.['count_bathrooms']} Bathrooms
            </div>
            <div className="auction-details-card-details-item">
              <img src={icon3} />
              {auctionPropertyData?.['total_area']}
            </div>
          </div>
        </div>
        {!isActive || isAdmin ? (
          <div className="auction-details-card md-cell md-cell--12">
            <div className="auction-timer-details">
              <div className="auction-timer-info">
                <div>
                  <strong>
                    {moment(auctionData?.['auction_start_date']).format(
                      'DD MMM, YYYY',
                    )}
                  </strong>
                </div>
                <div>{t('start_date')}</div>
              </div>
              <div className="sep" />
              <div className="auction-timer-info">
                <div>
                  <strong>{auctionData?.['lot_number'] || 0}</strong>
                </div>
                <div>{t('lot_number')}</div>
              </div>
            </div>
            <div className="auction-timer-details">
              <div className="auction-timer-info">
                <div>
                  <strong>{auctionData?.['starting_price']} AED</strong>
                </div>
                <div>{t('start_price')}</div>
              </div>
              <div className="sep" />
              <div className="auction-timer-info">
                <div>
                  <strong> {auctionData?.['incremental_price']} AED</strong>
                </div>
                <div>{t('minimum_incr')}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="md-cell md-cell--12">
              <AuctionTimer
                auctionData={auctionData}
                node={{ increment: 1.0, bid: 23.0 }}
              />
            </div>
            <div className="auction-details-card center-text md-cell md-cell--6">
              <div>
                <strong>14</strong>
              </div>
              <div>{t('number_bids')}</div>
            </div>
            <div className="auction-details-card center-text md-cell md-cell--6">
              <div>
                <strong>{auctionData?.['lot_number'] || 0}</strong>
              </div>
              <div>{t('lot_number')}</div>
            </div>
          </>
        )}

        <div className="owner-card md-cell md-cell--12">
          <UserInfoBySubject
            key={auctionData?.listing?.['listed_by_member']}
            subject={auctionData?.listing?.['listed_by_member']}
          >
            {(res) => {
              // console.log(res, 'res')
              return (
                <>
                  <Avatar
                    className="owner-card-avatar"
                    src={
                      get(res, 'photo.aPIURL', null)
                        ? getPublicUrl(res?.photo?.aPIURL)
                        : null
                    }
                  >
                    {get(res, 'photo.aPIURL', null)
                      ? null
                      : get(res, 'fullName.0', '')}
                  </Avatar>

                  <div className="owner-card-info">
                    <div>{t('owned_by')}</div>
                    <div className="name">{res?.fullName}</div>
                  </div>
                  <Button
                    floating
                    iconEl={<img src={mailIcon} />}
                    className="owner-card-btn"
                    // res?.phoneMobile
                  />
                  <Button
                    floating
                    primary
                    iconEl={<img src={phoneIcon} />}
                    className="owner-card-btn"
                    // res?.email
                  />
                </>
              )
            }}
          </UserInfoBySubject>
        </div>
        <div className="md-cell md-cell--12">
          {
            isAdmin ? (
              <Button
                primary
                flat
                swapTheming
                onClick={() => setDocAction(true)}
                className="auction-details-btn"
              >
                {t('documents')}
              </Button>
            ) : (
              isActive && (
                <Button
                  flat
                  primary
                  swapTheming
                  className="auction-details-btn"
                  onClick={() =>
                    isParticipant ? setBidDialog(true) : setTermsDialog(true)
                  }
                >
                  {t('bid_now')}
                </Button>
              )
            )
            // ) : (
            //   <div className="auction-details-card md-cell md-cell--12">
            //     <div className="fees-commission-title">{t('fees')}</div>
            //     <div className="auction-timer-details">
            //       <div className="auction-timer-info">
            //         <div>
            //           <strong>12%</strong>
            //         </div>
            //         <div>{t('buyer')}</div>
            //       </div>
            //       <div className="sep" />
            //       <div className="auction-timer-info">
            //         <div>
            //           <strong>3%</strong>
            //         </div>
            //         <div>{t('comission')}</div>
            //       </div>
            //     </div>
            //   </div>
            // )
          }
        </div>
      </div>
      <TermsCondition
        description={auctionData?.description}
        termOfSale={auctionData?.['terms_of_sale']}
        disclosure={auctionData?.disclosure}
        className="md-cell md-cell--12"
      />
      {renderKeyFeatures()?.length > 0 && (
        <div className="key-features  md-cell md-cell--12">
          <div className="key-features-title">{t('key_features')}</div>
          <div className="key-features-content">{renderKeyFeatures()}</div>
        </div>
      )}
      {(isAdmin || isActive) && (
        <div className="fees-commission md-cell md-cell--12">
          <div className="fees-commission-title">{t('fees')}</div>
          <div className="fees-commission-content">
            <div className="fees-commission-item">
              <div>{t('buyer')}</div>
              <div className="value">11%</div>
            </div>
            <div className="fees-commission-item">
              <div>{t('comission')}</div>
              <div className="value">3%</div>
            </div>
          </div>
        </div>
      )}

      {docAction && (
        <DocumentsContainer
          visible={docAction}
          onHide={() => setDocAction(false)}
          data={auctionData?.listing?.documents}
        />
      )}
      {termsDialog && (
        <TermsDialogContainer
          visible={termsDialog}
          onHide={() => setTermsDialog(false)}
          auctionId={auctionData?.uuid}
        />
      )}
      {bidDialog && (
        <BidDialog
          visible={bidDialog}
          onHide={() => setBidDialog(false)}
          onClickCancel={() => setBidDialog(false)}
          incrementPrice={auctionData?.['incremental_price'] | 0}
          lastBidAmount={auctionData?.['last_bid']?.['bid_amount'] || 0}
          onclickPlace={onConfirmBid}
          bidAmount={bidAmount}
          setBidAmount={setBidAmount}
        />
      )}
    </div>
  )
}
export default AuctionDetail
