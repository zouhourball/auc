import { useState } from 'react'
import { TextField, Button, Checkbox, FontIcon } from 'react-md'

import './style.scss'

const MyAuctionDetails = ({ auctionId }) => {
  const [keyFeature, setKeyFeature] = useState()
  const [suggestedKeyPanel, setSuggestedKeysPanel] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState({})

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
  const renderImages = () => {}
  const renderBidders = () =>
    propertyDetails?.bidders?.map((el) => (
      <tr key={el?.id}>
        <td>{el?.bidderName}</td>
        <td>{el?.email}</td>
        <td>{el?.phoneNumber}</td>
        <td>{el?.bidDate}</td>
        <td>{el?.bidName}</td>
        <td>{el?.bidAmount}</td>
      </tr>
    ))
  const dummyData = { title: 'test', propertyType: '1', address: 'kk' }
  return (
    <div>
      {' '}
      <div className="auction-list">
        <div className="auction-list-header">
          <div className="title">My Auctions - Details</div>
        </div>
        <div className="first-section">
          <TextField id={'title'} label={'Title'} value={dummyData?.title} />
          <TextField
            id={'property-type'}
            label={'Property Type'}
            value={dummyData?.propertyType}
          />
          <TextField
            id={'address'}
            label={'Address'}
            value={dummyData?.address}
          />
          <TextField id={'city'} label={'City'} value={dummyData?.city} />
          <TextField
            id={'country'}
            label={'Country'}
            value={dummyData?.country}
          />
          <TextField
            id={'start-end-date'}
            label={'Start-End Date'}
            value={dummyData?.date}
          />
          <TextField
            id={'start-end-time'}
            label={'Start-End Time'}
            value={dummyData?.time}
          />
          <TextField
            id={'starting-price'}
            label={'Starting Price'}
            value={dummyData?.startingPrice}
          />
          <TextField
            id={'incremental-price'}
            label={'Incremental Price'}
            value={dummyData?.incrementalPrice}
          />
          <TextField
            id={'description'}
            label={'Description'}
            value={dummyData?.description}
          />
          <div className="md-cell md-cell--12">
            <label className="auction-details-form-label">
              {'key features'}
            </label>
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

            <div className="chipWrapper">{renderNewKeys()}</div>
          </div>
          <div>
            <label>Property Images</label>
            {renderImages()}
          </div>
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
