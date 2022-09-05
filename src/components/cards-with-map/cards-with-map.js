import { useState } from 'react'
import { MeeraMap } from '@target-energysolutions/gis-map'
import { Button } from 'react-md'
import { navigate } from '@reach/router'

import SideBiddingCard from 'components/side-bidding-card'

const CardsWithMap = ({ cardsData, live, type, user, refetch }) => {
  const [activePin, setPin] = useState({})

  const renderCards = () =>
    cardsData?.map((el) => (
      <SideBiddingCard
        user={user}
        className="md-cell md-cell--2"
        key={el?.uuid}
        auctionData={el}
        status={type}
        live={live}
        setPin={setPin}
        refetch={() => refetch()}
      />
    ))
  const renderPins = () =>
    cardsData?.map((el) => ({
      id: el?.uuid,
      latitude: el?.listing?.property?.['general_location_y'],
      longitude: el?.listing?.property?.['general_location_x'],
      popup: {
        'Well ID': '123456789',
        OtherInfo: 'Well Other Info',
      },
    }))
  return (
    <div>
      <div className="cards">{renderCards()}</div>
      <div className="map">
        <MeeraMap
          // isOnlyShowMeasureAndDraw
          // id={`map`}
          // className="map"
          // fitBy="symbol-layer-id2"
          // zoom={8}
          // layers={[
          //   {
          //     type: 'symbol',
          //     id: 'Symbol-Layer-Id2',
          //     displayName: 'Plot Layer',
          //     items: renderPins(),
          //   },
          // ]}
          mapRef={(map) => {
            // this.map = map
          }}
          isMiniMap={true}
          onSymbolClick={(e) => {
            // this.handleOnSymbolClick
            // console.log(e, 'event')
          }}
          footer={{
            visible: true,
            style: { color: '#fff', background: 'rgba(4,15,27,.7)' },
          }}
          isTocVisible={false}
          layers={[
            {
              type: 'symbol',
              id: 'symbol-layer-id',
              displayName: 'Edge Workflow',
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
