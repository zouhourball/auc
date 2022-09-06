import { useQuery } from 'react-apollo'
// import { useSelector } from 'react-redux'

import organisationByID from 'libs/queries/organization-by-id.gql'

const getOrganizationInfos = () => {
  // const orgId = useSelector(({ shell }) => shell?.organizationId)
  const orgId = 805

  const { data: organization } = useQuery(organisationByID, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      skip: !orgId,
    },
    variables: {
      orgId,
    },
  })
  return organization?.companyByOrganisationID
}

export default getOrganizationInfos
