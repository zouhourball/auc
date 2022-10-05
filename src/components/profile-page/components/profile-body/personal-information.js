import { countriesCodes } from 'components/registration/helper'
import { getCountry } from 'libs/api/auctions-api'
import { useCurrentLang, useTranslation } from 'libs/langs'
import { useEffect, useState } from 'react'
import { Button, SelectField, TextField } from 'react-md'
import { useInfiniteQuery } from 'react-query'
import './style.scss'

const PersonalInformation = ({ company }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()

  const [edit, setEdit] = useState(true)
  const [informations, setInformations] = useState({
    firstName: 'Ahmed',
    lastName: 'Mohammed',
    email: 'ahmed@gmail.com',
    phoneNumber: '9817281',
    countryCode: '968',
    country: '',
  })
  const {
    data: getCountryList,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery([25], getCountry, {
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
            label: lang === 'ar' ? ac.name_ar : ac.name_en,
            value: `${ac.id}`,
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
            value={informations?.firstName}
            onChange={(v) =>
              setInformations((prev) => ({
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
            value={informations?.lastName}
            onChange={(v) =>
              setInformations((prev) => ({
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
            value={informations?.companyName}
            onChange={(v) =>
              setInformations((prev) => ({
                ...prev,
                companyName: v,
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
          value={informations?.email}
          onChange={(v) =>
            setInformations((prev) => ({
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
                    setInformations((prev) => ({
                      ...prev,
                      countryCode: el?.value,
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
            value={informations?.countryCode}
            //   onChange={(value) => setInformations('countryCode', value)}
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
            value={informations?.phoneNumber}
            onChange={(v) =>
              setInformations((prev) => ({
                ...prev,
                phoneNumber: v,
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
            value={informations?.websiteURL}
            onChange={(v) =>
              setInformations((prev) => ({
                ...prev,
                websiteURL: v,
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
          value={informations?.country}
          onClick={() => setTest(1)}
          onChange={(v) =>
            setInformations((prev) => ({
              ...prev,
              country: v,
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
            value={informations?.address}
            onChange={(v) =>
              setInformations((prev) => ({
                ...prev,
                address: v,
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
            value={informations?.description}
            onChange={(v) =>
              setInformations((prev) => ({
                ...prev,
                description: v,
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
          <Button flat primary>
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default PersonalInformation
