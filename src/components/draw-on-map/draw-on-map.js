import { useRef, useState } from 'react'
import { useTranslation } from 'libs/langs'

import { MeeraMap } from '@target-energysolutions/gis-map'
import { Button, DialogContainer } from 'react-md'
import '@target-energysolutions/gis-map/styles.css'

import './style.scss'

const DrawOnMap = ({
  id,
  onClose,
  onSetAddress,
  visible,
  readOnly,
  longitude,
  latitude,
}) => {
  const mapRef = useRef(null)
  const [newCoordinates, setNewCoordinates] = useState(null)
  const { t } = useTranslation()

  // const wkt = [

  //   // test intersections
  //   'POLYGON((58.39514225721359 23.59705784767128,58.396402895450585 23.59705784767128,58.396402895450585 23.59800168997583,58.39514225721359 23.59800168997583,58.39514225721359 23.59705784767128))',

  // // valid formats in Oman
  // //   'POLYGON((44.37982306465471 33.57166851587003,44.37735158050169 33.5266970064954,44.41071661656739 33.530817507852774,44.444287609645855 33.530989191148166))',
  // //   'POINT(44.44604873657226 33.51005501755449)',
  // //   'LINESTRING(44.43265914916991 33.617049512854535,44.41720962524413 33.5927442243088,44.443302154541 33.584164251506635,44.46184158325194 33.59817776573084,44.457378387451165 33.61333267725712)',
  // //   'POLYGON((44.46747969993273 33.57186480259821,44.46738455880256 33.57266964992938,44.467102791632286 33.57344356035223,44.46664522657628 33.57415679413916,44.46602944760301 33.57478194393558,44.46527911875312 33.57529498773215,44.464423074743486 33.57567621169021,44.46349421286535 33.57591096740684,44.46252822875976 33.575990234567556,44.46156224465416 33.57591096740684,44.460633382776024 33.57567621169021,44.45977733876639 33.57529498773215,44.4590270099165 33.57478194393558,44.45841123094323 33.57415679413916,44.457953665887224 33.57344356035223,44.45767189871696 33.57266964992938,44.45757675758678 33.57186480259821,44.45767189871696 33.57105994776336,44.457953665887224 33.57028601597182,44.45841123094323 33.569572750204415,44.4590270099165 33.56894756268446,44.45977733876639 33.56843448116436,44.460633382776024 33.568053225225825,44.46156224465416 33.56781844814054,44.46252822875976 33.56773917347614,44.46349421286535 33.56781844814054,44.464423074743486 33.568053225225825,44.46527911875312 33.56843448116436,44.46602944760301 33.56894756268446,44.46664522657628 33.569572750204415,44.467102791632286 33.57028601597182,44.46738455880256 33.57105994776336,44.46747969993273 33.57186480259821))',
  // //   'POLYGON((44.35918807983398 33.605326640815505,44.37086105346679 33.605326640815505,44.37086105346679 33.61161716061285,44.35918807983398 33.61161716061285,44.35918807983398 33.605326640815505))',
  // ]

  // const formatCoordinatesToMap = useMemo(
  //   () =>
  //     list?.map((list, index) => ({
  //       id: `${index + 1}`,
  //       longitude: +list.longitude,
  //       latitude: +list.latitude,
  //     })),
  //   [list],
  // )

  // const formatMapToCoordinates = (mapData) => {
  //   const res = mapData
  //     .split('((')[1]
  //     .split('))')[0]
  //     .split(',')
  //     .map((line, index) => ({
  //       plotType: null,
  //       coordinateSystem: null,
  //       longitude: line.split(' ')[0],
  //       latitude: line.split(' ')[1],
  //     }))
  //     .slice(0, length - 1)
  //   // console.log('res', res, Object.toString(res))
  //   // setList(res)
  // }

  const layers = [
    {
      type: 'road',
      id: 'road',
    },
    {
      type: 'symbol',
      id: 'symbol-layer-id',
      displayName: 'Well Sequence',
      defaults: {
        scale: 0.5,
      },
      // items: this.getWellsForMap(),
    },
    {
      id: 'test',
      type: 'popup',
      // items: this.getWellsPopupsForMap(),
    },
  ]

  // if (formatCoordinatesToMap?.length) {
  //   layers.push({
  //     type: 'polygon',
  //     id: 'polygon-id',
  //     displayName: 'Polygon Block',
  //     items: [
  //       {
  //         name: 'Block',
  //         id: 'pid1',
  //         color: '0,148,255,0.2',
  //         coordinates: formatCoordinatesToMap,
  //       },
  //     ],
  //   })
  // }
  // let latitude = 56.494
  // let longitude = 20.667
  return (
    <DialogContainer
      visible={visible}
      onHide={onClose}
      focusOnMount={false}
      className="drawOnMap"
      actions={[
        <Button key={0} flat onClick={() => onClose()}>
          {t('discard')}
        </Button>,
        <Button
          key={1}
          flat
          primary
          swapTheming
          onClick={() => {
            if (newCoordinates) {
              // formatMapToCoordinates(newCoordinates)
            }
            onSetAddress(newCoordinates)
            onClose()
          }}
        >
          {t('done')}
        </Button>,
      ]}
    >
      <div className="drawOnMap-map">
        <MeeraMap
          // ack={console.log}
          // onClickReverseGeoCode={console.log}
          // onLayerDataLoaded={console.log}
          // onDrawingComplete={setNewCoordinates}
          onReverseGeocoding={(addressInfo) => {
            setNewCoordinates(addressInfo)
            // console.log('Reverse GeoCoding', addressInfo?.['display_name'])
          }}
          // addWKTGeometries={wkt}
          id={`map-${id}`}
          onSymbolClick={(e) => {
            // this.setState({ popupVisiblity: e })
          }}
          className="map"
          ref={mapRef}
          fitBy="symbol-layer-id2"
          zoom={8}
          // center={[56.494, 20.667]}
          // geolocation={true}
          layers={
            readOnly
              ? [
                {
                  type: 'symbol',
                  id: 'Symbol-Layer-Id2',
                  displayName: 'Plot Layer',
                  items: [
                    {
                      id: 'Pinned',
                      latitude,
                      longitude,
                    },
                  ],
                },
              ]
              : [
                {
                  type: 'symbol',
                  id: 'Symbol-Layer-Id1',
                  items: [...layers],
                },
              ]
          }
        />
      </div>
    </DialogContainer>
  )
}

export default DrawOnMap
