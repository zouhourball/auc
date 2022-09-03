import { useState } from 'react'
import { MeeraMap } from '@target-energysolutions/gis-map'
import '@target-energysolutions/gis-map/styles.css'
import { Button } from 'react-md'
import { navigate } from '@reach/router'

import './style.scss'

import SideAuctionCard from 'components/side-auction-card'

const CardsWithMap = ({ cardsData, live, type, user, refetch, className }) => {
  const [activePin, setPin] = useState()

  const renderCards = () =>
    cardsData?.map((el) => (
      <SideAuctionCard
        user={user}
        key={el?.uuid}
        auctionData={el}
        status={type}
        live={live}
        setPin={setPin}
        refetch={() => refetch()}
        className={`${activePin ? 'active' : ''}`}
      />
    ))
  const renderPins = () =>
    cardsData?.map((el) => ({
      id: el?.uuid,
      latitude: el?.listing?.property?.['general_location_y'],
      longitude: el?.listing?.property?.['general_location_x'],
    }))
  return (
    <div className="display-grid">
      <div className="cards">{renderCards()}</div>
      <div className="map">
        <MeeraMap
          isOnlyShowMeasureAndDraw
          id={`map`}
          fitBy="symbol-layer-id2"
          zoom={8}
          layers={[
            {
              type: 'symbol',
              id: 'Symbol-Layer-Id2',
              displayName: 'Plot Layer',
              items: renderPins(),
            },
          ]}
        />
      </div>
      {activePin && (
        <div className="pin-label">
          <img src={activePin?.img} />
          <span>
            {activePin?.city}, {activePin?.country}
          </span>
          <Button onClick={() => navigate(`detail/${activePin?.uuid}`)}>
            view details
          </Button>
        </div>
      )}
    </div>
  )
}
export default CardsWithMap
