import Payment from './payment'
import PersonalInformation from './personal-information'
import Security from './security'
import './style.scss'
import Support from './support'

const ProfileBody = ({ currentView, setCurrentView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'PersonalInformation':
        return <PersonalInformation />
      case 'Payment':
        return <Payment />
      case 'Security':
        return <Security />
      case 'Support':
        return <Support />
      case 'PersonalInformationCompany':
        return <PersonalInformation company={true} />
      default:
        break
    }
  }
  return <div className="profile-body">{renderView()}</div>
}

export default ProfileBody
