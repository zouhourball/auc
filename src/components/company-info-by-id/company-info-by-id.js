import companiesByOrgID from 'libs/queries/company-by-org-id.gql'
import { get } from 'lodash-es'
import { useQuery } from 'react-apollo-hooks'

const CompanyInfoById = ({ children, orgId }) => {
  const { data: brokerCompanyData } = useQuery(companiesByOrgID, {
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    variables: { organisationID: `${orgId}` },
  })

  return (
    <>
      {children &&
        children(get(brokerCompanyData, 'companyByOrganisationID', {}))}
    </>
  )
}

export default CompanyInfoById
