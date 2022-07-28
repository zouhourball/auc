import { useState, useEffect } from 'react'
import { useQuery as useQueryApollo, useSubscription } from 'react-apollo'
import { TextField, Button, Checkbox, FontIcon } from 'react-md'
import UploadImages from 'components/upload-images'
import { useTranslation } from 'libs/langs'
import store from 'libs/store'
import getBids from 'libs/queries/auction/get-bids.gql'
import subscribeNewBid from 'libs/queries/auction/subscription-new-bid.gql'

import { dummyBiddersData, dummyData, updateAuctionFormatData } from './helpers'

import './style.scss'
import { useQuery, useMutation } from 'react-query'
import { getAuction, updateAuction } from 'libs/api/auctions-api'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'
import { useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'
import ToastMsg from 'components/toast-msg'
import UserInfoBySubject from 'components/user-info-by-subject'

const MyAuctionDetails = ({ auctionId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [keyFeature, setKeyFeature] = useState()
  const [suggestedKeyPanel, setSuggestedKeysPanel] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState({})
  const [showMore, setShowMore] = useState(false)
  const [editMode, setEditMode] = useState(false)
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
  const [showDatePicker, setShowDatePicker] = useState({
    startDate: false,
    endDate: false,
  })

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
    })
  }, [auctionDetails])

  const { data: biddersList, refetch: refetchBids } = useQueryApollo(getBids, {
    context: { uri: `${PRODUCT_APP_URL_API}/auction/graphql/query` },
    variables: { auctionUUID: '3159502d-7f66-4722-9a19-74319b216468' },
  })
  const { data: subNewBid } = useSubscription(subscribeNewBid, {
    variables: { auctionID: '3159502d-7f66-4722-9a19-74319b216468' },
    // uri: `${appUrl}/auction/graphql/query`,
  })
  useEffect(() => {
    refetchBids()
  }, [subNewBid])
  useEffect(() => {
    setPropertyDetails({
      ...dummyBiddersData,
    })
  }, [dummyBiddersData])

  const onSetFormDetails = (property, value) => {
    setPropertyDetails({ ...propertyDetails, [property]: value })
  }
  const handleRemoveKey = (key) => {
    onSetFormDetails(
      'keyFeatures',
      propertyDetails?.keyFeatures.filter((el) => el?.label !== key?.label),
    )
  }
  const downloadToken = store?.getState()?.app?.dlToken

  const renderSuggestedKeys = () => {
    return propertyDetails?.suggestedKeyFeatures?.map((key, i) => (
      <Checkbox
        key={i}
        id={key?.label}
        checked={
          !!propertyDetails?.keyFeatures?.find((el) => el.label === key.label)
        }
        onChange={(v) =>
          v
            ? onSetFormDetails('keyFeatures', [
              ...propertyDetails?.keyFeatures,
              { label: key.label, status: 'new' },
            ])
            : handleRemoveKey(key)
        }
        className="md-cell md-cell--3"
        label={key?.label}
      />
    ))
  }
  const addKeyFeature = () => {
    setKeyFeature('')
    onSetFormDetails('keyFeatures', [
      ...propertyDetails?.keyFeatures,
      { label: keyFeature, status: 'new' },
    ])
  }
  const renderNewKeys = () => {
    return propertyDetails?.keyFeatures?.map((updatedKey, index) => (
      <div key={index} className="chipWrapper-item">
        <span className="label">{updatedKey?.label}</span>
        <FontIcon primary onClick={() => handleRemoveKey(updatedKey)}>
          {t('close')}
        </FontIcon>
      </div>
    ))
  }
  const renderImages = () =>
    propertyDetails?.images?.map((el, i) => (
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
      onSetFormDetails(
        'images',
        propertyDetails?.images?.filter((el) => el.url !== fileId),
      )
    } else if (keyAction === 'add') {
      onSetFormDetails('images', [...propertyDetails?.images, ...newImages])
    } else {
      onSetFormDetails('images', newImages)
    }
  }
  // update auction details
  const updateAuctionData = useMutation(updateAuction, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchAuction()
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
  const onDisableEdit = () => {
    if (editMode) {
      updateAuctionData.mutate({
        uuid: auctionId,
        body: {
          ...updateAuctionFormatData(auctionDetails),
          title: auctionEditData?.title,
          auction_start_date: new Date(auctionEditData?.startDate),
          auction_end_date: new Date(auctionEditData?.endDate),
          incremental_price: +auctionEditData?.incrementalPrice,
          starting_price: +auctionEditData?.startingPrice,
          property_type: +auctionEditData?.propertyType,
          property_description: auctionEditData?.description,
        },
      })
    }
    setEditMode(!editMode)
    setShowDatePicker({ startDate: false, endDate: false })
  }
  /// ///////////
  const onHandleDate = (date, key) => {
    setAuctionEditData({
      ...auctionEditData,
      [key]: moment(date.timestamp).format('DD MMM YYYY'),
    })
    setShowDatePicker({ ...showDatePicker, [key]: false })
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
              value={moment(auctionEditData?.startDate).format('DD MMM YYYY')}
              onChange={(v) =>
                setAuctionEditData({ ...auctionEditData, startDate: v })
              }
              onClick={() => {
                editMode &&
                  setShowDatePicker({ ...showDatePicker, startDate: true })
              }}
              disabled={!editMode}
              className="auction-details-form-textField"
              block
            />
            {showDatePicker.startDate && (
              <DatePicker
                singlePick
                translation={{ update: 'select' }}
                onUpdate={(date) => onHandleDate(date, 'startDate')}
                onCancel={() =>
                  setShowDatePicker({ ...showDatePicker, startDate: false })
                }
                minValidDate={{ timestamp: new Date().getTime() }}
                startView="year"
                endView="day"
              />
            )}
          </div>
          <div>
            <TextField
              id={'start-end-time'}
              label={t('start_end_time_label')}
              value={moment(auctionEditData?.endDate).format('DD MMM YYYY')}
              onChange={(v) =>
                setAuctionEditData({ ...auctionEditData, endDate: v })
              }
              onClick={() => {
                editMode &&
                  setShowDatePicker({ ...showDatePicker, endDate: true })
              }}
              disabled={!editMode}
              className="auction-details-form-textField"
              block
            />
            {showDatePicker.endDate && (
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
            )}
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
                onClick={() => {
                  setSuggestedKeysPanel(true)
                }}
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
              {suggestedKeyPanel && (
                <div className="feature-field-list">
                  {renderSuggestedKeys()}
                </div>
              )}
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
                listFiles={propertyDetails?.images}
                iconDelete={true}
                titleContent={t('property_images')}
                addTitle={
                  <>
                    <FontIcon>add</FontIcon>
                    {t('add_images')}
                  </>
                }
                titleUpload={
                  propertyDetails?.images?.length > 0 ? 'add_images' : ''
                }
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
