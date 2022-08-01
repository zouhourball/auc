import { useRef, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'libs/langs'

import { MeeraMap } from '@target-energysolutions/gis-map'
import { FontIcon } from 'react-md'
import { flatMap, get } from 'lodash'
import { checkIntersections } from 'libs/api/api-map'

// const polygon = 'POLYGON((58.39514225721359 23.59705784767128,58.396402895450585 23.59705784767128,58.396402895450585 23.59800168997583,58.39514225721359 23.59800168997583,58.39514225721359 23.59705784767128))'
// const dataSource = {
//   url: 'https://was.dev.meeraspace.com/geoserver/filespace/wfs?',
//   featureName: 'filespace:osmalkhuwair',
//   shapeAttributeName: 'the_geom',
//   polygon:
//   'POLYGON((58.39514225721359 23.59705784767128,58.396402895450585 23.59705784767128,58.396402895450585 23.59800168997583,58.39514225721359 23.59800168997583,58.39514225721359 23.59705784767128))',
// }

// const dataset = [
//   { sourceName: 'OGDR', entityName: 'PIPELINE', x: 10, y: 20 },
//   { sourceName: 'OGDR', entityName: 'POWERLINE', x: 30, y: 30 },
//   { sourceName: 'MOH', entityName: 'ROAD', x: 45, y: 45 },
// ]
const MapResult = ({ id, list, dataset }) => {
  const { t } = useTranslation()

  const dataSources = useMemo(
    () =>
      flatMap(dataset, ({ dataSourceValueList, dataSourceName }) =>
        dataSourceValueList.map((elem) => ({ ...elem, dataSourceName })),
      ),
    [dataset],
  )

  const mapRef = useRef(null)

  const dataSourcesContentLength = Array.from(
    { length: dataSources.length },
    () => {
      const [length, setLength] = useState(0)
      return { length, setLength }
    },
  )

  const formatCoordinatesToMap = useMemo(
    () =>
      list.map((item, index) => ({
        id: `${index + 1}`,
        longitude: +item.longitude,
        latitude: +item.latitude,
      })),
    [list],
  )

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
    },
    {
      id: 'test',
      type: 'popup',
    },
  ]

  if (formatCoordinatesToMap.length) {
    layers.push({
      type: 'polygon',
      id: 'polygon-id',
      displayName: 'Polygon Block',
      items: [
        {
          name: 'Block',
          id: 'pid1',
          color: '0,148,255,0.2',
          coordinates: formatCoordinatesToMap,
        },
      ],
    })
  }

  const renderTableBody = useMemo(
    () =>
      dataSources.map((data, index) => (
        <DataSourceDetails
          key={index}
          list={list}
          dataSource={{ ...data, index }}
          setLength={(length) =>
            dataSourcesContentLength[index].setLength(length)
          }
        />
      )),
    [dataSources],
  )

  return (
    <div className="mapResult">
      <div className="mapResult-map">
        <MeeraMap
          id={`map-${id}`}
          onSymbolClick={(e) => null}
          className="map"
          ref={mapRef}
          fitBy="symbol-layer-id2"
          zoom={8}
          center={[56.494, 20.667]}
          layers={layers}
        />
      </div>
      <div className="mapResult-table md-paper--1">
        {!!dataSourcesContentLength.filter(({ length }) => !!length).length && (
          <div className="mapResult-table-header">
            <div className="mapResult-table-cell">{t('source')}</div>
            <div className="mapResult-table-cell">{t('entity_name')}</div>
            <div className="mapResult-table-cell">{t('inter_x')}</div>
            <div className="mapResult-table-cell">{t('inter_y')}</div>
          </div>
        )}
        <div className="mapResult-table-body">{renderTableBody}</div>
      </div>
      <div className="mapResult-validation md-paper--1">
        <div className="mapResult-validation-header">{t('valid_result')}</div>
        <div className="mapResult-validation-content">
          {dataSources.map((dataSource, index) => (
            <div key={index} className="mapResult-validation-item">
              <FontIcon
                className="mapResult-validation-icon"
                iconClassName={`mdi ${
                  dataSourcesContentLength[index].length
                    ? 'mdi-close-circle-outline'
                    : 'mdi-checkbox-marked-circle-outline'
                }`}
              />
              {dataSource.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapResult

const DataSourceDetails = ({ list, dataSource, setLength = () => null }) => {
  const [display, setDisplay] = useState(null)
  const polygon = useMemo(
    () =>
      `POLYGON((${(list && list.length ? list.concat(list[0]) : [])
        .map(({ longitude, latitude }) => `${longitude} ${latitude}`)
        .join(',')}))`,
    [list],
  )

  // console.log('polygon', polygon)
  // console.log('dataSource', dataSource)
  // const { url, featureName, shapeAttributeName, PolygonValues } = fakeDataset[0]
  useEffect(() => {
    if (list && list.length > 0 && dataSource) {
      const params = {
        wfsUrl: dataSource.url,
        layerName: dataSource.featureName,
        crsCode: 4326,
        filter: `INTERSECTS(the_geom, SRID=4326;${polygon})`,
      }
      checkIntersections(params)
        .then((res) => {
          let data = flatMap(
            get(res, 'features', []).map((feature) =>
              get(feature, 'geometry.coordinates.0.0', []).map(
                (coordinates) => ({
                  x: coordinates[0],
                  y: coordinates[1],
                }),
              ),
            ),
            (e) => e,
          )
          setDisplay(data)
          setLength(data.length)
        })
        .catch(() => {
          setDisplay('error')
          setLength(0)
        })
    }
  }, [list, dataSource])

  const show = display
    ? display !== 'error'
      ? display.map(({ x, y }, position) => (
        <div
          key={`${dataSource.index}-${position}`}
          className="mapResult-table-row"
        >
          <div className="mapResult-table-cell">
            {dataSource.dataSourceName}
          </div>
          <div className="mapResult-table-cell">{dataSource.name}</div>
          <div className="mapResult-table-cell">{x}</div>
          <div className="mapResult-table-cell">{y}</div>
        </div>
      ))
      : null
    : null
  return <>{show}</>
}
