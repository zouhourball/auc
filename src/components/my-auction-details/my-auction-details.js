import { useState, useEffect } from 'react'
import { useQuery as useQueryApollo, useSubscription } from 'react-apollo'
import { TextField, Button, FontIcon } from 'react-md'
import UploadImages from 'components/upload-images'
import { useTranslation } from 'libs/langs'
import store from 'libs/store'
import getBids from 'libs/queries/auction/get-bids.gql'
import subscribeNewBid from 'libs/queries/auction/subscription-new-bid.gql'
import subscribeTimeExtension from 'libs/queries/auction/subscription-time-extension.gql'

import { dummyData } from './helpers'

import { useQuery, useMutation } from 'react-query'
import { getAuction, updateAuction, updateImgs } from 'libs/api/auctions-api'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'
import { DueDate } from 'components/due-date'
import { useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'
import ToastMsg from 'components/toast-msg'
import UserInfoBySubject from 'components/user-info-by-subject'

import './style.scss'

const MyAuctionDetails = ({ auctionId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [keyFeature, setKeyFeature] = useState()
  // const [suggestedKeyPanel, setSuggestedKeysPanel] = useState(false)
  // const [propertyDetails, setPropertyDetails] = useState({})
  const [showMore, setShowMore] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [images, setImages] = useState([])
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)

  const [auctionEditData, setAuctionEditData] = useState({
    title: '',
    propertyType: '',
    city: '',
    startDate: '',
    endDate: '',
    startingPrice: '',
    incrementalPrice: '',
    description: '',
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  // get auction details api
  const { data: auctionDetails, refetch: refetchAuction } = useQuery(
    ['auctionDetails', auctionId],
    getAuction,
  )
  useEffect(() => {
    setAuctionEditData({
      title: auctionDetails?.listing?.title,
      propertyType: auctionDetails?.listing?.property?.['property_type_id'],
      city: auctionDetails?.listing?.property?.city?.['name_en'],
      startDate: auctionDetails?.['auction_start_date'],
      endDate: auctionDetails?.['auction_end_date'],
      startingPrice: auctionDetails?.['starting_price'],
      incrementalPrice: auctionDetails?.['incremental_price'],
      description: auctionDetails?.description,
      keyFeatures: auctionDetails?.listing?.features?.map((el) => el?.feature),
    })
    setImages(auctionDetails?.listing?.images)
  }, [auctionDetails])

  const { data: biddersList, refetch: refetchBids } = useQueryApollo(getBids, {
    context: { uri: `${PRODUCT_APP_URL_API}/auction/graphql/query` },
    variables: { auctionUUID: auctionId },
  })
  const { data: subNewBid } = useSubscription(subscribeNewBid, {
    variables: { auctionID: auctionId },
    // uri: `${appUrl}/auction/graphql/query`,
  })
  const { data: timeExtension } = useSubscription(subscribeTimeExtension, {
    variables: { auctionID: auctionId },
  })
  useEffect(() => {
    refetchBids()
  }, [subNewBid, timeExtension])

  // useEffect(() => {
  //   setPropertyDetails({
  //     ...dummyBiddersData,
  //   })
  // }, [dummyBiddersData])

  const onSetFormDetails = (property, value) => {
    setAuctionEditData({ ...auctionEditData, [property]: value })
  }
  const handleRemoveKey = (key) => {
    onSetFormDetails(
      'keyFeatures',
      auctionEditData?.keyFeatures.filter((el) => el?.name !== key?.name),
    )
  }
  const downloadToken = store?.getState()?.app?.dlToken

  // const renderSuggestedKeys = () => {
  //   return auctionEditData?.keyFeatures?.map((key, i) => (
  //     <Checkbox
  //       key={i}
  //       id={key?.uuid}
  //       checked={
  //         !!auctionEditData?.keyFeatures?.find((el) => el.name === key.name)
  //       }
  //       onChange={(v) =>
  //         v
  //           ? onSetFormDetails('keyFeatures', [
  //             ...auctionEditData?.keyFeatures,
  //             { name: key.name, status: 'new' },
  //           ])
  //           : handleRemoveKey(key)
  //       }
  //       className="md-cell md-cell--3"
  //       label={key?.name}
  //     />
  //   ))
  // }
  const addKeyFeature = () => {
    setKeyFeature('')
    onSetFormDetails('keyFeatures', [
      ...auctionEditData?.keyFeatures,
      { name: keyFeature, status: 'new' },
    ])
  }

  const renderNewKeys = () => {
    return auctionEditData?.keyFeatures?.map((updatedKey, index) => (
      <div key={index} className="chipWrapper-item">
        <span className="label">{updatedKey?.name}</span>
        <FontIcon primary onClick={() => handleRemoveKey(updatedKey)}>
          {t('close')}
        </FontIcon>
      </div>
    ))
  }

  const renderImages = () =>
    images?.map((el, i) => (
      <img
        key={i}
        src={`${el.url}?token=${downloadToken}&view=true`}
        className="auction-details-img"
      />
    ))
  const renderBidders = () =>
    biddersList?.bids?.map((el) => (
      <UserInfoBySubject key={el?.sub} subject={el?.sub}>
        {(res) => (
          <div key={el?.sub} className="auction-details-table-row">
            <div>{res?.fullName}</div>
            <div>{res?.email}</div>
            <div>{res?.phoneMobile}</div>
            <div>{moment(el?.date * 1000).format('DD MMM YYYY')}</div>
            <div>{moment(el?.date * 1000).format('hh:mm')}</div>
            <div>{el?.amount}</div>
          </div>
        )}
      </UserInfoBySubject>
    ))
  const setListImages = (newImages, keyAction, fileId) => {
    if (keyAction === 'delete') {
      setImages((imgs) => imgs?.filter((el) => el.url !== fileId))
    } else if (keyAction === 'add') {
      setImages((imgs) => [...imgs, ...newImages])
    } else {
      setImages(newImages)
    }
  }
  // update auction details
  const updateAuctionData = useMutation(updateAuction, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchAuction()
        dispatch(
          addToast(
            <ToastMsg
              text={'Auction is updated successfully' || 'success'}
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
    },
  })
  const updateImages = useMutation(updateImgs)
  const onDisableEdit = () => {
    if (editMode) {
      updateAuctionData.mutate({
        uuid: auctionId,
        body: {
          // ...updateAuctionFormatData(auctionDetails),
          title: auctionEditData?.title,
          auction_start_date: new Date(auctionEditData?.startDate),
          auction_end_date: new Date(auctionEditData?.endDate),
          incremental_price: +auctionEditData?.incrementalPrice,
          starting_price: +auctionEditData?.startingPrice,
          property_type: +auctionEditData?.propertyType,
          property_description: auctionEditData?.description,
          features: auctionEditData?.keyFeatures,
        },
      })
      updateImages.mutate({
        uuid: auctionId,
        body: images,
      })
    }
    setEditMode(!editMode)
    setShowDatePicker(false)
  }
  // const onHandleDate = (date, key) => {
  //   setAuctionEditData({
  //     ...auctionEditData,
  //     [key]: moment(date.timestamp).format('DD MMM YYYY'),
  //   })
  //   setShowDatePicker({ ...showDatePicker, [key]: false })
  // }
  const onSetDate = (start, end) => {
    setAuctionEditData({
      ...auctionEditData,
      startDate: start,
      endDate: end,
    })
  }
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        <div className="title">{t('auctions_details')}</div>
      </div>
      <div className="auction-details-info">
        <div className="auction-details-form">
          <TextField
            id={'title'}
            label={t('title_label')}
            value={auctionEditData?.title}
            disabled={!editMode}
            onChange={(v) =>
              setAuctionEditData({ ...auctionEditData, title: v })
            }
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'property-type'}
            label={t('property_type_label')}
            value={auctionEditData?.propertyType}
            onChange={(v) =>
              setAuctionEditData({ ...auctionEditData, propertyType: v })
            }
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'address'}
            label={t('address_label')}
            value={dummyData?.address}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'city'}
            label={t('city_label')}
            value={auctionEditData?.city}
            onChange={(v) =>
              setAuctionEditData({ ...auctionEditData, city: v })
            }
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'coundivy'}
            label={t('coundivy_label')}
            value={dummyData?.coundivy}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <div>
            <TextField
              id={'start-end-date'}
              label={t('start_end_dates_label')}
              value={`${moment(auctionEditData?.startDate).format(
                'DD/MM/YYYY',
              )} - ${moment(auctionEditData?.endDate).format('DD/MM/YYYY')}`}
              onChange={(v) =>
                setAuctionEditData({ ...auctionEditData, startDate: v })
              }
              onClick={() => {
                editMode && setShowDatePicker(true)
              }}
              disabled={!editMode}
              className="auction-details-form-textField"
              block
            />
            {showDatePicker && (
              // <DatePicker
              //   singlePick
              //   translation={{ update: 'select' }}
              //   onUpdate={(date) => onHandleDate(date, 'startDate')}
              //   onCancel={() =>
              //     setShowDatePicker({ ...showDatePicker, startDate: false })
              //   }
              //   minValidDate={{ timestamp: new Date().getTime() }}
              //   startView="year"
              //   endView="day"
              // />
              <DueDate
                duedate={showDatePicker?.endDate}
                startDate={showDatePicker?.startDate}
                applicationStartDate={showDatePicker?.startDate}
                onDateChange={(start, end) => {
                  let startD = new Date(
                    moment(start)
                      .hour(moment(showDatePicker?.startTime).hour())
                      .minute(moment(showDatePicker?.startTime).minute())
                      .valueOf(),
                  )
                  let endD = new Date(
                    moment(end)
                      .hour(moment(showDatePicker?.endTime).hour())
                      .minute(moment(showDatePicker?.endTime).minute())
                      .valueOf(),
                  )
                  onSetDate(startD, endD)
                  setShowDatePicker(!showDatePicker)
                }}
              />
            )}
          </div>
          <div>
            <TextField
              id={'start-end-time'}
              label={t('start_end_time_label')}
              value={`${moment(auctionEditData?.startDate).format(
                'HH:mm',
              )} - ${moment(auctionEditData?.endDate).format('HH:mm')}`}
              // onChange={(v) =>
              //   setAuctionEditData({ ...auctionEditData, endDate: v })
              // }
              onClick={() => {
                editMode && setVisibleStartTimePicker(true)
              }}
              disabled={!editMode}
              className="auction-details-form-textField"
              block
            />
            {visibleStartTimePicker && (
              <>
                <DatePicker
                  startView="time"
                  endView="time"
                  singlePick={true}
                  minuteInterval={5}
                  timeFormat={null}
                  onUpdate={({ timestamp }) => {
                    setAuctionEditData({
                      ...auctionEditData,
                      startDate: new Date(
                        moment(auctionEditData?.startDate)
                          .hour(moment(timestamp).hour())
                          .minute(moment(timestamp).minute())
                          .valueOf(),
                      ),
                    })
                    // setVisibleStartTimePicker(false)
                  }}
                  onCancel={() => setVisibleStartTimePicker(false)}
                  translation={{ date: 'Time' }}
                />
                <DatePicker
                  startView="time"
                  endView="time"
                  singlePick={true}
                  minuteInterval={5}
                  timeFormat={null}
                  onUpdate={({ timestamp }) => {
                    setAuctionEditData({
                      ...auctionEditData,
                      endDate: new Date(
                        moment(auctionEditData?.endDate)
                          .hour(moment(timestamp).hour())
                          .minute(moment(timestamp).minute())
                          .valueOf(),
                      ),
                    })
                    setVisibleStartTimePicker(false)
                  }}
                  onCancel={() => setVisibleStartTimePicker(false)}
                  translation={{ date: 'Time' }}
                />
              </>
            )}
            {/* {showDatePicker.endDate && (
              <DatePicker
                singlePick
                translation={{ update: 'select' }}
                onUpdate={(date) => onHandleDate(date, 'endDate')}
                onCancel={() =>
                  setShowDatePicker({ ...showDatePicker, endDate: false })
                }
                minValidDate={{ timestamp: new Date().getTime() }}
                startView="year"
                endView="day"
              />
            )} */}
          </div>
          <TextField
            id={'starting-price'}
            label={t('starting_price_label')}
            value={auctionEditData?.startingPrice}
            onChange={(v) =>
              setAuctionEditData({ ...auctionEditData, startingPrice: v })
            }
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'incremental-price'}
            label={t('incremental_price_label')}
            value={auctionEditData?.incrementalPrice}
            onChange={(v) =>
              setAuctionEditData({ ...auctionEditData, incrementalPrice: v })
            }
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
        </div>
        <Button onClick={() => onDisableEdit()} icon primary>
          more_vert
        </Button>
      </div>
      {showMore && (
        <div className="auction-details-details">
          {editMode ? (
            <>
              <TextField
                id={'description'}
                label={t('description_label')}
                value={auctionEditData?.description}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, description: v })
                }
                className="auction-details-description-textField"
                block
                rows="3"
              />
              <TextField
                id="feature"
                placeholder={t('key_features_placeholder')}
                value={keyFeature}
                onChange={(value) => setKeyFeature(value)}
                className="textField-withShadow"
                // onClick={() => {
                //   setSuggestedKeysPanel(true)
                // }}
                block
                rightIcon={
                  <Button
                    flat
                    primary
                    className="add-btn"
                    onClick={addKeyFeature}
                    disabled={!keyFeature}
                    iconChildren="add"
                  >
                    {t('add')}
                  </Button>
                }
              />
              {/* {suggestedKeyPanel && (
                <div className="feature-field-list">
                  {renderSuggestedKeys()}
                </div>
              )} */}
              <div className="chipWrapper">{renderNewKeys()}</div>
              <UploadImages
                cover
                multiple={true}
                title={
                  <>
                    <span className="drop-zone-placeholder">
                      {t('drag_and_drop')}
                      <b>{t('select_file')}</b>
                    </span>
                  </>
                }
                setListFiles={(files, keyAction, fileId) =>
                  setListImages(files, keyAction, fileId)
                }
                listFiles={images}
                iconDelete={true}
                titleContent={t('property_images')}
                addTitle={
                  <>
                    <FontIcon>add</FontIcon>
                    {t('add_images')}
                  </>
                }
                titleUpload={images?.length > 0 ? 'add_images' : ''}
                icon={<FontIcon>add_photo_alternate</FontIcon>}
                accept="image/jpeg, image/png, image/jpg"
                className="custom"
              />
            </>
          ) : (
            <>
              <div className="auction-details-description">
                <label>{t('description_label')}</label>
                <span>{auctionEditData?.description}</span>
              </div>
              <div className="auction-details-subTitle">{'key features'}</div>
              <div className="chipWrapper">{renderNewKeys()}</div>
              <div className="auction-details-subTitle">
                {t('property_images')}
              </div>
              <div className="auction-details-imagesWrapper">
                {renderImages()}
              </div>
            </>
          )}
        </div>
      )}
      <div className="auction-details-buttonWrapper">
        <Button
          iconChildren={showMore ? 'expand_less' : 'expand_more'}
          iconBefore={showMore}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Less' : 'More'}
        </Button>
      </div>
      <div className="auction-details-bidderWrapper">
        <div className="auction-details-subTitle">{t('bidders_list')}</div>
        <div className="auction-details-table">
          <div className="auction-details-table-header">
            <div>{t('bidder_name')}</div>
            <div>{t('email')}</div>
            <div>{t('phone_number')}</div>
            <div>{t('bid_date')}</div>
            <div>{t('bid_time')}</div>
            <div>{t('bid_amount')}</div>
          </div>
          {renderBidders()}
        </div>
      </div>
    </div>
  )
}
export default MyAuctionDetails
