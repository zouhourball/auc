import { useState } from 'react'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { navigate } from '@reach/router'
// import { v4 as uuidv4 } from 'uuid'

import { addToast } from 'modules/app/actions'

import { publishAuction } from 'libs/api/auctions-api'

// import meOrganizations from 'libs/queries/me-organizations.gql'

import ToastMsg from 'components/toast-msg'

import CreateAuctionStepper from 'components/create-auction-stepper'
import { get } from 'lodash-es'

const Auctions = () => {
  const dispatch = useDispatch()

  const [auctionDetails, setAuctionDetails] = useState({})
  const [propertyDetails, setPropertyDetails] = useState({})
  const [documents, setDocuments] = useState({})
  const meOrgs = useSelector(({ app }) => app?.myOrgs)

  const publishAuctionMutation = useMutation(publishAuction, {
    onSuccess: (res) => {
      if (!res.error) {
        dispatch(
          addToast(
            <ToastMsg text={'Auction published successfully'} type="success" />,
          ),
        )
        navigate('/auctions')
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something went wrong'} type="error" />),
        )
      }
    },
  })

  const onPublishAuction = () => {
    publishAuctionMutation.mutate({
      body: {
        configurator_organization_id: +get(meOrgs, '0.ID', 0),
        title: auctionDetails?.title,
        address: auctionDetails?.address?.meta,
        country_id: +auctionDetails?.country,
        city_id: +auctionDetails?.city,
        property_type: +auctionDetails?.propertyType,
        auction_start_date: moment(auctionDetails?.startDate).format(),
        auction_end_date: moment(auctionDetails?.endDate).format(),
        starting_price: +auctionDetails?.startingPrice,
        incremental_price: +auctionDetails?.incrementalPrice,
        participation_fee: +auctionDetails?.participationFee,
        guarentee_fee: +auctionDetails?.guaranteeFee,
        property_description: propertyDetails?.description,
        count_bedrooms: +propertyDetails?.bedrooms,
        count_bathrooms: +propertyDetails?.bathrooms,
        total_area: +propertyDetails?.area,
        general_location_x: +auctionDetails?.address?.['general_location_x'],
        general_location_y: +auctionDetails?.address?.['general_location_y'],
        features: propertyDetails?.keyFeatures?.map((el) => {
          return {
            // uuid: uuidv4(),
            name: el.label,
            description: el.status,
          }
        }),
        images: propertyDetails?.images?.map((el) => {
          return {
            url: el?.url,
            name: el?.options?.metadata?.filename,
            size: el?.size,
            type: el?.type,
            cover_image: el?.cover,
          }
        }),
        documents: documents?.images?.map((el) => {
          return {
            url: el?.url,
            file_name: `${el?.options?.metadata?.filename}-${el.id}`,
            size: el?.size,
            type: el?.type,
            // idProperty: el.id,
          }
        }),
      },
    })
  }
  return (
    <div className="auctions">
      <CreateAuctionStepper
        auctionDetails={auctionDetails}
        setAuctionDetails={setAuctionDetails}
        onPublish={onPublishAuction}
        propertyDetails={propertyDetails}
        setPropertyDetails={setPropertyDetails}
        documents={documents}
        setDocuments={setDocuments}
      />
    </div>
  )
}
export default Auctions
