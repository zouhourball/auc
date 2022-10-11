import { navigate } from '@reach/router'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import UserInfoBySubject from 'components/user-info-by-subject'
import { useTranslation } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import { get } from 'lodash-es'

import { Avatar, Button } from 'react-md'

import companyEnabled from 'images/company_enable.svg'
import companyDisabled from 'images/company_disable.svg'
import securityEnabled from 'images/security_enable.svg'
import securityDisabled from 'images/security_disable.svg'
import supportEnabled from 'images/support_enable.svg'
import supportDisabled from 'images/support_disable.svg'
import payementEnabled from 'images/payment_enable.svg'
import payementDisabled from 'images/payment_disable.svg'
// import signOutEnabled from 'images/sign_out_enable.svg'
// import signOutDisabled from 'images/sign_out_disable.svg'

// import avatar from './avatar.jpg'
import './style.scss'

const ProfileMenu = ({ currentView, setCurrentView, company, userInfo }) => {
  const { t } = useTranslation()

  return (
    <div className="profile-menu">
      <UserInfoBySubject key={userInfo?.subject} subject={userInfo?.subject}>
        {(res) => {
          return (
            <Avatar
              className="profile-menu-avatar"
              src={
                get(res, 'photo.aPIURL', null)
                  ? getPublicUrl(res?.photo?.aPIURL)
                  : null
              }
            >
              {get(res, 'photo.aPIURL', null)
                ? null
                : get(res, 'fullName.0', '')}
            </Avatar>
          )
        }}
      </UserInfoBySubject>

      <div className="profile-menu-fullName">Ahmed Mohammed</div>
      <div className="profile-menu-email">ahmed@gmail.com</div>
      <br />
      {(!company ? views : viewsCompany)?.map(
        ({ label, value, iconDisabled, iconEnabled }) => (
          <Button
            className={`profile-menu-infoBtn ${
              currentView === value ? 'active' : ''
            }`}
            key={value}
            onClick={() => setCurrentView(value)}
            iconEl={
              <img
                width={13}
                src={currentView === value ? iconEnabled : iconDisabled}
              />
            }
          >
            <span>{label}</span>
          </Button>
        ),
      )}
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
    iconEnabled: companyEnabled,
    iconDisabled: companyDisabled,
  },
  {
    label: 'Payment',
    value: 'Payment',
    iconEnabled: payementEnabled,
    iconDisabled: payementDisabled,
  },
  {
    label: 'Security',
    value: 'Security',
    iconEnabled: securityEnabled,
    iconDisabled: securityDisabled,
  },
  {
    label: 'Support',
    value: 'Support',
    iconEnabled: supportEnabled,
    iconDisabled: supportDisabled,
  },
]
const viewsCompany = [
  {
    label: 'Personal Information',
    value: 'PersonalInformationCompany',
    iconEnabled: companyEnabled,
    iconDisabled: companyDisabled,
  },
  {
    label: 'Security',
    value: 'Security',
    iconEnabled: securityEnabled,
    iconDisabled: securityDisabled,
  },
  {
    label: 'Support',
    value: 'Support',
    iconEnabled: supportEnabled,
    iconDisabled: securityDisabled,
  },
]
