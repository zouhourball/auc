import { FontIcon, SelectField, TextField } from 'react-md'

import './style.scss'
const AuctionsFilter = ({ filterData, setFilterData }) => {
  const { search, price, type, bedsBaths, more, auctionEndingSoon } = filterData
  return (
    <div className="md-grid auctions-filter">
      <TextField
        label="What are looking for?"
        className="md-cell md-cell--4 search-text-field"
        value={search}
        onChange={(v) => setFilterData({ ...filterData, search: v })}
        rightIcon={<FontIcon>search</FontIcon>}
      />
      <SelectField
        label="Price"
        className=" md-cell md-cell--1 auction-filter-select-field"
        value={price}
        onChange={(v) => setFilterData({ ...filterData, price: v })}
        menuItems={[
          { label: 'price1', value: 'p1' },
          { label: 'price2', value: 'p2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <SelectField
        label="Type"
        className="md-cell md-cell--1 auctions-filter-select-field"
        value={type}
        onChange={(v) => setFilterData({ ...filterData, type: v })}
        menuItems={[
          { label: 'type1', value: 't1' },
          { label: 'type2', value: 't2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <SelectField
        label="Beds & Baths"
        className="md-cell md-cell--1 auctions-filter-select-field"
        value={bedsBaths}
        onChange={(v) => setFilterData({ ...filterData, bedsBaths: v })}
        menuItems={[
          { label: 'beds1', value: 'b1' },
          { label: 'beds2', value: 'b2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <SelectField
        label="More"
        className="md-cell md-cell--1 auctions-filter-more-select-field"
        value={more}
        onChange={(v) => setFilterData({ ...filterData, more: v })}
        menuItems={[
          { label: 'more1', value: 'm1' },
          { label: 'more2', value: 'm2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <h3>Sort By</h3>
      <SelectField
        label="Auction ending soon"
        className="md-cell md-cell--3 auctions-filter-select-field"
        value={auctionEndingSoon}
        onChange={(v) => setFilterData({ ...filterData, auctionEndingSoon: v })}
        menuItems={[
          { label: 'auctionEndingSoon1', value: 'aes1' },
          { label: 'auctionEndingSoon12', value: 'aes2' },
        ]}
        position={SelectField.Positions.BELOW}
        block
      />
    </div>
  )
}

export default AuctionsFilter
