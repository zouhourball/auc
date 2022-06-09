import { useState } from 'react'
import { TextField, FontIcon, Checkbox, Button } from 'react-md'

import UploadImages from 'components/upload-images'

const PropertyDetailsForm = ({ propertyDetails, setPropertyDetails }) => {
  const { description, keyFeatures, suggestedKeyFeatures, images } =
    propertyDetails

  const [keyFeature, setKeyFeature] = useState()

  const onSetFormDetails = (property, value) => {
    setPropertyDetails({ ...propertyDetails, [property]: value })
  }

  const addKeyFeature = () => {
    setKeyFeature('')
    onSetFormDetails('keyFeatures', [
      ...keyFeatures,
      { label: keyFeature, status: 'new' },
    ])
  }

  const handleRemoveKey = (key) => {
    onSetFormDetails(
      'keyFeatures',
      keyFeatures.filter((el) => el?.label !== key?.label),
    )
  }

  const renderNewKeys = () => {
    return keyFeatures?.map((updatedKey, index) => (
      <div key={index} className="key">
        <span className="feature-label">{updatedKey?.label}</span>
        <FontIcon
          className="feature-icon"
          onClick={() => handleRemoveKey(updatedKey)}
        >
          close
        </FontIcon>
      </div>
    ))
  }
  const renderSuggestedKeys = () => {
    return suggestedKeyFeatures?.map((key, i) => (
      <Checkbox
        key={i}
        id={key?.label}
        // checked={updatedKeys?.indexOf(key) !== -1}
        onChange={(v) =>
          v
            ? onSetFormDetails('keyFeatures', [
              ...keyFeatures,
              { label: key.label, status: 'new' },
            ])
            : handleRemoveKey(key)
        }
        className="md-cell md-cell--3"
        label={key?.label}
      />
    ))
  }

  const setListImages = (newImages, keyAction, fileId) => {
    if (keyAction === 'delete') {
      onSetFormDetails(
        'images',
        images?.filter((el) => el.url !== fileId),
      )
    } else if (keyAction === 'add') {
      onSetFormDetails('images', [...images, ...newImages])
    } else {
      onSetFormDetails('images', newImages)
    }
  }

  return (
    <div className="auction-details-form">
      <h2>{'Property Details'}</h2>
      <div className="md-grid">
        <span>{'property description *'}</span>
        <TextField
          id="auctionDescription"
          value={description}
          onChange={(description) =>
            onSetFormDetails('description', description)
          }
          className="auction-property-details-content_textField md-cell md-cell--12"
          required
          rows={5}
        />
        <span>{'key_features_auctions_optional'}</span>
        <div className="feature-field">
          <TextField
            id="feature"
            placeholder={'add_key_feature'}
            value={keyFeature}
            onChange={(value) => setKeyFeature(value)}
            className=" auction-property-details-content_textField filled"
          />
          <Button
            flat
            primary
            className="add-btn"
            onClick={addKeyFeature}
            disabled={!keyFeature}
          >
            <FontIcon className="add">add</FontIcon> {'add_optional'}
          </Button>
        </div>
        <div className="auction-property-details-content-features">
          {renderNewKeys()}
        </div>
        <div className="md-grid auction-property-details-content-features-suggested">
          {renderSuggestedKeys()}
        </div>
        <div className="auction-property-details-images">
          <span className="images-title">
            {'property_images_or_virtual_tour_files'}
          </span>
          <UploadImages
            cover
            multiple={true}
            title={
              <>
                <span className="drop-zone-placeholder">
                  {'drag_and_drop_files_here_or'}
                  <b>{'select_file_image'}</b>
                </span>
              </>
            }
            setListFiles={(files, keyAction, fileId) =>
              setListImages(files, keyAction, fileId)
            }
            listFiles={images}
            iconDelete={true}
            titleContent={' '}
            addTitle={
              <div className="">
                <FontIcon className="">add</FontIcon>
                {'add_images'}
              </div>
            }
            titleUpload={images?.length > 0 ? 'add_images' : ''}
            icon={<FontIcon>upload</FontIcon>}
            accept="image/jpeg, image/png, image/jpg"
            className="custom"
          />
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsForm
