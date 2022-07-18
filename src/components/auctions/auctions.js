import { useState } from 'react'
import { useMutation } from 'react-query'

import { publishAuction } from 'libs/api/auctions-api'

import CreateAuctionStepper from 'components/create-auction-stepper'

const Auctions = () => {
  const [auctionData, setAuctionData] = useState({})

  const publishAuctionMutation = useMutation(publishAuction, {
    onSuccess: (res) => {
      // console.log(res, 'success')
    },
  })

  const onPublishAuction = () => {
    publishAuctionMutation.mutate({
      body: auctionData,
    })
  }
  return (
    <div className="auctions">
      <CreateAuctionStepper
        auctionData={auctionData}
        setAuctionData={setAuctionData}
        onPublish={() => onPublishAuction()}
      />
    </div>
  )
}
export default Auctions
