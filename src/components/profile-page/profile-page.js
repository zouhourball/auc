import { useState } from 'react'
import ProfileBody from './components/profile-body'
import ProfileMenu from './components/profile-menu'

import './style.scss'

const ProfilePage = ({ company }) => {
  const [currentView, setCurrentView] = useState(
    company ? 'PersonalInformationCompany' : 'PersonalInformation',
  )
  return (
    <div className="md-grid profile-page">
      <div className="profile-page-left md-cell md-cell--3">
        <ProfileMenu
          company={company}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        <div className="vertical-sep"></div>
      </div>
      <div className="profile-page-right md-cell md-cell--9">
        <ProfileBody
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
    </div>
  )
}

export default ProfilePage
