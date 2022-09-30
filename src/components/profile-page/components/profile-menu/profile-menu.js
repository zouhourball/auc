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
        src={avatar}
        width={100}
        height={100}
        style={{ borderRadius: 100 }}
      />
      <div>
        <b>Ahmed Mohammed</b>
      </div>
      <div>ahmed@gmail.com</div>
      <br />
      <br />
      {(!company ? views : viewsCompany)?.map(({ label, value }) => (
        <Button
          key={value}
          onClick={() => setCurrentView(value)}
          primary={currentView === value}
        >
          {label}
        </Button>
      ))}
      <Button
        key={'signOut'}
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
