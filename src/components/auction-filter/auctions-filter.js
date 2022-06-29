import { FontIcon, SelectField, TextField } from 'react-md'

import './style.scss'
const AuctionsFilter = ({ filterData, setFilterData }) => {
  const { search, price, type, bedsBaths, more, auctionEndingSoon } = filterData
  return (
    <div className="md-grid auctions-filter">
      <TextField
        placeholder="What are looking for?"
        className="md-cell md-cell--3 auctions-filter-textField"
        value={search}
        onChange={(v) => setFilterData({ ...filterData, search: v })}
        rightIcon={<FontIcon>search</FontIcon>}
        block
      />
      <SelectField
        placeholder="Price"
        className=" md-cell md-cell--1 auctions-filter-selectField"
        value={price}
        onChange={(v) => setFilterData({ ...filterData, price: v })}
        menuItems={[
          { label: 'price1', value: 'p1' },
          { label: 'price2', value: 'p2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <SelectField
        placeholder="Type"
        className="md-cell md-cell--1 auctions-filter-selectField"
        value={type}
        onChange={(v) => setFilterData({ ...filterData, type: v })}
        menuItems={[
          { label: 'type1', value: 't1' },
          { label: 'type2', value: 't2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <SelectField
        placeholder="Beds & Baths"
        className="md-cell md-cell--2 auctions-filter-selectField"
        value={bedsBaths}
        onChange={(v) => setFilterData({ ...filterData, bedsBaths: v })}
        menuItems={[
          { label: 'beds1', value: 'b1' },
          { label: 'beds2', value: 'b2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <SelectField
        placeholder="More"
        className="md-cell md-cell--1 auctions-filter-selectField"
        value={more}
        onChange={(v) => setFilterData({ ...filterData, more: v })}
        menuItems={[
          { label: 'more1', value: 'm1' },
          { label: 'more2', value: 'm2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <div className="md-cell md-cell--1">Sort By</div>
      <SelectField
        placeholder="Auction ending soon"
        className="md-cell md-cell--3 auctions-filter-selectField"
        value={auctionEndingSoon}
        onChange={(v) => setFilterData({ ...filterData, auctionEndingSoon: v })}
        menuItems={[
          { label: 'auctionEndingSoon1', value: 'aes1' },
          { label: 'auctionEndingSoon12', value: 'aes2' },
        ]}
        position={SelectField.Positions.BELOW}
      />
    </div>
  )
}

export default AuctionsFilter
