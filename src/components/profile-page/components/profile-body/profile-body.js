import Payment from './payment'
import PersonalInformation from './personal-information'
import Security from './security'
import './style.scss'
import Support from './support'

const ProfileBody = ({ currentView, userInfo, refetch }) => {
  const renderView = () => {
    switch (currentView) {
      case 'PersonalInformation':
        return <PersonalInformation refetch={refetch} userInfo={userInfo} />
      case 'Payment':
        return <Payment />
      case 'Security':
        return <Security refetch={refetch} userInfo={userInfo} />
      case 'Support':
        return <Support />
      case 'PersonalInformationCompany':
        return (
          <PersonalInformation
            refetch={refetch}
            company={true}
            userInfo={userInfo}
          />
        )
      default:
        break
    }
  }
  return <div className="profile-body">{renderView()}</div>
}

export default ProfileBody
