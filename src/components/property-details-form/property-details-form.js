import { useEffect, useState } from 'react'
import { TextField, FontIcon, Checkbox, Button } from 'react-md'

import UploadImages from 'components/upload-images'

const PropertyDetailsForm = ({ propertyDetails, setPropertyDetails }) => {
  const {
    description,
    keyFeatures,
    suggestedKeyFeatures,
    images,
    bedrooms,
    bathrooms,
    area,
  } = propertyDetails

  const [keyFeature, setKeyFeature] = useState()
  const [suggestedKeyPanel, setSuggestedKeysPanel] = useState(false)

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
      <div key={index} className="chipWrapper-item">
        <span className="label">{updatedKey?.label}</span>
        <FontIcon primary onClick={() => handleRemoveKey(updatedKey)}>
          close
        </FontIcon>
      </div>
    ))
  }
  useEffect(() => {
    setSuggestedKeysPanel(false)
  }, [propertyDetails])
  const renderSuggestedKeys = () => {
    return suggestedKeyFeatures?.map((key, i) => (
      <Checkbox
        key={i}
        id={key?.label}
        checked={
          !!propertyDetails?.keyFeatures?.find((el) => el.label === key.label)
        }
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
    <div className="auction-details-form md-grid">
      <div className="auction-details-form-title md-cell md-cell--12">
        {'Property Details'}
      </div>
      <div className="md-cell md-cell--12">
        <label className="auction-details-form-label">
          {'property description *'}
        </label>
        <TextField
          id="auctionDescription"
          value={description}
          onChange={(description) =>
            onSetFormDetails('description', description)
          }
          className="textField-withShadow"
          required
          rows={5}
          placeholder={'Enter property description…'}
          block
        />
      </div>
      <div className="md-cell md-cell--4">
        <label className="auction-details-form-label">Bedrooms *</label>
        <TextField
          id="bedrooms"
          placeholder={'Enter number of bedrooms'}
          value={bedrooms}
          onChange={(value) => onSetFormDetails('bedrooms', value)}
          className="textField-withShadow"
          block
        />
      </div>
      <div className="md-cell md-cell--4">
        <label className="auction-details-form-label">Bathrooms *</label>
        <TextField
          id="bathrooms"
          placeholder={'Enter number of bathrooms'}
          value={bathrooms}
          onChange={(value) => onSetFormDetails('bathrooms', value)}
          className="textField-withShadow"
          block
        />
      </div>
      <div className="md-cell md-cell--4">
        <label className="auction-details-form-label">Area (sq.m) *</label>
        <TextField
          id="area"
          placeholder={'Enter area'}
          value={area}
          onChange={(value) => onSetFormDetails('area', value)}
          className="textField-withShadow"
          block
        />
      </div>
      <div className="md-cell md-cell--12">
        <label className="auction-details-form-label">{'key features'}</label>
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
            <div className="feature-field-list">{renderSuggestedKeys()}</div>
          )}
        </div>

        <div className="chipWrapper">{renderNewKeys()}</div>
      </div>
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
          icon={<FontIcon>add_photo_alternate</FontIcon>}
          accept="image/jpeg, image/png, image/jpg"
          className="custom"
        />
      </div>
    </div>
  )
}

export default PropertyDetailsForm
