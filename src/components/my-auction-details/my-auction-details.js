import { useState, useEffect } from 'react'
import { TextField, Button, Checkbox, FontIcon } from 'react-md'
import UploadImages from 'components/upload-images'
import { useTranslation } from 'libs/langs'
import store from 'libs/store'

import { dummyBiddersData, dummyData } from './helpers'

import './style.scss'

const MyAuctionDetails = ({ auctionId }) => {
  const { t } = useTranslation()

  const [keyFeature, setKeyFeature] = useState()
  const [suggestedKeyPanel, setSuggestedKeysPanel] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState({})
  const [showMore, setShowMore] = useState(false)
  const [editMode, setEditMode] = useState(false)

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
    propertyDetails?.bidders?.map((el) => (
      <div key={el?.id} className="auction-details-table-row">
        <div>{el?.bidderName}</div>
        <div>{el?.email}</div>
        <div>{el?.phoneNumber}</div>
        <div>{el?.bidDate}</div>
        <div>{el?.bidTime}</div>
        <div>{el?.bidAmount}</div>
      </div>
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
            value={dummyData?.title}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'property-type'}
            label={t('property_type_label')}
            value={dummyData?.propertyType}
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
            value={dummyData?.city}
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
          <TextField
            id={'start-end-date'}
            label={t('start_end_dates_label')}
            value={dummyData?.date}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'start-end-time'}
            label={t('start_end_time_label')}
            value={dummyData?.time}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'starting-price'}
            label={t('starting_price_label')}
            value={dummyData?.startingPrice}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'incremental-price'}
            label={t('incremental_price_label')}
            value={dummyData?.incrementalPrice}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
        </div>
        <Button onClick={() => setEditMode(!editMode)} icon primary>
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
                value={dummyData?.description}
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
                <span>{dummyData?.description}</span>
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
