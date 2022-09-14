import { useState } from 'react'
import { MeeraMap } from '@target-energysolutions/gis-map'
import '@target-energysolutions/gis-map/styles.css'
// import { Button } from 'react-md'
import store from 'libs/store'
import { navigate } from '@reach/router'

import SideAuctionCard from 'components/side-auction-card'
import { propertyTypeList } from 'components/helpers'

import './style.scss'

const CardsWithMap = ({ cardsData, live, type, user, refetch, className }) => {
  const downloadToken = store?.getState()?.app?.dlToken

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
        activePin={activePin}
        refetch={() => refetch()}
        // className={`${activePin ? '' : 'active'}`}
      />
    ))
  const renderPins = () =>
    cardsData?.map((el) => ({
      id: el?.uuid,
      latitude: el?.listing?.property?.['general_location_y'],
      longitude: el?.listing?.property?.['general_location_x'],
      popup: {
        image: `${
          el?.listing?.images?.find((img) => img?.['cover_image'])
            ? el?.listing?.images?.find((img) => img?.['cover_image'])?.url
            : el?.listing?.images?.[0]?.url
        }?token=${downloadToken}&view=true`,
        propertyType: propertyTypeList.find(
          (propertyId) =>
            propertyId?.value === +el?.listing?.property?.['property_type_id'],
        )?.label,
        address: `${el?.listing?.property?.city?.['name_en']}, ${el?.listing?.property?.country?.['name_en']}`,
        action: (id) => navigate(`detail/${el?.uuid}`),
        actionLabel: 'View Details',
      },
    }))

  return (
    <div className="display-grid">
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
          onSymbolClick={({ id }) => {
            // this.handleOnSymbolClick
            setPin(cardsData?.find((el) => el?.uuid === id))
            // console.log(activePin, 'event')
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
              displayName: 'Auctions',
              items: renderPins(),
            },
          ]}
        />
      </div>
      {/* {activePin && (
        <div className="pin-label">
          <img src={activePin?.img} />
          <div className="title">Villa</div>
          <div className="city">
            {activePin?.city}, {activePin?.country}
          </div>
          <Button
            className="viewBtn"
            onClick={() => navigate(`detail/${activePin?.uuid}`)}
          >
            view details
          </Button>
        </div>
      )} */}
    </div>
  )
}
export default CardsWithMap
