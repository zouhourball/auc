import { countriesCodes } from 'components/registration/helper'
import { getCountry } from 'libs/api/auctions-api'
import { useCurrentLang, useTranslation } from 'libs/langs'
import { useEffect, useState } from 'react'
import { Button, SelectField, TextField, FontIcon } from 'react-md'
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
  const [information, setInformation] = useState({})

  const [updateMutation] = useMutation(
    !company ? updateUserProfiles : updateCompany,
    {
      onCompleted: (res) => {
        if (res?.updateUserProfiles || res?.updateCompanies) {
          dispatch(
            addToast(
              <ToastMsg text={'Changes done successfully '} type="success" />,
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res?.errors?.[0]?.message || 'Changes has failed'}
                type="error"
              />,
            ),
          )
        }
        refetch && refetch()
        setEdit(true)
      },
    },
  )

  useEffect(() => {
    const basicData = company
      ? {
        aboutUs: userInfo?.aboutUs,
        city: userInfo?.city,
        country: userInfo?.country,
        description: userInfo?.description,
        email: userInfo?.email,
        fullName: userInfo?.fullName,
        id: userInfo?.id,
        link: userInfo?.link,
        name: userInfo?.name,
        organisationID: userInfo?.organisationID,
        webSite: userInfo?.webSite,
      }
      : {
        aboutMe: userInfo?.aboutMe,
        email: userInfo?.email,
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
        country: userInfo?.country,
        subject: userInfo?.subject,
        userID: userInfo?.userID,
      }
    setInformation({
      ...basicData,
      phoneMobile: userInfo?.phoneMobile?.substr(
        userInfo?.phoneMobile?.length - 8,
        8,
      ),
      // phoneMobile: userInfo?.phoneMobile?.replace(
      //   '+' + userInfo?.country?.phoneCode,
      //   '',
      // ),
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
            value: `${ac?.['id']}`,
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
  // console.log(information, 'information')
  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div className="personal-information-header md-cell md-cell--12">
        <h2>
          {company ? t('company_information') : t('personal_information')}
        </h2>
        <Button icon primary={!edit} onClick={() => setEdit((prev) => !prev)}>
          more_vert
        </Button>
      </div>

      {!company && (
        <div className="md-cell md-cell--6">
          <div className="label">{t('first_name')}*</div>
          <TextField
            className={`textField ${edit ? 'disabled' : 'active'}`}
            disabled={edit}
            block
            placeholder={t('write_here')}
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
          <div className="label">{t('last_name')}*</div>
          <TextField
            className={`textField ${edit ? 'disabled' : 'active'}`}
            disabled={edit}
            block
            placeholder={t('write_here')}
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
          <div className="label">{t('company_name')}*</div>
          <TextField
            className={`textField ${edit ? 'disabled' : 'active'}`}
            block
            disabled={edit}
            placeholder={t('write_here')}
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
        <div className="label">{t('email_address')}*</div>
        <TextField
          className={`textField 'disabled'`}
          block
          disabled
          // disabled={edit}
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
        <div className="label">{t('phone_number')}*</div>
        <div
          className={`selectField ${edit ? 'disabled' : 'active'}`}
          style={{ display: 'flex' }}
        >
          <SelectField
            disabled={edit}
            id={'country-code'}
            dropdownIcon={<FontIcon primary>expand_more</FontIcon>}
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
                  <img
                    width={'24px'}
                    height="16px"
                    src={el?.flag}
                    className="flag"
                  />
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
            className="country-code"
            // itemLabel="value"
            position={SelectField.Positions.BELOW}
          />
          <div className="sep"></div>
          <TextField
            className="phoneField"
            disabled
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
          <div className="label">{t('website_url')}*</div>
          <TextField
            className={`textField ${edit ? 'disabled' : 'active'}`}
            disabled={edit}
            block
            placeholder={t('write_here')}
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
        <div className="label">{t('country')}</div>
        <SelectField
          disabled={edit}
          id={'country'}
          dropdownIcon={<FontIcon primary>expand_more</FontIcon>}
          menuItems={renderCountry()}
          listClassName="country-list"
          value={information?.country?.id}
          onClick={() => setTest(1)}
          onChange={(v) =>
            setInformation((prev) => ({
              ...prev,
              country: {
                ...prev?.country,
                id: v,
              },
            }))
          }
          position={SelectField.Positions.BELOW}
          className={`selectField country ${edit ? 'disabled' : 'active'}`}
        />
      </div>
      {company && (
        <div className="md-cell md-cell--6">
          <div className="label">{t('address')}</div>
          <TextField
            className={`textField ${edit ? 'disabled' : 'active'}`}
            disabled={edit}
            block
            placeholder={t('write_here')}
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
          <div className="label">{t('Company_Description')}*</div>
          <TextField
            className={`textField ${edit ? 'disabled' : 'active'}`}
            rows={5}
            disabled={edit}
            block
            placeholder={t('write_here')}
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
        <div className="personal-information-footer md-cell md-cell--12">
          <Button className="cancel-btn" flat onClick={() => setEdit(true)}>
            {t('cancel')}
          </Button>
          <Button
            flat
            primary
            className="save-btn"
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
                    myObject['phoneMobile'] = information[
                      'country'
                    ]?.phoneCode?.includes('+')
                      ? information['country']?.phoneCode +
                        information['phoneMobile']
                      : '+' +
                        information['country']?.phoneCode +
                        information['phoneMobile']
                  }
                } else if (el === 'country') {
                  myObject['countryID'] = information['country']?.id
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
            {t('save')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PersonalInformation
