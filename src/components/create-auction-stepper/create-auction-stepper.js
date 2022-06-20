import AuctionDetailsForm from 'components/auction-details-form'
import DocumentsForm from 'components/documents-form'
import EligibilityCriteriaForm from 'components/eligibility-criteria-form'
import PropertyDetailsForm from 'components/property-details-form'
import { useState } from 'react'
import { Button, FontIcon } from 'react-md'
import { navigate } from '@reach/router'
import './style.scss'
const CreateAuctionStepper = ({ auctionUuid }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [auctionDetails, setAuctionDetails] = useState({
    title: '',
    address: '',
    city: '',
    country: '',
    startDate: '',
    endDate: '',
    startingPrice: '',
    incrementalPrice: '',
  })
  const [propertyDetails, setPropertyDetails] = useState({
    description: '',
    keyFeatures: [],
    suggestedKeyFeatures: [
      { label: 'Stone Wall' },
      { label: 'Pesticides Spray' },
      { label: 'Nearby Rest Area' },
      { label: 'Tube Well' },
    ],
    images: [],
  })
  const [documents, setDocuments] = useState({})
  const [eligibilityCriteria, setEligibilityCriteria] = useState({
    type: 'Organization',
    /* criteria: {
      orgCriteria: 'Above',
      individualCriteria: 'Above',
    },
    age: 0,
    gcc_percentage: 0, */
  })

  const renderCurrentTabContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AuctionDetailsForm
            auctionDetails={auctionDetails}
            setAuctionDetails={setAuctionDetails}
          />
        )
      case 2:
        return (
          <PropertyDetailsForm
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
          />
        )
      case 3:
        return (
          <DocumentsForm documents={documents} setDocuments={setDocuments} />
        )
      case 4:
        return (
          <EligibilityCriteriaForm
            eligibilityCriteria={eligibilityCriteria}
            setEligibilityCriteria={setEligibilityCriteria}
          />
        )
      default:
        break
    }
  }

  const onUpdateAuction = () => {}
  const onSaveAuction = () => {
    navigate('/auctions/home')
  }

  return (
    <div className="create-auction-stepper">
      <div className="create-auction-stepper-header">
        <div className="auction-form-stepper-content-head">
          <span className={currentStep !== 1 ? 'step green' : 'step'}>
            {currentStep === 1 ? 1 : <FontIcon>done</FontIcon>}
          </span>
          <span>{'auction_details'}</span>
          <div
            className={
              currentStep === 1 ? 'horizontal-sep' : 'horizontal-sep active'
            }
          />
          <span className={currentStep > 2 ? 'step green' : 'step'}>
            {currentStep < 3 ? 2 : <FontIcon>done</FontIcon>}
          </span>

          <span>{'property_details'}</span>
          <div
            className={
              currentStep < 3 ? 'horizontal-sep' : 'horizontal-sep active'
            }
          />
          {
            <span className={currentStep < 4 ? 'step ' : 'step green'}>
              {currentStep < 4 ? 3 : <FontIcon>done</FontIcon>}
            </span>
          }
          <span>{'documents'}</span>

          <div
            className={
              currentStep < 4 ? 'horizontal-sep' : 'horizontal-sep active'
            }
          />
          {
            <span className={currentStep !== 5 ? 'step ' : 'step green'}>
              {currentStep < 5 ? 4 : <FontIcon>done</FontIcon>}
            </span>
          }
          <span>{'eligibility_criteria'}</span>
        </div>
      </div>
      <div className="create-auction-body">{renderCurrentTabContent()}</div>
      <div className="create-auction-stepper-footer">
        <Button primary className="back-btn" onClick={() => {}}>
          {'Cancel'}
        </Button>
        <Button
          className="save-btn"
          primary
          onClick={() =>
            currentStep > 3
              ? auctionUuid
                ? onUpdateAuction()
                : onSaveAuction()
              : setCurrentStep(currentStep + 1)
          }
        >
          {currentStep < 4 ? 'Continue' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}

export default CreateAuctionStepper
