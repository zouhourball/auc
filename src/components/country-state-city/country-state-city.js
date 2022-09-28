import { Component } from 'react'
import { SelectField, CircularProgress, FontIcon } from 'react-md'
// import { isEmpty } from 'lodash'
import { compose, graphql, withApollo } from 'react-apollo'

import { withTranslation } from 'libs/langs'
import allCountryStateCities from 'libs/queries/country-state-city/all-country.gql'
import statesByCountryID from 'libs/queries/country-state-city/states-by-id.gql'
import citiesByStateID from 'libs/queries/country-state-city/cities-by-id.gql'

import GQLCheck from 'libs/hocs/common-gql-check'

import './style.scss'

@withApollo
@compose(
  graphql(allCountryStateCities, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
        context: {
          uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
        },
      }
    },
    props: ({ data }) => {
      return { allCountryStateCities: data }
    },
  }),
  graphql(statesByCountryID, {
    options: ({ value }) => {
      return {
        notifyOnNetworkStatusChange: true,
        context: {
          uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
        },
        variables: {
          countryID: `${value.countryID}`,
        },
      }
    },
    skip: (props) => {
      return !props.value || !props.value.stateID
    },
    props: ({ data }) => {
      return { statesData: data }
    },
  }),
  graphql(citiesByStateID, {
    options: ({ value }) => {
      return {
        notifyOnNetworkStatusChange: true,
        context: {
          uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
        },
        variables: {
          stateID: `${value.stateID}`,
        },
      }
    },
    skip: (props) => {
      return !props.value || !props.value.cityID
    },
    props: ({ data }) => {
      return { citiesData: data }
    },
  }),
)
@GQLCheck({
  suffix: 'Country',
  endPointName: 'allCountryStateCities',
  queryName: 'allCountries',
})
@GQLCheck({
  suffix: 'State',
  endPointName: 'statesData',
  queryName: 'statesByCountryID',
})
@GQLCheck({
  suffix: 'City',
  endPointName: 'citiesData',
  queryName: 'citiesByStateID',
})
@withTranslation
export default class CountryStateCity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onSelect: () => null,
      currentCountry: null,
      currentArraysState: null,
      currentArraysCity: null,
      currentState: null,
      currentCity: null,
      updated: false,
      showSpinnerState: false,
      showSpinnerCity: false,
    }
  }

  static defaultProps = {
    countryRequired: false,
    cityRequired: false,
    stateRequired: false,
    countryDisabled: false,
    cityDisabled: false,
    stateDisable: false,
  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.value /* && !prevState.updated */) {
      return {
        currentCountry: `${nextProps.value.countryID}`,
        currentState: `${nextProps.value.stateID}`,
        currentCity: `${nextProps.value.cityID}`,
        updated: true,
      }
    }

    if (nextProps.updated) {
      return { updated: false }
    }
    return null
  }

  componentDidMount = () => {
    const { allCountryStateCities, value, client, setPhoneCode } = this.props
    if (value.countryID) {
      if (
        allCountryStateCities &&
        allCountryStateCities.allCountries &&
        allCountryStateCities.allCountries.countries
      ) {
        client
          .query({
            query: statesByCountryID,
            context: {
              uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
            },
            variables: {
              countryID: `${value.countryID}`,
            },
          })
          .then((item) => {
            if (item && item.data && item.data.statesByCountryID) {
              const newArrayOfState = item.data.statesByCountryID.map(
                (item) => {
                  return { label: item.name, value: `${item.id}` }
                },
              )
              this.setState({
                currentArraysState: newArrayOfState,
              })
            }
          })
        if (setPhoneCode) {
          const country = allCountryStateCities.allCountries.countries.find(
            (item) => item.id === value.countryID,
          )
          setPhoneCode(country ? country.phoneCode : '')
        }
      }
    }
  }
  renderCountry = () => {
    const { allCountryStateCities } = this.props
    let arrayName = []
    if (
      allCountryStateCities &&
      allCountryStateCities.allCountries &&
      allCountryStateCities.allCountries.countries
    ) {
      arrayName = allCountryStateCities.allCountries.countries.map((ac) => {
        return {
          label: ac.countryName,
          value: `${ac.id}`,
        }
      })
      return arrayName
    } else {
      this.setState({
        showSpinner: true,
      })
    }
  }

  renderState = (e) => {
    const { allCountryStateCities, client, onSelect, setPhoneCode } = this.props
    if (
      allCountryStateCities &&
      allCountryStateCities.allCountries &&
      allCountryStateCities.allCountries.countries
    ) {
      if (setPhoneCode) {
        const country = allCountryStateCities.allCountries.countries.find(
          (item) => item.id === e,
        )
        setPhoneCode(country ? country.phoneCode : '')
      }
      this.setState({ showSpinnerState: true })
      client
        .query({
          query: statesByCountryID,
          context: {
            uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
          },
          variables: {
            countryID: `${e}`,
          },
        })
        .then((item) => {
          if (item && item.data && item.data.statesByCountryID) {
            const newArrayOfState = item.data.statesByCountryID.map((item) => {
              return { label: item.name, value: `${item.id}` }
            })
            onSelect({ country: e, state: null, city: null })
            this.setState({
              currentArraysState: newArrayOfState,
              currentArraysCity: null,
              currentCountry: `${e}`,
              currentState: null,
              currentCity: null,
              showSpinnerState: false,
            })
          }
        })
    }
  }
  renderCity = (v) => {
    const { client, onSelect } = this.props
    const { currentCountry } = this.state
    this.setState({ showSpinnerCity: true })
    client
      .query({
        query: citiesByStateID,
        context: {
          uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
        },
        variables: {
          stateID: `${v}`,
        },
      })
      .then((item) => {
        if (item && item.data && item.data.citiesByStateID) {
          const newArrayOfState = item.data.citiesByStateID.map((item) => {
            return { label: item.cityName, value: `${item.id}` }
          })
          onSelect({ country: currentCountry, state: v, city: null })
          this.setState({
            currentArraysCity: newArrayOfState,
            currentState: `${v}`,
            currentCity: null,
            showSpinnerCity: false,
          })
        }
      })
  }
  renderCurrentCity = (v) => {
    const { onSelect, getCity } = this.props
    const {
      currentCountry,
      currentState,
      currentArraysCity,
      currentArraysState,
    } = this.state
    const findCountry =
      this.renderCountry().find((el) => el.value === currentCountry) || {}
    const findState =
      currentArraysState?.find((el) => el.value === currentState) || {}
    const findCity = currentArraysCity?.find((el) => el.value === v) || {}

    onSelect({
      country: `${currentCountry}`,
      state: `${currentState}`,
      city: `${v}`,
      address: `${findCity.label}, ${findState.label}, ${findCountry.label}`,
    })
    this.setState({
      currentCity: `${v}`,
    })
    getCity && getCity(findCity.label)
  }

  renderStateFromValue = () => {
    const { statesData } = this.props
    if (statesData && statesData.statesByCountryID) {
      const newArrayOfState = statesData.statesByCountryID.map((item) => {
        return { label: item.name, value: `${item.id}` }
      })
      return newArrayOfState
    } else {
      return null
    }
  }
  renderCitiesFromValue = () => {
    const { citiesData } = this.props
    if (citiesData && citiesData.citiesByStateID) {
      const newArrayOfState = citiesData.citiesByStateID.map((item) => {
        return { label: item.cityName, value: `${item.id}` }
      })
      return newArrayOfState
    } else {
      return []
    }
  }
  renderConditionForSelectField = (StateSpinner, HOCSpinner) => {
    return (
      (!StateSpinner && HOCSpinner === undefined) ||
      (!StateSpinner && HOCSpinner)
    )
  }
  render () {
    const {
      currentArraysState,
      currentCountry,
      currentArraysCity,
      currentState,
      currentCity,
      showSpinnerState,
      showSpinnerCity,
    } = this.state
    const {
      isGraphqlReadyCountry,
      isGraphqlReadyState,
      isGraphqlReadyCity,
      countryRequired,
      cityRequired,
      stateRequired,
      countryDisabled,
      stateDisabled,
      fieldClassName,
      sectionClassName,
      cityDisabled,
      t,
    } = this.props
    const isReadyCountry = isGraphqlReadyCountry()
    const isReadyState = isGraphqlReadyState()
    const isReadyCity = isGraphqlReadyCity()
    return (
      <>
        <div className={`${sectionClassName || ''}`}>
          <div className="spinnerCountry">
            {!isReadyCountry && <CircularProgress id="circular-progress-1" />}
            {isReadyCountry && (
              <SelectField
                id="select-field-with-elements"
                // label={t('country')}
                placeholder={countryDisabled ? '' : t('select_country')}
                menuItems={this.renderCountry()}
                value={currentCountry || ''}
                onChange={(event) => this.renderState(event)}
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
            )}
          </div>
        </div>
        <div className={`${sectionClassName || ''}`}>
          <div className="spinnerState">
            {!this.renderConditionForSelectField(
              showSpinnerState,
              isReadyState,
            ) && <CircularProgress id="circular-progress-2" />}
            {this.renderConditionForSelectField(
              showSpinnerState,
              isReadyState,
            ) && (
              <SelectField
                id="select-field-with-elements"
                // label={t('state')}
                placeholder={stateDisabled ? '' : t('select_state')}
                fullWidth
                menuItems={
                  currentArraysState || this.renderStateFromValue() || []
                }
                value={currentState || ''}
                onChange={(v) => this.renderCity(v)}
                disabled={stateDisabled}
                position={SelectField.Positions.BELOW}
                required={stateRequired}
                className={`${fieldClassName || ''}`}
                repositionOnResize
                repositionOnScroll
                dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
              />
            )}
          </div>
        </div>
        <div className="md-cell md-cell--4">
          <div className="spinnerCity">
            {!this.renderConditionForSelectField(
              showSpinnerCity,
              isReadyCity,
            ) && <CircularProgress id="circular-progress-3" />}
            {this.renderConditionForSelectField(
              showSpinnerCity,
              isReadyCity,
            ) && (
              <SelectField
                id="select-field-with-elements"
                // label={t('city')}
                position={SelectField.Positions.BELOW}
                placeholder={cityDisabled ? '' : t('select_city')}
                fullWidth
                menuItems={currentArraysCity || this.renderCitiesFromValue()}
                value={currentCity || ''}
                onChange={(v) => this.renderCurrentCity(v)}
                required={cityRequired}
                disabled={cityDisabled}
                className={`${fieldClassName || ''}`}
              />
            )}
          </div>
        </div>
      </>
    )
  }
}
