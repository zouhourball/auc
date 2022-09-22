import { useState } from 'react'
import { Avatar, Card, CardActions, CardTitle, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

import BrokerHeader from 'components/broker-header'

import { allBrokersDetails } from 'libs/api/auctions-api'
import { useQuery } from 'react-query'
import { getPublicUrl } from 'libs/utils/custom-function'

import './style.scss'

const BrokerPage = ({ logged }) => {
  const [activeHeaderTab, setActiveHeaderTab] = useState(0)
  // const [filter, setFilter] = useState(0)
  const { data: getBrokers } = useQuery(['getBrokers'], allBrokersDetails)
  // const dummyData = [
  //   {
  //     name: 'broker name',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 2',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 3',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 2',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 3',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 2',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 3',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name 3',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  //   {
  //     name: 'broker name',
  //     phone: '+21552225',
  //     country: 'Oman',
  //     address: 'dummy address',
  //     email: 'email.com',
  //     img: 'url',
  //   },
  // ]
  // <>
  //             {' '}
  //             <button className="switch-toggle active">
  //               Omani ({numOmani})
  //             </button>
  //             <button className="switch-toggle">Foreign ({numForeign})</button>
  //           </>
  const headerTabs = [
    {
      key: 'broker',
      className: `broker-header-title ${activeHeaderTab === 0 ? 'active' : ''}`,
      onClick: () => setActiveHeaderTab(0),
      title: 'Broker Company',
    },
  ]
  const headerFilters = [
    // {
    //   key: 'omani',
    //   className: `switch-toggle ${filter === 0 ? 'active' : ''}`,
    //   onClick: () => setFilter(0),
    //   title: 'Omani',
    //   num: 10,
    // },
    // {
    //   key: 'foreign',
    //   className: `switch-toggle ${filter === 1 ? 'active' : ''}`,
    //   onClick: () => setFilter(1),
    //   title: 'Foreign',
    //   num: 10,
    // },
  ]
  const renderCards = () =>
    getBrokers?.results?.map((el) => (
      // <div key={el?.name}>
      //   <img src={el?.img} />
      //   {el?.phone}
      //   {el?.country}
      //   {el?.address}
      //   {el?.email}
      // </div>
      // eslint-disable-next-line react/jsx-key
      <Card
        className="md-block-centered"
        key={el?.name}
        onClick={() =>
          navigate(`/${logged ? 'auctions' : 'public'}/broker/${el.id}`)
        }
      >
        <CardTitle
          title={el?.name}
          subtitle={
            <div>
              <div className="info">
                <div className="label">
                  <FontIcon>phone_iphone</FontIcon> {el?.tel}
                </div>
                <div className="sep"></div>
                <div className="label">
                  <FontIcon>flag</FontIcon> {el?.conutry}
                </div>
              </div>
              <div className="label">
                <FontIcon>location_on</FontIcon> {el?.adress}
              </div>
            </div>
          }
          avatar={
            <Avatar src={getPublicUrl(el?.logo)} role="presentation">
              {!el?.logo && el?.name?.[0]}
            </Avatar>
          }
        />
        <CardActions>
          <div className="email">
            Email:{' '}
            <div className="address">
              <FontIcon>email</FontIcon> {el?.email}
            </div>
          </div>
        </CardActions>
      </Card>
    ))
  return (
    <div className="broker-page">
      <BrokerHeader tabs={headerTabs} filters={headerFilters} />
      <div className="broker-page-cards">{renderCards()}</div>
    </div>
  )
}
export default BrokerPage
