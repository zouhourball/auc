import BrokerHeader from 'components/broker-header'
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
  ]
  const renderCards = () =>
    dummyData?.map((el) => (
      <div key={el?.name}>
        <img src={el?.img} />
        {el?.phone}
        {el?.country}
        {el?.address}
        {el?.email}
      </div>
    ))
  return (
    <div>
      <BrokerHeader />
      <div>{renderCards()}</div>
    </div>
  )
}
export default BrokerPage
