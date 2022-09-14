/* eslint-disable indent */
import { useEffect, useState } from 'react'
import { Avatar, Button, FontIcon } from 'react-md'
import { useQuery, useMutation as useMutationQuery } from 'react-query'
import store from 'libs/store'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { get } from 'lodash-es'
import {
  useSubscription,
  useMutation,
  useQuery as useQueryApollo,
} from 'react-apollo'

import { useTranslation } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import {
  getAuction,
  auctionProperty,
  auctionFeaturedProperty,
  checkParticipant,
  getFeaturedAuction,
  approveAuction,
  saveAsFav,
  unsaveAsFav,
} from 'libs/api/auctions-api'

import subscribeNewBid from 'libs/queries/auction/subscription-new-bid.gql'
import subscribeTimeExtension from 'libs/queries/auction/subscription-time-extension.gql'
import placeBid from 'libs/queries/auction/place-bid.gql'
import getBids from 'libs/queries/auction/get-bids.gql'

import { addToast } from 'modules/app/actions'

import ToastMsg from 'components/toast-msg'
import DrawOnMap from 'components/draw-on-map'
import AuctionTimer from 'components/auction-timer'
import TermsCondition from 'components/terms-conditions'
import DocumentsContainer from 'components/docs-dialog'
import TermsDialogContainer from 'components/terms-dialog'
import BidDialog from 'components/place-bid-dialog'
// import SuccessfulRegistration from 'components/success-registration'
import ContactInfoDialog from 'components/contact-info-dialog/contact-info-dialog'
import FeesDialog from 'components/fees-dialog/fees-dialog'
import CompanyInfoById from 'components/company-info-by-id'
// import subscribeTimeExtension from 'libs/queries/auction/subscription-time-extension.gql'

import mailIcon from 'images/mail_gray.svg'
import phoneIcon from 'images/phone_white.svg'
import icon1 from './icons/bedroom.svg'
import icon2 from './icons/bath.svg'
import icon3 from './icons/area.svg'

import './style.scss'

