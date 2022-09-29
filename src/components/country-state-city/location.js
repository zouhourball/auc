import { useState } from 'react'
import { CircularProgress } from 'react-md'
import { useQuery as useQueryHook } from 'react-apollo-hooks'

import CustomSelectWithSearch from 'components/custom-select-with-search'

import { useCurrentLang, useTranslation } from 'libs/langs'
import allCountryStateCitiesGql from 'libs/queries/country-state-city/all-country.gql'
import statesByCountryIDGql from 'libs/queries/country-state-city/states-by-id.gql'
import citiesByStateID from 'libs/queries/country-state-city/cities-by-id.gql'

import './style.scss'

const Location = ({
  sectionClassName,
  value,
  onSelect,
  countryDisabled,
  countryRequired,
  fieldClassName,
  stateDisabled,
  stateRequired,
  cityDisabled,
  cityRequired,
  errorCountryText,
  errorStateText,
  errorCityText,
  errorCountry,
  errorState,
  hideCity,
}) => {
  const { t } = useTranslation()
  const [textSearch, setTextSearch] = useState('')
  const [showListCountry, handleShowListCountry] = useState('')
  const [showListState, handleShowListState] = useState('')
  const [showListCity, handleShowListCity] = useState('')

  const { data: allCountryStateCities, loading: countryLoading } = useQueryHook(
    allCountryStateCitiesGql,
    {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      },
    },
  )

  const { data: states, loading: stateLoading } = useQueryHook(
    statesByCountryIDGql,
    {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      },
      variables: {
        countryID: `${value?.country?.id}`,
      },
      skip: !value?.country?.id,
    },
  )

  const { data: cities, loading: cityLoading } = useQueryHook(citiesByStateID, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
    variables: {
      stateID: `${value?.state?.id}`,
    },
    skip: !value?.state?.id,
  })

  /// /////////////// on select from selectField ////////////////

  const onSelectCountry = (c) => {
    const country = allCountryStateCities?.allCountries?.countries?.find(
      (ct) => ct.id === c,
    )
    onSelect({
      country,
      state: null,
      city: null,
      address: `${country.countryName}`,
    })
  }

  const onSelectState = (s) => {
    const country = allCountryStateCities?.allCountries?.countries?.find(
      (ct) => ct.id === value?.country?.id,
    )
    const state = states?.statesByCountryID?.find((st) => st.id === s)
    onSelect({
      country: value.country,
      state,
      city: null,
      address: `${state.name}, ${country.countryName}`,
    })
  }

  const onSelectCity = (c) => {
    const country = allCountryStateCities?.allCountries?.countries?.find(
      (ct) => ct.id === value?.country?.id,
    )
    const state = states?.statesByCountryID?.find(
      (st) => st.id === value.state.id,
    )
    const city = cities?.citiesByStateID?.find((ct) => ct.id === c)
    onSelect({
      country: value.country,
      state: value.state,
      city,
      address: `${city?.cityName}, ${state?.name}, ${country.countryName}`,
    })
  }

  /// /////////// render items//////////////
  const renderCountry = () => {
    let arrayName = []
    if (
      allCountryStateCities &&
      allCountryStateCities.allCountries &&
      allCountryStateCities.allCountries.countries
    ) {
      arrayName = allCountryStateCities?.allCountries?.countries?.map((ac) => {
        return {
          label:
            useCurrentLang() === 'ar' ? ac.countryNameArabic : ac.countryName,
          value: `${ac.id}`,
        }
      })
      return arrayName
    }
  }

  const renderStateFromValue = () => {
    let statesItem = []
    if (states?.statesByCountryID) {
      statesItem = states?.statesByCountryID?.map((item) => {
        return { label: item.name, value: `${item.id}` }
      })
    }
    return statesItem
  }

  const renderCityFromValue = () => {
    let citiesItem = []
    if (cities?.citiesByStateID) {
      citiesItem = cities?.citiesByStateID?.map((item) => {
        return { label: item.cityName, value: `${item.id}` }
      })
    }
    return citiesItem
  }

  return (
    <>
      <div className={`${sectionClassName || ''}`}>
        <div className="spinnerCountry">
          {countryLoading && <CircularProgress id="circular-progress-1" />}
          {!countryLoading && (
            // <SelectField
            //   id="select-field-with-elements"
            //   label={t('country')}
            //   placeholder={countryDisabled ? '' : t('select_country')}
            //   menuItems={renderCountry()}
            //   value={`${value?.country?.id}` || ''}
            //   onChange={onSelectCountry}
            //   required={countryRequired}
            //   fullWidth
            //   disabled={countryDisabled}
            //   position={SelectField.Positions.BELOW}
            //   className={`${fieldClassName || ''}`}
            //   repositionOnResize
            //   repositionOnScroll
            //   dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
            //   simplifiedMenu={false}
            //   error={errorCountry}
            //   errorText={errorCountryText}
            // />
            <CustomSelectWithSearch
              items={renderCountry().map((el) => ({
                label: el.label,
                id: el.value,
              }))}
              label={t('country')}
              hideSecondaryLabel={false}
              selectedItem={
                renderCountry()?.find((el) => el?.value === value?.country?.id)
                  ?.label || ''
              }
              searchPlaceholder={t('country')}
              onClickItem={(itemSelected) => {
                onSelectCountry(itemSelected.id)
                setTextSearch('')
              }}
              className={fieldClassName}
              hideAvatar={true}
              listVisibility={showListCountry}
              setListVisibility={handleShowListCountry}
              withHeader={true}
              searchItem={textSearch}
              setSearchItem={setTextSearch}
              searchItemPlaceHolder={t('search_country')}
              addItemBtnLabel={null}
              singleSelect={true}
              required={countryRequired}
              error={errorCountry}
              errorText={errorCountryText}
            />
          )}
        </div>
      </div>
      <div className={`${sectionClassName || ''}`}>
        <div className="spinnerState">
          {stateLoading && <CircularProgress id="circular-progress-2" />}
          {!stateLoading && (
            // <SelectField
            //   id="select-field-with-elements"
            //   label={t('state')}
            //   placeholder={stateDisabled ? '' : t('select_state')}
            //   fullWidth
            //   menuItems={renderStateFromValue()}
            //   value={value?.state?.id}
            //   onChange={onSelectState}
            //   disabled={stateDisabled}
            //   position={SelectField.Positions.BELOW}
            //   required={stateRequired}
            //   className={`${fieldClassName || ''}`}
            //   repositionOnResize
            //   repositionOnScroll
            //   simplifiedMenu={false}
            //   dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
            //   error={errorState}
            //   errorText={errorStateText}
            // />
            <CustomSelectWithSearch
              items={renderStateFromValue().map((el) => ({
                label: el.label,
                id: el.value,
              }))}
              hideSecondaryLabel={false}
              selectedItem={
                renderStateFromValue()?.find(
                  (el) => el?.value === value?.state?.id,
                )?.label || ''
              }
              searchPlaceholder={t('state')}
              label={t('state')}
              onClickItem={(itemSelected) => {
                onSelectState(itemSelected.id)
                setTextSearch('')
              }}
              className={fieldClassName}
              hideAvatar={true}
              listVisibility={showListState}
              setListVisibility={handleShowListState}
              withHeader={true}
              searchItem={textSearch}
              setSearchItem={setTextSearch}
              searchItemPlaceHolder={t('search_state')}
              addItemBtnLabel={null}
              singleSelect={true}
              required={stateRequired}
              error={errorState}
              errorText={errorStateText}
            />
          )}
        </div>
      </div>
      {!hideCity && (
        <div className="md-cell md-cell--4">
          <div className="spinnerCity">
            {cityLoading && <CircularProgress id="circular-progress-3" />}
            {!cityLoading && (
              // <SelectField
              //   id="select-field-with-elements"
              //   label={t('city')}
              //   position={SelectField.Positions.BELOW}
              //   placeholder={cityDisabled ? '' : t('select_city')}
              //   fullWidth
              //   menuItems={renderCityFromValue()}
              //   value={value?.city?.id}
              //   onChange={onSelectCity}
              //   required={cityRequired}
              //   disabled={cityDisabled}
              //   className={`${fieldClassName || ''}`}
              //   errorText={errorCityText}
              // />
              <CustomSelectWithSearch
                items={renderCityFromValue().map((el) => ({
                  label: el.label,
                  id: el.value,
                }))}
                hideSecondaryLabel={false}
                selectedItem={
                  renderCityFromValue()?.find(
                    (el) => el?.value === value?.city?.id,
                  )?.label || ''
                }
                searchPlaceholder={t('city')}
                label={t('city')}
                onClickItem={(itemSelected) => {
                  onSelectCity(itemSelected.id)
                  setTextSearch('')
                }}
                className={fieldClassName}
                hideAvatar={true}
                listVisibility={showListCity}
                setListVisibility={handleShowListCity}
                withHeader={true}
                searchItem={textSearch}
                setSearchItem={setTextSearch}
                searchItemPlaceHolder={t('search_city')}
                addItemBtnLabel={null}
                singleSelect={true}
                required={cityRequired}
                errorText={errorCityText}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Location
