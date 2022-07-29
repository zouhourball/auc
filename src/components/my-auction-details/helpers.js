export const dummyBiddersData = {
  bidders: [
    {
      bidderName: 'name',
      email: 'example@mail.com',
      phoneNumber: '22222222',
      bidDate: '24 jan 2022',
      bidTime: '11:30',
      bidAmount: '500',
    },
    {
      bidderName: 'name',
      email: 'example@mail.com',
      phoneNumber: '22222222',
      bidDate: '24 jan 2022',
      bidTime: '11:30',
      bidAmount: '500',
    },
    {
      bidderName: 'name',
      email: 'example@mail.com',
      phoneNumber: '22222222',
      bidDate: '24 jan 2022',
      bidTime: '11:30',
      bidAmount: '500',
    },
  ],
  keyFeatures: [{ label: 'feat1' }, { label: 'feat2' }, { label: 'feat13' }],
  images: [
    { url: 'https://picsum.photos/200' },
    { url: 'https://picsum.photos/200' },
    { url: 'https://picsum.photos/200' },
    { url: 'https://picsum.photos/200' },
  ],
}
export const dummyData = { title: 'test', propertyType: '1', address: 'kk' }

export const updateAuctionFormatData = (data) => {
  return {
    auction_end_date: data?.['auction_end_date'],
    auction_start_date: data?.['auction_start_date'],
    city_id: +data?.listing?.property?.['city_id'],
    count_bathrooms: data?.listing?.property?.['count_bathrooms'],
    count_bedrooms: data?.listing?.property?.['count_bedrooms'],
    count_kitchens: data?.listing?.property?.['count_kitchens'],
    country_id: data?.listing?.property?.['country_id'],
    days_to_pay_after_auction: data?.['days_to_pay_after_auction'],
    documents: [...data?.listing?.documents],
    features: [...data?.listing?.features],
    general_location_x: data?.listing?.property?.['general_location_x'],
    general_location_y: data?.listing?.property?.['general_location_y'],
    guarentee_fee: data?.['guarentee_fee'],
    images: [...data?.listing?.images],
    incremental_price: data?.['incremental_price'],
    participation_fee: data?.['participation_fee'],
    property_description: data?.description,
    property_type: data?.listing?.['property_id'],
    starting_price: data?.['starting_price'],
    title: data?.title,
    uuid: data?.uuid,
  }
}
