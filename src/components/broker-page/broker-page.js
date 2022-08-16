import BrokerHeader from 'components/broker-header'
import { Avatar, Card, CardActions, CardTitle } from 'react-md'

import './style.scss'

const BrokerPage = () => {
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
      <Card className="md-block-centered" key={el?.name}>
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
      <BrokerHeader />
      <div className="broker-page-cards">{renderCards()}</div>
    </div>
  )
}
export default BrokerPage
