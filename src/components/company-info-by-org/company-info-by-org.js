import companiesByOrgID from 'libs/queries/companies-by-org-id.gql'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'

const CompanyInfoByOrg = ({ organization, children }) => {
  return <>{children && children(organization)}</>
}

export default graphql(companiesByOrgID, {
  options: (props) => ({
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    notifyOnNetworkStatusChange: true,
    variables: { organisationIDs: [`${get(props, 'organisationID', null)}`] },
  }),
  props: (response) => {
    return {
      organization: get(response, 'data.companiesByOrganisationIDs', []),
    }
  },
})(CompanyInfoByOrg)
