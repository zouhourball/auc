import TopBar from 'components/top-bar'

const Auctions = () => {
  return (
    <div className="auctions">
      <TopBar
        modulesList={[
          {
            label: 'Services',
            linkToNewTab: '/public/services',
            key: 'services',
          },
          {
            link: () => {},
            linkToNewTab: '/public/HowItWorks',
            label: 'How It Works',
            key: 'howItWorks',
          },
          {
            link: () => {},
            linkToNewTab: '/public/auctions',
            label: 'auctions',
            key: 'auctions',
          },
          {
            link: () => {},
            // linkToNewTab: '/public/contactUS',
            label: 'Contact Us',
            key: 'contactUs',
          },
        ]}
        onClickLoginUrl={'/'}
        onClickRegisterUrl={'/public/register'}
        // logged={token}
      />
    </div>
  )
}
export default Auctions
