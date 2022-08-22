import { useTranslation } from 'libs/langs'
import { FontIcon, TextField } from 'react-md'

import './style.scss'

const BrokerHeader = ({
  numOmani = 0,
  numForeign = 0,
  searchVal,
  setSearch,
  tabs,
  filters,
}) => {
  const { t } = useTranslation()
  const renderTabs = () =>
    tabs?.map((el) => (
      <div
        key={el?.key}
        className={el?.className}
        onClick={() => el?.onClick()}
      >
        {el?.title}
      </div>
    ))

  const renderFilters = () =>
    filters?.map((el) => (
      <button
        key={el?.key}
        className={el?.className}
        onClick={() => el?.onClick()}
      >
        {el?.title} ({el?.num})
      </button>
    ))
  return (
    <div className="broker-header">
      {tabs ? (
        renderTabs()
      ) : (
        <div className="broker-header-title active">Broker Company</div>
      )}
      <div className="broker-header-actions">
        <div className="switch">
          {filters ? (
            renderFilters()
          ) : (
            <>
              {' '}
              <button className="switch-toggle active">
                Omani ({numOmani})
              </button>
              <button className="switch-toggle">Foreign ({numForeign})</button>
            </>
          )}
        </div>
        <TextField
          className="search-field"
          type="text"
          id="search"
          value={searchVal}
          rightIcon={<FontIcon>{t('search')}</FontIcon>}
          onChange={(v, e) => {
            e.stopPropagation()
            setSearch(v)
          }}
          placeholder="Search..."
          block
        />
      </div>
    </div>
  )
}
export default BrokerHeader
