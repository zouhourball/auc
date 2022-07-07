import { useState, useEffect } from 'react'
import { TextField, Button, Checkbox, FontIcon } from 'react-md'
import UploadImages from 'components/upload-images'

import { dummyBiddersData, dummyData } from './helpers'

import './style.scss'

const MyAuctionDetails = ({ auctionId }) => {
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
          close
        </FontIcon>
      </div>
    ))
  }
  const renderImages = () =>
    propertyDetails?.images?.map((el, i) => (
      <img key={i} src={el.url} className="auction-details-img" />
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
        <div className="title">My Auctions - Details</div>
      </div>
      <div className="auction-details-info">
        <div className="auction-details-form">
          <TextField
            id={'title'}
            label={'Title:'}
            value={dummyData?.title}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'property-type'}
            label={'Property Type:'}
            value={dummyData?.propertyType}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'address'}
            label={'Address:'}
            value={dummyData?.address}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'city'}
            label={'City:'}
            value={dummyData?.city}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'coundivy'}
            label={'Coundivy:'}
            value={dummyData?.coundivy}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'start-end-date'}
            label={'Start-End Date:'}
            value={dummyData?.date}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'start-end-time'}
            label={'Start-End Time:'}
            value={dummyData?.time}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'starting-price'}
            label={'Starting Price:'}
            value={dummyData?.startingPrice}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          />
          <TextField
            id={'incremental-price'}
            label={'Incremental Price:'}
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
                label={'Description:'}
                value={dummyData?.description}
                className="auction-details-description-textField"
                block
                rows="3"
              />
              <TextField
                id="feature"
                placeholder={'Enter key feature'}
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
                    {'Add'}
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
                      {'Drag & Drop Files here or'}
                      <b>{' Select File / Image'}</b>
                    </span>
                  </>
                }
                setListFiles={(files, keyAction, fileId) =>
                  setListImages(files, keyAction, fileId)
                }
                listFiles={propertyDetails?.images}
                iconDelete={true}
                titleContent={'Property Images'}
                addTitle={
                  <>
                    <FontIcon>add</FontIcon>
                    {'add images'}
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
                <label>Description:</label>
                <span>{dummyData?.description}</span>
              </div>
              <div className="auction-details-subTitle">{'key features'}</div>
              <div className="chipWrapper">{renderNewKeys()}</div>
              <div className="auction-details-subTitle">
                {'Property Images'}
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
        <div className="auction-details-subTitle">List of bidders</div>
        <div className="auction-details-table">
          <div className="auction-details-table-header">
            <div>Bidder Name</div>
            <div>Email</div>
            <div>Phone Number</div>
            <div>Bid Date</div>
            <div>Bid Time</div>
            <div>Bid Amount</div>
          </div>
          {renderBidders()}
        </div>
      </div>
    </div>
  )
}
export default MyAuctionDetails
