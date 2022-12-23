import { cls } from 'reactutils'
import { useTranslation } from 'libs/langs'
import { useState } from 'react'
import { Button } from 'react-md'
import { navigate } from '@reach/router'

import AuctionDetailsForm from 'components/auction-details-form'
import DocumentsForm from 'components/documents-form'
// import EligibilityCriteriaForm from 'components/eligibility-criteria-form'
import PropertyDetailsForm from 'components/property-details-form'
import AppointmentsForm from 'components/appointments-form'
// import { v4 as uuidv4 } from 'uuid'

import './style.scss'

const Step = ({ label, index, active, done }) => {
  return (
    <div className={cls(`step`, active && 'active', done && 'done')}>
      <div className="step-index">{index}</div>
      <div className="step-label">{label}</div>
    </div>
  )
}

const CreateAuctionStepper = ({
  auctionUuid,
  auctionDetails,
  setAuctionDetails,
  propertyDetails,
  setPropertyDetails,
  onPublish,
  documents,
  setDocuments,
  appointmentDetails,
  setAppointmentDetails,
  auctionEndDate,
}) => {
  const { t } = useTranslation()

  const [currentStep, setCurrentStep] = useState(1)
  // const [auctionDetails, setAuctionDetails] = useState({
  //   uuid: uuidv4(),
  //   title: '',
  //   general_location_x: 0,
  //   general_location_y: 0,
  //   city_id: 0,
  //   country_id: 0,
  //   auction_start_date: '',
  //   auction_end_date: '',
  //   starting_price: 0,
  //   property_type: 0,
  //   incremental_price: 0,
  //   participation_fee: 0,
  //   property_description: '',
  //   images: [],
  //   features: [],
  // })
  // const [propertyDetails, setPropertyDetails] = useState({
  //   description: '',
  //   keyFeatures: [],
  //   suggestedKeyFeatures: [
  //     { label: 'Stone Wall' },
  //     { label: 'Pesticides Spray' },
  //     { label: 'Nearby Rest Area' },
  //     { label: 'Tube Well' },
  //   ],
  //   images: [],
  // })
  // const [documents, setDocuments] = useState({})
  // const [eligibilityCriteria, setEligibilityCriteria] = useState({
  //   type: 'Organization',
  //   /* criteria: {
  //     orgCriteria: 'Above',
  //     individualCriteria: 'Above',
  //   },
  //   age: 0,
  //   gcc_percentage: 0, */
  // })
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
            auctionDetails={auctionDetails}
          />
        )
      case 3:
        return (
          <DocumentsForm
            documentsDetails={documents}
            setDocumentDetails={setDocuments}
          />
        )
      case 4:
        return (
          <AppointmentsForm
            appointmentDetails={appointmentDetails}
            setAppointmentDetails={setAppointmentDetails}
            auctionEndDate={auctionEndDate}
          />
        )
      default:
        break
    }
  }
  const {
    address,
    city,
    country,
    endDate,
    // guaranteeFee,
    incrementalPrice,
    participationFee,
    propertyType,
    startDate,
    startingPrice,
    title,
  } = auctionDetails
  const {
    area,
    // bathrooms,
    // bedrooms,
    description,
    images,
    // , keyFeatures
  } = propertyDetails

  const validData = () => {
    switch (currentStep) {
      case 1:
        return !(
          title &&
          address &&
          city &&
          country &&
          // guaranteeFee &&
          incrementalPrice &&
          participationFee &&
          propertyType &&
          startingPrice &&
          startDate &&
          endDate
        )
      case 2:
        return !(
          (
            area &&
            // bathrooms &&
            // bedrooms &&
            description &&
            images?.length > 0
          )
          // && keyFeatures?.length > 0
        )
      case 3:
        return !(documents?.images?.length === 4)
    }
  }
  const onUpdateAuction = () => {}
  // const onSaveAuction = () => {
  //   navigate('/auctions/home')
  // }

  return (
    <div className="create-auction">
      <div className="create-auction-header">
        <div className="stepper">
          <Step
            index={1}
            label={t('auction_detail')}
            active={currentStep === 1}
            done={currentStep > 1}
          />
          <div className="stepper-separateur" />
          <Step
            index={2}
            label={t('property_details')}
            active={currentStep === 2}
            done={currentStep > 2}
          />
          <div className="stepper-separateur" />
          <Step
            index={3}
            label={t('documents')}
            active={currentStep === 3}
            done={currentStep > 3}
          />
          <div className="stepper-separateur" />
          <Step
            index={4}
            label={t('appointments')}
            active={currentStep === 4}
            done={currentStep > 4}
          />
        </div>
      </div>
      <div className="">{renderCurrentTabContent()}</div>
      <div className="create-auction-footer">
        {currentStep !== 1 && (
          <Button
            flat
            primary
            className="action-btn back"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            {t('back')}
          </Button>
        )}
        <Button
          flat
          className="action-btn cancel"
          onClick={() => navigate('/auctions/home')}
        >
          {t('cancel')}
        </Button>
        <Button
          className="action-btn submit"
          primary={!validData()}
          flat
          swapTheming={!validData()}
          disabled={validData()}
          onClick={() =>
            currentStep > 3
              ? auctionUuid
                ? onUpdateAuction()
                : onPublish()
              : setCurrentStep(currentStep + 1)
          }
        >
          {currentStep < 4 ? t('continue') : t('submit')}
        </Button>
      </div>
    </div>
  )
}

export default CreateAuctionStepper
