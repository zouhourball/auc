import { SelectField, FontIcon } from 'react-md'
import { useQuery as useQueryHook } from 'react-apollo-hooks'

import { useTranslation } from 'libs/langs'

import citiesByStateID from 'libs/queries/country-state-city/cities-by-id.gql'

const City = ({
  cityDisabled,
  currentCity,
  cityRequired,
  fieldClassName,
  stateId,
  onSelectCity,
  sectionClassName,
}) => {
  const { t } = useTranslation()

  const { data: cities } = useQueryHook(citiesByStateID, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
    variables: {
      stateID: `${stateId}`,
    },
    skip: !stateId,
  })

  const renderCityFromValue = () => {
    let citiesItem = []
    if (cities?.citiesByStateID) {
      citiesItem = cities?.citiesByStateID?.map((item) => {
        return { label: item.cityName, value: `${item.id}` }
      })
    }
    return citiesItem
  }

  const onSelectCityValue = (s) => {
    const city = cities?.citiesByStateID?.find((st) => st.id === s)
    onSelectCity(city)
  }

  return (
    <div className={`${sectionClassName || ''}`}>
      <div className="spinnerCity">
        <SelectField
          id="select-field-with-elements"
          // label={t('state')}
          placeholder={cityDisabled ? '' : t('select_city')}
          fullWidth
          menuItems={renderCityFromValue()}
          value={`${currentCity}` || ''}
          onChange={onSelectCityValue}
          disabled={cityDisabled}
          position={SelectField.Positions.BELOW}
          required={cityRequired}
          className={`${fieldClassName || ''}`}
          repositionOnResize
          repositionOnScroll
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
        />
      </div>
    </div>
  )
}

export default City
