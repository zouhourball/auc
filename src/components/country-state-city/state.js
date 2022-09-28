import { SelectField, FontIcon } from 'react-md'
import { useQuery as useQueryHook } from 'react-apollo-hooks'

import { useTranslation } from 'libs/langs'

import statesByCountryIDGql from 'libs/queries/country-state-city/states-by-id.gql'

const State = ({
  stateDisabled,
  currentState,
  stateRequired,
  fieldClassName,
  countryId,
  onSelectState,
  sectionClassName,
}) => {
  const { t } = useTranslation()

  const { data: states } = useQueryHook(statesByCountryIDGql, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
    variables: {
      countryID: `${countryId}`,
    },
    skip: !countryId,
  })

  const renderStateFromValue = () => {
    let statesItem = []
    if (states?.statesByCountryID) {
      statesItem = states?.statesByCountryID?.map((item) => {
        return { label: item.name, value: `${item.id}` }
      })
    }
    return statesItem
  }

  const onSelectStateValue = (s) => {
    const state = states?.statesByCountryID?.find((st) => st.id === s)
    onSelectState(state)
  }

  return (
    <div className={`${sectionClassName || ''}`}>
      <div className="spinnerState">
        <SelectField
          id="select-field-with-elements"
          // label={t('state')}
          placeholder={stateDisabled ? '' : t('select_state')}
          fullWidth
          menuItems={renderStateFromValue()}
          value={`${currentState}` || ''}
          onChange={onSelectStateValue}
          disabled={stateDisabled}
          position={SelectField.Positions.BELOW}
          required={stateRequired}
          className={`${fieldClassName || ''}`}
          repositionOnResize
          repositionOnScroll
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
        />
      </div>
    </div>
  )
}

export default State
