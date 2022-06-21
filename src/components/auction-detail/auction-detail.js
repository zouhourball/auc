import { Avatar, Button, FontIcon } from 'react-md'

import AuctionTimer from 'components/auction-timer'
import TermsCondition from 'components/terms-conditions'
import DocumentsContainer from 'components/docs-dialog'

import { dummyData } from 'components/auctions-public/helper'
import { useState } from 'react'
import { dummyDocs } from 'components/admin-page/helper'

const AuctionDetail = ({ auctionId }) => {
  const data = dummyData[0]
  const [docAction, setDocAction] = useState(false)
  const [currentImg, setCurrentImg] = useState(data?.url)
  return (
    <div>
      <div className="gallery">
        <h1>Auction Detail</h1>
        <span>View Map</span>
        {docAction && (
          <>
            <Button onClick={() => setDocAction(false)}>Approve</Button>
            <Button onClick={() => setDocAction(false)}>Reject</Button>
          </>
        )}
        <img src={currentImg} />
        <div className="gallery">
          <img onClick={() => setCurrentImg(data?.url)} src={data?.url} />
          <img onClick={() => setCurrentImg(data?.url)} src={data?.url} />
          <img onClick={() => setCurrentImg(data?.url)} src={data?.url} />
          <img onClick={() => setCurrentImg(data?.url)} src={data?.url} />
        </div>
      </div>
      <div className="detail">
        <div>
          <span>Posted 3 days ago</span>
          <h1>{data?.name}</h1>
          <div>3 Bedrooms 2 bathrooms 900 sqm</div>
        </div>
        <div>
          {' '}
          <AuctionTimer
            time={{ days: 0, hours: 0, minutes: 0, secondes: 0 }}
            label={'Current Price'}
            bid={0}
            minIncrement={0}
          />
        </div>
        <div>
          <span>14 Number of Bids</span>
          <span>0 Lot Number</span>
        </div>
        <div className="owner-card">
          <Avatar /> Owned By Ali Salim{' '}
          <Button icon iconClassName="mdi mdi-email" />
          <Button icon iconClassName="mdi mdi-phone" />
        </div>
        <Button>Bid Now</Button>
        <Button onClick={() => setDocAction(true)}>Documents</Button>
      </div>
      <TermsCondition
        description={'description'}
        termOfSale={'terms of sale'}
        disclosure={'Disclosure'}
      />
      <div className="key-features">
        <FontIcon className="mdi mdi-check-circle-outline" /> wifi
        <FontIcon className="mdi mdi-check-circle-outline" /> pool
        <FontIcon className="mdi mdi-check-circle-outline" /> heat
      </div>
      <div className="fees-commission">
        Buyer s Premium 11% Co-Broke Commission 3%
      </div>
      {docAction && (
        <DocumentsContainer
          visible={docAction}
          onHide={() => setDocAction(false)}
          data={dummyDocs}
        />
      )}
    </div>
  )
}
export default AuctionDetail
