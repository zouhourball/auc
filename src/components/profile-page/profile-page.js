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
      <div className="md-cell md-cell--4">
        <ProfileMenu
          company={company}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
      <div className="md-cell md-cell--8">
        <ProfileBody
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
    </div>
  )
}

export default ProfilePage
