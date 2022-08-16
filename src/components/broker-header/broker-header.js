import { useTranslation } from 'libs/langs'
import { FontIcon, TextField } from 'react-md'

import './style.scss'

const BrokerHeader = ({
  numOmani = 0,
  numForeign = 0,
  searchVal,
  setSearch,
}) => {
  const { t } = useTranslation()

  return (
    <div className="broker-header">
      <div className="broker-header-title active">Broker Company</div>
      <div className="broker-header-actions">
        <div className="switch">
          <button className="switch-toggle active">Omani ({numOmani})</button>
          <button className="switch-toggle">Foreign ({numForeign})</button>
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
