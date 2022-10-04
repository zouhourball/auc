import { navigate } from '@reach/router'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import UserInfoBySubject from 'components/user-info-by-subject'
import { useTranslation } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import { get } from 'lodash-es'

import { Avatar, Button } from 'react-md'
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
      {/* <img
        src={avatar}
        width={100}
        height={100}
        style={{ borderRadius: 100 }}
      /> */}
      <div>
        <b>{userInfo?.fullName}</b>
      </div>
      <div>{userInfo?.email}</div>
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
