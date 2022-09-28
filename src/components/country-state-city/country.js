import { SelectField, FontIcon } from 'react-md'
import { useQuery as useQueryHook } from 'react-apollo-hooks'

import { useTranslation } from 'libs/langs'

import allCountryStateCitiesGql from 'libs/queries/country-state-city/all-country.gql'

const Country = ({
  countryDisabled,
  currentCountry,
  countryRequired,
  fieldClassName,
  onSelectCountry,
  sectionClassName,
}) => {
  const { t } = useTranslation()
  const { data: allCountryStateCities } = useQueryHook(
    allCountryStateCitiesGql,
    {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      },
    },
  )

  const renderCountry = () => {
    let arrayName = []
    if (
      allCountryStateCities &&
      allCountryStateCities.allCountries &&
      allCountryStateCities.allCountries.countries
    ) {
      arrayName = allCountryStateCities?.allCountries?.countries?.map((ac) => {
        return {
          label: ac.countryName,
          value: `${ac.id}`,
        }
      })
      return arrayName
    }
  }

  const onSelectCountryValue = (c) => {
    const country = allCountryStateCities?.allCountries?.countries?.find(
      (ct) => ct.id === c,
    )
    onSelectCountry(country)
  }

  return (
    <div className={`${sectionClassName || ''}`}>
      <div className="spinnerCountry">
        <SelectField
          id="select-field-with-elements"
          // label={t('country')}
          placeholder={countryDisabled ? '' : t('select_country')}
          menuItems={renderCountry()}
          value={currentCountry || ''}
          onChange={onSelectCountryValue}
          required={countryRequired}
          fullWidth
          disabled={countryDisabled}
          position={SelectField.Positions.BELOW}
          className={`${fieldClassName || ''}`}
          repositionOnResize
          repositionOnScroll
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          simplifiedMenu={false}
        />
      </div>
    </div>
  )
}

export default Country
