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
  const [editMode, setEditMode] = useState(true)

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
    propertyDetails?.images?.map((el, i) => <img key={i} src={el.url} />)
  const renderBidders = () =>
    propertyDetails?.bidders?.map((el) => (
      <tr key={el?.id}>
        <td>{el?.bidderName}</td>
        <td>{el?.email}</td>
        <td>{el?.phoneNumber}</td>
        <td>{el?.bidDate}</td>
        <td>{el?.bidTime}</td>
        <td>{el?.bidAmount}</td>
      </tr>
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
    <div>
      {' '}
      <div className="auction-list">
        <div className="auction-list-header">
          <div className="title">My Auctions - Details</div>
        </div>
        <div className="first-section">
          <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
          <TextField
            id={'title'}
            label={'Title'}
            value={dummyData?.title}
            disabled={editMode}
          />
          <TextField
            id={'property-type'}
            label={'Property Type'}
            value={dummyData?.propertyType}
            disabled={editMode}
          />
          <TextField
            id={'address'}
            label={'Address'}
            value={dummyData?.address}
            disabled={editMode}
          />
          <TextField
            id={'city'}
            label={'City'}
            value={dummyData?.city}
            disabled={editMode}
          />
          <TextField
            id={'country'}
            label={'Country'}
            value={dummyData?.country}
            disabled={editMode}
          />
          <TextField
            id={'start-end-date'}
            label={'Start-End Date'}
            value={dummyData?.date}
            disabled={editMode}
          />
          <TextField
            id={'start-end-time'}
            label={'Start-End Time'}
            value={dummyData?.time}
            disabled={editMode}
          />
          <TextField
            id={'starting-price'}
            label={'Starting Price'}
            value={dummyData?.startingPrice}
            disabled={editMode}
          />
          <TextField
            id={'incremental-price'}
            label={'Incremental Price'}
            value={dummyData?.incrementalPrice}
            disabled={editMode}
          />
          <div className={showMore ? 'show-more' : 'show-less'}>
            <TextField
              id={'description'}
              label={'Description'}
              value={dummyData?.description}
              disabled={editMode}
            />
            <div className="md-cell md-cell--12">
              <label className="auction-details-form-label">
                {'key features'}
              </label>
              {!editMode && (
                <div className="feature-field">
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
                </div>
              )}

              <div className="chipWrapper">{renderNewKeys()}</div>
            </div>
            <div>
              <label>Property Images</label>
              {editMode && renderImages()}
              {!editMode && (
                <div className="md-cell md-cell--12">
                  <label className="auction-details-form-label">
                    {'Property Images'}
                  </label>
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
                    titleContent={' '}
                    addTitle={
                      <div className="">
                        <FontIcon className="">add</FontIcon>
                        {'add_images'}
                      </div>
                    }
                    titleUpload={
                      propertyDetails?.images?.length > 0 ? 'add_images' : ''
                    }
                    icon={<FontIcon>add_photo_alternate</FontIcon>}
                    accept="image/jpeg, image/png, image/jpg"
                    className="custom"
                  />
                </div>
              )}
            </div>
          </div>
          <Button onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
          <div>
            <label>List of bidders</label>
            <table>
              {' '}
              <tr>
                <th>Bidder Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Bid Date</th>
                <th>Bid Time</th>
                <th>Bid Amount</th>
              </tr>
              {renderBidders()}
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MyAuctionDetails