const AuctionDetail = ({ auctionId, admin, logged, user }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [addressView, setAddressView] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(null)
  // const [successDialog, setSuccessDialog] = useState(false)
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
  const { data: biddersList, refetch: refetchBids } = useQueryApollo(getBids, {
    context: { uri: `${PRODUCT_APP_URL_API}/auction/graphql/query` },
    variables: { auctionUUID: auctionId },
  })
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
      // setSuccessDialog(true)
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
  const [feesDialog, setFeesDialog] = useState()

  useEffect(() => {
    setCurrentImg(
      auctionData?.listing?.images?.find((img) => img?.['cover_image'])
        ? auctionData?.listing?.images?.find((img) => img?.['cover_image'])?.url
        : auctionData?.listing?.images[0]?.url,
    )
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
        refetchBids()
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
    variables: { auctionID: auctionId },
  })
  useEffect(() => {
    refetchAuction()
  }, [subNewBid, timeExtension])
  useEffect(() => {
    if (
      biddersList?.bids[0]?.sub === user?.subject &&
      !(auctionData?.['last_bid']?.['member_subject'] === user?.subject)
    ) {
      dispatch(
        addToast(
          <ToastMsg text={'You have been outbid!'} type="success" />,
          'hide',
        ),
      )
    }
  }, [subNewBid, auctionData])
  const isActive =
    +moment.utc(auctionData?.['auction_start_date']) < +moment() &&
    +moment.utc(auctionData?.['auction_end_date']) > +moment()
  // console.log(
  //   Date.parse(auctionData?.['created_date']),
  //   Date.now(),
  //   isActive,
  //   'isActive',
  // )
  const saveAuctionMutation = useMutationQuery(saveAsFav, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg text={'Auction saved as favorite'} type="success" />,
            'hide',
          ),
        )
        refetchAuction()
      } else {
        dispatch(
          addToast(
            <ToastMsg text={'Something is wrong'} type="error" />,
            'hide',
          ),
        )
      }
    },
  })
  const unsaveAuctionMutation = useMutationQuery(unsaveAsFav, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Auction is removed from favorites list successfully'}
              type="success"
            />,
            'hide',
          ),
        )
        refetchAuction()
      } else {
        dispatch(
          addToast(
            <ToastMsg text={'Something is wrong'} type="error" />,
            'hide',
          ),
        )
      }
    },
  })
  const saveAuction = (uuid) => {
    saveAuctionMutation.mutate({
      uuid,
    })
  }
  const unsaveAuction = (uuid) => {
    unsaveAuctionMutation.mutate({
      uuid,
    })
  }
  const renderPropertyImages = () =>
    auctionData?.listing?.images?.map((image) => (
      <>
        <img
          key={image?.uuid}
          className="gallery-image item"
          onClick={() => setCurrentImg(image?.url)}
          src={`${image?.url}?token=${downloadToken}&view=true`}
        />
      </>
    ))
  const renderKeyFeatures = () =>
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
            className="view-map-btn"
            iconClassName="mdi mdi-map-marker-outline"
            onClick={() => setAddressView(!addressView)}
          >
            {t('view_map')}
          </Button>

          {addressView && (
            <DrawOnMap
              id={'address'}
              onClose={() => {
                setAddressView(false)
              }}
              readOnly={true}
              visible={addressView}
              layers={[
                {
                  type: 'symbol',
                  id: 'Symbol-Layer-Id',
                  items: [],
                },
              ]}
              longitude={auctionPropertyData?.['general_location_x']}
              latitude={auctionPropertyData?.['general_location_y']}
            />
          )}
        </div>
        <div className=" md-cell md-cell--9">
          <img
            className="gallery-image"
            src={`${currentImg}?token=${downloadToken}&view=true`}
          />
          {auctionData?.['is_bookmarked'] ? (
            <Button
              icon
              primary
              className="save-btn"
              iconClassName="fa fa-bookmark"
              onClick={(e) => {
                e.stopPropagation()
                unsaveAuction(auctionData?.uuid)
              }}
            />
          ) : (
            <Button
              icon
              primary
              className="save-btn"
              iconClassName="fa fa-bookmark-o"
              onClick={(e) => {
                e.stopPropagation()
                saveAuction(auctionData?.uuid)
              }}
            />
          )}
        </div>
        <div className="gallery-image-wrapper md-cell md-cell--3">
          {renderPropertyImages()}
        </div>
      </div>
      <div className="auction-details-info md-cell md-cell--5 md-grid">
        <div className="auction-details-info-header md-cell md-cell--12">
          {admin &&
            (auctionData?.status !== 'Pending' ? (
              <div
                className={`auction-details-info-header-status ${auctionData?.status}`}
              >
                {auctionData?.status}
              </div>
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
          <div className="note">
            Posted {moment(auctionData?.['created_date']).fromNow()}
          </div>
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
        {!isActive || admin ? (
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
                  <strong>{auctionData?.['starting_price']} OMR</strong>
                </div>
                <div>{t('start_price')}</div>
              </div>
              <div className="sep" />
              <div className="auction-timer-info">
                <div>
                  <strong> {auctionData?.['incremental_price']} OMR</strong>
                </div>
                <div>{t('minimum_incr')}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="md-cell md-cell--12">
              <AuctionTimer user={user} auctionData={auctionData} node />
            </div>
            <div className="auction-details-card center-text md-cell md-cell--6">
              <div>
                <strong>{auctionData?.['number_of_bids'] || 0}</strong>
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
          <CompanyInfoById
            orgId={auctionData?.['configurator_organization_id']}
          >
            {(res) => {
              // console.log(res, 'res')
              return (
                <>
                  <Avatar
                    className="owner-card-avatar"
                    src={
                      get(res, 'companyLogo.aPIID', null)
                        ? getPublicUrl(res?.companyLogo?.aPIID)
                        : null
                    }
                  >
                    {get(res, 'companyLogo.aPIID', null)
                      ? null
                      : get(res, 'name.0', '')}
                  </Avatar>

                  <div className="owner-card-info">
                    <div>{t('owned_by')}</div>
                    <div className="name">{res?.name}</div>
                  </div>
                  <Button
                    floating
                    iconEl={<img src={mailIcon} />}
                    className="owner-card-btn"
                    onClick={() =>
                      setShowContactInfo({
                        ownerName: res?.name,
                        contact: res?.email,
                        type: 'email',
                      })
                    }
                    // res?.phoneMobile
                  />
                  <Button
                    floating
                    primary
                    iconEl={<img src={phoneIcon} />}
                    className="owner-card-btn"
                    onClick={() =>
                      setShowContactInfo({
                        ownerName: res?.name,
                        contact: res?.phoneMobile,
                        type: 'phone',
                      })
                    }
                    // res?.email
                  />
                </>
              )
            }}
          </CompanyInfoById>
        </div>
        <div className="md-cell md-cell--12 btn-cell">
          {
            auctionData?.['last_bid'] &&
            auctionData?.['last_bid']?.['member_subject'] === user?.subject ? (
              <Button
                primary
                flat
                swapTheming
                // onClick={() => setDocAction(true)}
                className="auction-highest-btn"
                disabled
              >
                Current Highest Bidder
              </Button>
            ) : admin ? (
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
                  onClick={
                    () =>
                      isParticipant ? setBidDialog(true) : setTermsDialog(true)
                    // setBidDialog(true)
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
      {(admin || isActive) && (
        <div className="fees-commission md-cell md-cell--12">
          <div className="fees-commission-title">{t('fees')}</div>
          <div className="fees-commission-content">
            <div className="fees-commission-item">
              <div className="commission">
                {t('buyer')}
                <Button onClick={() => setFeesDialog('bayers')}>
                  <FontIcon>info</FontIcon>
                </Button>
              </div>
              <div className="value">11%</div>
            </div>
            <div className="fees-commission-item">
              <div className="commission">
                {t('comission')}
                <Button onClick={() => setFeesDialog('commission')}>
                  <FontIcon>info</FontIcon>
                </Button>
              </div>
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
      {/* {successDialog && (
        <SuccessfulRegistration
          visible={successDialog}
          onHide={() => setSuccessDialog(false)}
        />
      )} */}
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
      {showContactInfo && (
        <ContactInfoDialog
          visible={showContactInfo}
          onHide={() => setShowContactInfo()}
        />
      )}

      {feesDialog && (
        <FeesDialog type={feesDialog} onHide={() => setFeesDialog('')} />
      )}
    </div>
  )
}
export default AuctionDetail
