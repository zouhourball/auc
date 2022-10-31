import { navigate } from '@reach/router'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import UserInfoBySubject from 'components/user-info-by-subject'
import { useTranslation } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import { get } from 'lodash-es'
import { useState } from 'react'

import { Avatar, Button, DialogContainer } from 'react-md'

import companyEnabled from 'images/company_enable.svg'
import companyDisabled from 'images/company_disable.svg'
import securityEnabled from 'images/security_enable.svg'
import securityDisabled from 'images/security_disable.svg'
import supportEnabled from 'images/support_enable.svg'
import supportDisabled from 'images/support_disable.svg'
import payementEnabled from 'images/payment_enable.svg'
import payementDisabled from 'images/payment_disable.svg'
import signOutEnabled from 'images/sign_out_enable.svg'
import signOutDisabled from 'images/sign_out_disable.svg'

// import avatar from './avatar.jpg'
// import success from './Success.svg'

import './style.scss'

const ProfileMenu = ({ currentView, setCurrentView, company, userInfo }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

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

      <div className="profile-menu-fullName">{userInfo?.fullName}</div>
      <div className="profile-menu-email">{userInfo?.email}</div>
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
            <span>{t(label)}</span>
          </Button>
        ),
      )}
      <Button
        key={'signOut'}
        className="profile-menu-infoBtn"
        onClick={() => setVisible(true)}
        iconEl={
          <img width={13} src={visible ? signOutEnabled : signOutDisabled} />
        }
      >
        {t('sign_out')}
      </Button>
      {visible && (
        <DialogContainer
          visible={visible}
          dialogClassName="change-email-dialog"
          focusOnMount={false}
          onHide={() => setVisible(false)}
          actions={[
            <Button key={'2'} flat onClick={() => setVisible(false)}>
              {t('cancel')}
            </Button>,
            <Button
              key={'3'}
              flat
              primary
              swapTheming
              onClick={() => {
                cleanUp()
                navigate('/public/home')
              }}
            >
              {t('confirm')}
            </Button>,
          ]}
        >
          <div style={{ margin: '20px auto', textAlign: 'center' }}>
            <img
              src={signOutEnabled}
              width={50}
              height={50}
              className="success-image"
            />
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {t('are_you_sure')}
          </h2>
        </DialogContainer>
      )}
    </div>
  )
}

export default ProfileMenu

const views = [
  {
    label: 'personal_information',
    value: 'PersonalInformation',
    iconEnabled: companyEnabled,
    iconDisabled: companyDisabled,
  },
  {
    label: 'payment',
    value: 'Payment',
    iconEnabled: payementEnabled,
    iconDisabled: payementDisabled,
  },
  {
    label: 'security',
    value: 'Security',
    iconEnabled: securityEnabled,
    iconDisabled: securityDisabled,
  },
  {
    label: 'support',
    value: 'Support',
    iconEnabled: supportEnabled,
    iconDisabled: supportDisabled,
  },
]
const viewsCompany = [
  {
    label: 'company_information',
    value: 'PersonalInformationCompany',
    iconEnabled: companyEnabled,
    iconDisabled: companyDisabled,
  },
  {
    label: 'security',
    value: 'Security',
    iconEnabled: securityEnabled,
    iconDisabled: securityDisabled,
  },
  {
    label: 'support',
    value: 'Support',
    iconEnabled: supportEnabled,
    iconDisabled: securityDisabled,
  },
]
