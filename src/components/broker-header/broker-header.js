import { TextField } from 'react-md'

const BrokerHeader = ({
  numOmani = 0,
  numForeign = 0,
  searchVal,
  setSearch,
}) => {
  return (
    <div>
      <span>Broker Company</span>
      <div>
        <span>Omani ({numOmani})</span>
        <span>Foreign ({numForeign})</span>
      </div>
      <TextField
        type="text"
        id="search"
        value={searchVal}
        onChange={(v, e) => {
          e.stopPropagation()
          setSearch(v)
        }}
        placeholder="Search..."
      />
    </div>
  )
}
export default BrokerHeader
