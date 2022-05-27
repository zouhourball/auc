import seeUserProfileBySubject from 'libs/queries/user-profile-by-subject.gql'
import { useQuery } from 'react-apollo-hooks'
import { get } from 'lodash-es'

const UserInfoBySubject = ({ children, subject }) => {
  const { data: userInfo } = useQuery(seeUserProfileBySubject, {
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    variables: { subject },
  })

  return (
    <>
      {children && children(get(userInfo, 'seeUserProfileBySubject.user', {}))}
    </>
  )
}

export default UserInfoBySubject
