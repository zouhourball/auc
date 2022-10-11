import { navigate } from '@reach/router'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import UserInfoBySubject from 'components/user-info-by-subject'
import { useTranslation } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import { get } from 'lodash-es'
import { useState } from 'react'

import { Avatar, Button, DialogContainer } from 'react-md'
// import avatar from './avatar.jpg'
import success from './Success.svg'

import './style.scss'

const ProfileMenu = ({ currentView, setCurrentView, company, userInfo }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  return (
    <div className="profile-menu">
      {/* <img
        className="profile-menu-avatar"
        src={avatar}
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
      /> */}
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
        onClick={() => setVisible(true)}
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
            <Button key={'2'} onClick={() => setVisible(false)}>
              Cancel
            </Button>,
            <Button
              key={'3'}
              onClick={() => {
                cleanUp()
                navigate('/public/home')
              }}
            >
              Confirm
            </Button>,
          ]}
        >
          <div>
            <img
              src={success}
              width={50}
              height={50}
              className="success-image"
              style={{
                borderRadius: '50%',
              }}
            />
            <h2>Are you sure you want to sign out?</h2>
          </div>
        </DialogContainer>
      )}
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
