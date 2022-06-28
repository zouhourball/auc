import { cls } from 'reactutils'
import AuctionDetailsForm from 'components/auction-details-form'
import DocumentsForm from 'components/documents-form'
import EligibilityCriteriaForm from 'components/eligibility-criteria-form'
import PropertyDetailsForm from 'components/property-details-form'
import { useState } from 'react'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import './style.scss'

const Step = ({ label, index, active, done }) => {
  return (
    <div className={cls(`step`, active && 'active', done && 'done')}>
      <div className="step-index">{index}</div>
      <div className="step-label">{label}</div>
    </div>
  )
}

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
    <div className="create-auction">
      <div className="create-auction-header">
        <div className="stepper">
          <Step
            index={1}
            label="Auction Details"
            active={currentStep === 1}
            done={currentStep > 1}
          />
          <div className="stepper-separateur" />
          <Step
            index={2}
            label="Property Details"
            active={currentStep === 2}
            done={currentStep > 2}
          />
          <div className="stepper-separateur" />
          <Step
            index={3}
            label="Documents"
            active={currentStep === 3}
            done={currentStep > 3}
          />
          <div className="stepper-separateur" />
          <Step
            index={4}
            label="Auction Details"
            active={currentStep === 4}
            done={currentStep > 4}
          />
        </div>
      </div>
      <div className="create-auction-body">{renderCurrentTabContent()}</div>
      <div className="create-auction-footer">
        <Button flat primary className="action-btn" onClick={() => {}}>
          {'Cancel'}
        </Button>
        <Button
          className="action-btn"
          primary
          flat
          swapTheming
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
