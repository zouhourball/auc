import { Avatar, Button, FontIcon } from 'react-md'

import AuctionTimer from 'components/auction-timer'
import TermsCondition from 'components/terms-conditions'
import DocumentsContainer from 'components/docs-dialog'

import { dummyData } from 'components/auctions-public/helper'
import { useState } from 'react'
import { dummyDocs } from 'components/admin-page/helper'

import icon1 from './icons/bedroom.svg'
import icon2 from './icons/bath.svg'
import icon3 from './icons/area.svg'

import './style.scss'

const AuctionDetail = ({
  auctionId,
  isAdmin = true,
  status,
  isActive = true,
}) => {
  const data = dummyData[0]
  const [docAction, setDocAction] = useState(false)
  const [currentImg, setCurrentImg] = useState(data?.url)
  return (
    <div className="auction-details md-grid">
      <div className="auction-details-gallery md-cell md-cell--6 md-grid">
        <div className="auction-details-header md-cell md-cell--12">
          <div className="title">Auction Detail</div>
          <Button
            flat
            primary
            className=""
            iconClassName="mdi mdi-map-marker-outline"
          >
            View Map
          </Button>
        </div>

        <img className="gallery-image md-cell md-cell--12" src={currentImg} />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
      </div>
      <div className="auction-details-info md-cell md-cell--6 md-grid">
        <div className="auction-details-info-header md-cell md-cell--12">
          {isAdmin &&
            (status ? (
              <div>{status}</div>
            ) : (
              <>
                <Button flat onClick={() => setDocAction(false)}>
                  Approve
                </Button>
                <Button flat onClick={() => setDocAction(false)}>
                  Reject
                </Button>
              </>
            ))}
        </div>
        <div className="auction-details-card md-cell md-cell--12">
          <div className="note">Posted 3 days ago</div>
          <div className="title">{data?.name}</div>
          <div className="auction-details-card-details">
            <div className="auction-details-card-details-item">
              <img src={icon1} />3 Bedrooms
            </div>
            <div className="auction-details-card-details-item">
              <img src={icon2} />2 bathrooms
            </div>
            <div className="auction-details-card-details-item">
              <img src={icon3} />
              900 sqm
            </div>
          </div>
        </div>
        {isActive && (
          <>
            <div className="md-cell md-cell--12">
              <AuctionTimer
                time={{ days: 0, hours: 0, minutes: 0, secondes: 0 }}
                label={'Current Price'}
                bid={0}
                minIncrement={0}
              />
            </div>
            <div className="auction-details-card md-cell md-cell--6">
              <div>
                <strong>14</strong>
              </div>
              <div>Number of Bids</div>
            </div>
            <div className="auction-details-card md-cell md-cell--6">
              <div>
                <strong>0</strong>
              </div>
              <div>Lot Number</div>
            </div>
          </>
        )}
        <div className="owner-card md-cell md-cell--12">
          <Avatar /> Owned By Ali Salim{' '}
          <Button icon iconClassName="mdi mdi-email" />
          <Button icon iconClassName="mdi mdi-phone" />
        </div>
        <div>
          {isAdmin ? (
            <Button primary flat swapTheming onClick={() => setDocAction(true)}>
              Documents
            </Button>
          ) : (
            <Button flat primary swapTheming>
              Bid Now
            </Button>
          )}
        </div>
      </div>
      <TermsCondition
        description={'description'}
        termOfSale={'terms of sale'}
        disclosure={'Disclosure'}
        className="md-cell md-cell--12"
      />
      <div className="key-features  md-cell md-cell--12">
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
