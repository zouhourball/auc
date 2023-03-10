import { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import ProfileBody from './components/profile-body'
import ProfileMenu from './components/profile-menu'
// import seeUserProfileBySubject from 'libs/queries/user-profile-by-subject.gql'
import { meQuery } from 'libs/queries/me-query.gql'
import { meQueryProfile } from 'libs/queries/me-query-all.gql'
import organisationByID from 'libs/queries/organization-by-id.gql'

import './style.scss'
// import { useSelector } from 'react-redux'

const ProfilePage = ({ company, companyId }) => {
  const [currentView, setCurrentView] = useState(
    company ? 'PersonalInformationCompany' : 'PersonalInformation',
  )
  // const orgId = useSelector(({ shell }) => shell?.organizationId) || '805'

  const { data: currentUser } = useQuery(meQuery, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  // const { data: userInfo } = useQuery(seeUserProfileBySubject, {
  //   context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
  //   variables: { subject: currentUser?.mev2?.user?.subject },
  // })

  const { data, refetch: refetchProfile } = useQuery(meQueryProfile, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
  })
  const { data: organization, refetch: refetchOrg } = useQuery(
    organisationByID,
    {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
        // skip: !orgId,
      },
      variables: {
        orgId: companyId,
      },
    },
  )
  return (
    <div className="md-grid profile-page">
      <div className="profile-page-left md-cell md-cell--2">
        <ProfileMenu
          userInfo={
            !company
              ? {
                // ...userInfo?.seeUserProfileBySubject?.user,
                subject: currentUser?.mev2?.user?.subject,
                ...data?.me?.userProfile,
              }
              : {
                ...organization?.companyByOrganisationID,
                subject: currentUser?.mev2?.user?.subject,
                ...data?.me?.userProfile,
              }
          }
          company={company}
          currentView={currentView}
          setCurrentView={setCurrentView}
          refetch={() => {
            refetchProfile()
            refetchOrg()
          }}
        />
        <div className="vertical-sep"></div>
      </div>
      <div className="profile-page-right md-cell md-cell--8">
        <ProfileBody
          userInfo={
            !company
              ? {
                // ...userInfo?.seeUserProfileBySubject?.user,
                subject: currentUser?.mev2?.user?.subject,
                ...data?.me?.userProfile,
              }
              : {
                subject: currentUser?.mev2?.user?.subject,
                ...organization?.companyByOrganisationID,
                ...data?.me?.userProfile,
              }
          }
          currentView={currentView}
          refetch={() => {
            refetchProfile()
            refetchOrg()
          }}
        />
      </div>
      <div className="md-cell md-cell--2"></div>
    </div>
  )
}

export default ProfilePage
