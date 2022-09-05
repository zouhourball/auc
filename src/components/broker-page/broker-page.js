import { useState } from 'react'
import { Avatar, Card, CardActions, CardTitle } from 'react-md'
import { navigate } from '@reach/router'

import BrokerHeader from 'components/broker-header'

import './style.scss'

const BrokerPage = () => {
  const [activeHeaderTab, setActiveHeaderTab] = useState(0)
  const [filter, setFilter] = useState(0)
  const dummyData = [
    {
      name: 'broker name',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 2',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 3',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 2',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 3',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 2',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 3',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name 3',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
    {
      name: 'broker name',
      phone: '+21552225',
      country: 'Oman',
      address: 'dummy address',
      email: 'email.com',
      img: 'url',
    },
  ]
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
    {
      key: 'omani',
      className: `switch-toggle ${filter === 0 ? 'active' : ''}`,
      onClick: () => setFilter(0),
      title: 'Omani',
      num: 10,
    },
    {
      key: 'foreign',
      className: `switch-toggle ${filter === 1 ? 'active' : ''}`,
      onClick: () => setFilter(1),
      title: 'Foreign',
      num: 10,
    },
  ]
  const renderCards = () =>
    dummyData?.map((el) => (
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
        onClick={() => navigate(`/auctions/broker/${1}`)}
      >
        <CardTitle
          title={el?.name}
          subtitle={
            <div>
              <div className="info">
                <div className="label">{el?.phone}</div>
                <div className="sep"></div>
                <div className="label">{el?.country}</div>
              </div>
              <div className="label">{el?.address}</div>
            </div>
          }
          avatar={<Avatar src={el?.img} role="presentation" />}
        />
        <CardActions>
          <div className="email">
            Email: <div className="address"> {el?.email}</div>
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
