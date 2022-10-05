import { navigate } from '@reach/router'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import { useTranslation } from 'libs/langs'

import { Button } from 'react-md'
import avatar from './avatar.jpg'
import './style.scss'

const ProfileMenu = ({ currentView, setCurrentView, company }) => {
  const { t } = useTranslation()

  return (
    <div className="profile-menu">
      <img
        className="profile-menu-avatar"
        src={avatar}
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
      />
      <div className="profile-menu-fullName">Ahmed Mohammed</div>
      <div className="profile-menu-email">ahmed@gmail.com</div>
      <br />
      {(!company ? views : viewsCompany)?.map(({ label, value }) => (
        <Button
          className={`profile-menu-infoBtn ${
            currentView === value ? 'active' : ''
          }`}
          key={value}
          onClick={() => setCurrentView(value)}
          // primary={currentView === value}
        >
          {label}
        </Button>
      ))}
      <Button
        key={'signOut'}
        className="profile-menu-infoBtn"
        onClick={() => {
          cleanUp()
          navigate('/public/home')
        }}
      >
        {t('sign_out')}
      </Button>
    </div>
  )
}

export default ProfileMenu

const views = [
  {
    label: 'Personal Information',
    value: 'PersonalInformation',
  },
  {
    label: 'Payment',
    value: 'Payment',
  },
  {
    label: 'Security',
    value: 'Security',
  },
  {
    label: 'Support',
    value: 'Support',
  },
]
const viewsCompany = [
  {
    label: 'Personal Information',
    value: 'PersonalInformationCompany',
  },
  {
    label: 'Security',
    value: 'Security',
  },
  {
    label: 'Support',
    value: 'Support',
  },
]
