import { countriesCodes } from 'components/registration/helper'
import { getCountry } from 'libs/api/auctions-api'
import { useCurrentLang, useTranslation } from 'libs/langs'
import { useEffect, useState } from 'react'
import { Button, SelectField, TextField } from 'react-md'
import { useInfiniteQuery } from 'react-query'

import { useMutation } from 'react-apollo'
import updateUserProfiles from 'libs/queries/update-profile.gql'
import updateCompany from 'libs/queries/update-organization.gql'
import { useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'
import ToastMsg from 'components/toast-msg'

import './style.scss'

const PersonalInformation = ({ company, userInfo, refetch }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()
  const dispatch = useDispatch()
  const [edit, setEdit] = useState(true)
  const [information, setInformation] = useState({
    ...userInfo,
    phoneMobile: userInfo?.phoneMobile?.replace(
      '+' + userInfo?.country?.phoneCode,
      '',
    ),
  })

  const [updateMutation] = useMutation(
    !company ? updateUserProfiles : updateCompany,
    {
      onCompleted: (res) => {
        if (res?.updateUserProfiles || res?.updateCompanies) {
          dispatch(
            addToast(
              <ToastMsg text={'Changes done successfully '} type="success" />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg text={'Changes has failed'} type="error" />,
              'hide',
            ),
          )
        }
        refetch()
      },
    },
  )

  useEffect(() => {
    setInformation({
      ...userInfo,
      phoneMobile: userInfo?.phoneMobile?.replace(
        '+' + userInfo?.country?.phoneCode,
        '',
      ),
    })
  }, [userInfo])
  const {
    data: getCountryList,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery([500, ''], getCountry, {
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (
        pages.length <=
        Math.ceil(+lastPage?.pagination?.total / +lastPage?.pagination?.limit)
      ) {
        return pages.length
      }
    },
  })
  const renderCountry = () => {
    let arrayName = []
    if (getCountryList) {
      arrayName = getCountryList?.pages
        ?.flatMap((el) => el?.results)
        ?.map((ac) => {
          return {
            label: lang === 'ar' ? ac?.['name_ar'] : ac?.['name_en'],
            value: `${ac?.['name_en']}`,
          }
        })
      return arrayName
    }
  }
  const ref = document.getElementsByClassName('country-list')
  const [test, setTest] = useState(0)
  useEffect(() => {
    ref[0] && ref[0].addEventListener('scroll', updateOffsetAndRefetch)

    return () =>
      ref[0] && ref[0].removeEventListener('scroll', updateOffsetAndRefetch)
  }, [test])

  const updateOffsetAndRefetch = () => {
    if (ref[0].scrollHeight - ref[0].scrollTop <= ref[0].clientHeight) {
      hasNextPage && fetchNextPage()
    }
  }
  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div className="personal-information-header md-cell md-cell--12">
        <h2>Personal Information</h2>
        <Button icon primary={!edit} onClick={() => setEdit((prev) => !prev)}>
          more_vert
        </Button>
      </div>

      {!company && (
        <div className="md-cell md-cell--6">
          <div className="label">First Name*</div>
          <TextField
            className="textField"
            disabled={edit}
            block
            placeholder={'Write here'}
            value={information?.firstName}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                firstName: v,
              }))
            }
          />
        </div>
      )}
      {!company && (
        <div className="md-cell md-cell--6">
          <div className="label">Last Name*</div>
          <TextField
            className="textField"
            disabled={edit}
            block
            placeholder={'Write here'}
            value={information?.lastName}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                lastName: v,
              }))
            }
          />
        </div>
      )}
      {company && (
        <div className="md-cell md-cell--6">
          <div className="label">Company Name*</div>
          <TextField
            className="textField"
            block
            disabled={edit}
            placeholder={'Write here'}
            value={information?.name}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                name: v,
              }))
            }
          />
        </div>
      )}
      <div className="md-cell md-cell--6">
        <div className="label">Email Address*</div>
        <TextField
          className="textField"
          block
          disabled={edit}
          id={'email'}
          placeholder={t('enter_email')}
          value={information?.email}
          onChange={(v) =>
            setInformation((prev) => ({
              ...prev,
              email: v,
            }))
          }
        />
      </div>
      <div className="md-cell md-cell--6">
        <div className="label">Phone Number*</div>
        <div style={{ display: 'flex' }}>
          <SelectField
            disabled={edit}
            id={'country-code'}
            menuItems={countriesCodes?.map((el) => ({
              value: el?.value,
              label: (
                <div
                  className="countries-dropdown"
                  onClick={() =>
                    setInformation((prev) => ({
                      ...prev,
                      country: {
                        ...prev?.country,
                        phoneCode: el?.value,
                      },
                    }))
                  }
                  key={el?.value}
                >
                  <img width={20} src={el?.flag} />
                  {el?.value}
                </div>
              ),
            }))}
            defaultValue={'+968'}
            value={
              information?.country?.phoneCode?.includes('+')
                ? information?.country?.phoneCode
                : '+' + information?.country?.phoneCode
            }
            //   onChange={(value) => setInformation('countryCode', value)}
            className="selectField country-code"
            // itemLabel="value"
            position={SelectField.Positions.BELOW}
          />
          <div className="sep"></div>
          <TextField
            className="phoneField"
            disabled={edit}
            id={'phone'}
            block
            placeholder={t('enter_phone_number')}
            value={information?.phoneMobile}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                phoneMobile: v,
              }))
            }
          />
        </div>
      </div>
      {company && (
        <div className="md-cell md-cell--6">
          <div className="label">Website URL*</div>
          <TextField
            className="textField"
            disabled={edit}
            block
            placeholder={'Write here'}
            value={information?.webSite}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                webSite: v,
              }))
            }
          />
        </div>
      )}
      <div className="md-cell md-cell--6">
        <div className="label">Country*</div>
        <SelectField
          disabled={edit}
          id={'country'}
          menuItems={renderCountry()}
          listClassName="country-list"
          value={information?.country?.countryName}
          onClick={() => setTest(1)}
          onChange={(v) =>
            setInformation((prev) => ({
              ...prev,
              country: {
                ...prev?.countryName,
                countryName: v,
                nationality: v,
              },
            }))
          }
          position={SelectField.Positions.BELOW}
          className="selectField country-code"
        />
      </div>
      {company && (
        <div className="md-cell md-cell--6">
          <div className="label">Address*</div>
          <TextField
            className="textField"
            disabled={edit}
            block
            placeholder={'Write here'}
            value={information?.city?.cityName}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                city: {
                  ...prev?.city,
                  cityName: v,
                },
              }))
            }
          />
        </div>
      )}
      {company && (
        <div className="md-cell md-cell--6">
          <div className="label">Company Description*</div>
          <TextField
            className="textField"
            rows={5}
            disabled={edit}
            block
            placeholder={'Write here'}
            value={information?.aboutUs}
            onChange={(v) =>
              setInformation((prev) => ({
                ...prev,
                aboutUs: v,
              }))
            }
          />
        </div>
      )}
      {!edit && (
        <div
          className="md-cell md-cell--12"
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button flat>Cancel</Button>
          <Button
            flat
            primary
            onClick={() => {
              let myObject = {}
              let keys = Object.keys(information) || []
              keys.forEach((el) => {
                if (el === 'phoneMobile') {
                  if (
                    el === 'phoneMobile' &&
                    information['country']?.phoneCode &&
                    information[el]
                  ) {
                    myObject['phoneMobile'] =
                      '+' +
                      information['country']?.phoneCode +
                      information['phoneMobile']
                  }
                } else if (information[el]) {
                  myObject[el] = information[el]
                  if (el === 'firstName' || el !== 'lastName') {
                    myObject['fullName'] =
                      information['firstName'] + ' ' + information['lastName']
                  }
                }
              })
              updateMutation({
                context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
                variables: {
                  input: {
                    ...myObject,
                    videoCv: null,
                  },
                },
              })
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default PersonalInformation
