import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  SelectField,
  Checkbox,
  FontIcon,
  CircularProgress,
} from 'react-md'
import { countriesCodes } from './helper'
import { navigate } from '@reach/router'
import {
  getCountry,
  // getCity,
  registerBidder,
  genUploadToken,
  registerBroker,
  // filePersistence,
} from 'libs/api/auctions-api'
import {
  useChangeLanguage,
  useCurrentLang,
  useSupportedLangs,
  useTranslation,
} from 'libs/langs'
import { useInfiniteQuery, useMutation, useQuery } from 'react-query'

import backgroundImage from './background_image.png'
// import appleIcon from './apple_logo.svg'
// import facebookIcon from './facebook.svg'
// import googleIcon from './google.svg'
import dragIcon from './drag_drop.svg'
import successRegister from 'images/successfully-register.png'

import UploadImages from 'components/upload-images'
import ConfirmDialog from 'components/confirm-dialog'

import './style.scss'
import CustomSelectWithSearch from 'components/custom-select-with-search'

const RegistrationPage = () => {
  const { t } = useTranslation()
  const langs = useSupportedLangs()
  const changeLang = useChangeLanguage()
  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}

  const [currentTab, setCurrentTab] = useState(0)
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false)
  const [textSearch, setTextSearch] = useState('')
  const [showListCountry, handleShowListCountry] = useState('')

  const [signupData, setSignupData] = useState({
    countryCode: '+968',
    acceptTerms: false,
  })
  const {
    fullName,
    email,
    countryCode,
    phoneNum,
    password,
    acceptTerms,
    companyName,
    countryId,
    logo,
    address,
  } = signupData
  const lang = useCurrentLang()

  const getActiveLabel = ({ activeLabel }) => {
    if (activeLabel === 'اللغة العربية') {
      return 'عربي'
    } else {
      return activeLabel.slice(0, 3)
    }
  }
  const { mutate: registerBidderMutation, isLoading } = useMutation(
    registerBidder,
    {
      onSuccess: (res) => {
        if (res?.success) {
          setConfirmDialogVisible(true)
        } else {
          setConfirmDialogVisible({ error: res?.error })
        }
      },
    },
  )

  // const { mutate: filePersistenceMutation } = useMutation(filePersistence, {
  // onSuccess: (res) => {
  //   if (!res.error) {
  //     setConfirmDialogVisible(true)
  //   } else {
  //     setConfirmDialogVisible({ error: res?.msg })
  //   }
  // },
  // })
  const { mutate: registerBrokerMutation, isLoading: loading } = useMutation(
    registerBroker,
    {
      onSuccess: (res) => {
        if (!res.error) {
          setConfirmDialogVisible(true)
        } else {
          setConfirmDialogVisible({ error: res?.msg })
        }
      },
    },
  )
  const register = () => {
    registerBrokerMutation({
      body: {
        email: email,
        password: password,
        companyName: companyName,
        contactPerson: companyName,
        phoneNumber: `${countryCode}${phoneNum}`,
        country: countryId,
        companyLogo: {
          fileName: logo[0]?.options?.metadata?.filename,
          apiId: logo[0]?.url,
          apiUrl: logo[0]?.url,
        },
        terms_of_service: acceptTerms,
      },
    })
  }

  const { data: uploadToken } = useQuery(
    ['genUploadToken', 'upload'],
    genUploadToken,
  )

  const { data: downloadToken } = useQuery(
    ['genUploadToken', 'download'],
    genUploadToken,
  )

  const setValues = (key, value) => {
    setSignupData((data) => ({ ...data, [key]: value }))
  }
  const {
    data: getCountryList,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery([25, textSearch], getCountry, {
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
  const [test] = useState(0)

  const ref = document.getElementsByClassName('country-list')
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
  const renderView = () => {
    switch (currentTab) {
      case 1:
        return (
          <>
            <TextField
              id={'company-name'}
              placeholder={t('enter_company_name')}
              value={companyName}
              onChange={(v) => setValues('companyName', v)}
              className="textField"
            />
            <CustomSelectWithSearch
              items={renderCountry()}
              label={t('country')}
              hideSecondaryLabel={false}
              listVisibility={showListCountry}
              setListVisibility={handleShowListCountry}
              selectedItem={
                renderCountry()?.find((el) => el?.value === countryId)?.label ||
                ''
              }
              searchPlaceholder={t('country')}
              onClickItem={(itemSelected) => {
                setValues('countryId', itemSelected?.value)
                setTextSearch('')
              }}
              hideAvatar={true}
              withHeader={true}
              searchItem={textSearch}
              setSearchItem={setTextSearch}
              searchItemPlaceHolder={t('search_country')}
              singleSelect
              className="selectField-withShadow"
            />
            {/* <SelectField
              id={'country'}
              menuItems={renderCountry()}
              listClassName="country-list"
              placeholder={t('choose_country')}
              value={countryId}
              onClick={() => setTest(1)}
              onChange={(value) => setValues('countryId', value)}
              position={SelectField.Positions.BELOW}
              className={'textField selectField'}
            /> */}
            <div className="textField phone-field">
              <SelectField
                id={'country-code'}
                menuItems={countriesCodes?.map((el) => ({
                  value: el?.value,
                  label: (
                    <div
                      className="countries-dropdown"
                      onClick={() => setValues('countryCode', el?.value)}
                      key={el?.value}
                    >
                      <img width={20} src={el?.flag} />
                      {el?.value}
                    </div>
                  ),
                }))}
                defaultValue={'+968'}
                value={countryCode}
                onChange={(value) => setValues('countryCode', value)}
                className="country-code"
                // itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder={t('enter_phone_number')}
                value={phoneNum}
                onChange={(v) => setValues('phoneNum', v)}
                className="phone-number"
              />
            </div>
            <TextField
              id={'address'}
              placeholder={t('enter_address')}
              value={address}
              onChange={(v) => setValues('address', v)}
              className="textField"
            />
            <TextField
              id={'email'}
              placeholder={t('enter_email')}
              value={email}
              onChange={(v) => setValues('email', v)}
              className="textField"
            />
            <TextField
              id={'pw'}
              type="password"
              placeholder={t('enter_password')}
              value={password}
              onChange={(v) => setValues('password', v)}
              className="textField"
            />
            <div className="company-logo-title">
              <h3>{t('company_logo')}</h3>
            </div>
            <UploadImages
              publicToken={uploadToken?.token}
              publicDownloadToken={downloadToken?.token}
              title={
                <>
                  <span className="drop-zone-placeholder grey-text font-size-bg">
                    {t('drop')}
                    <span className="blue-text font-size-bg">
                      <b>{'select_file'}</b>
                    </span>
                  </span>
                </>
              }
              setListFiles={(files) => {
                // filePersistenceMutation({
                //   id: files[0]?.id,
                // })
                setValues('logo', files)
              }}
              onRemoveFile={() => setValues('logo', [])}
              listFiles={logo}
              iconDelete={true}
              titleContent={' '}
              icon={<img src={dragIcon} />}
              accept="image/jpeg, image/png, image/jpg, img/svg"
              className="custom"
            />
          </>
        )
      default:
        return (
          <>
            <TextField
              id={'full-name'}
              placeholder={t('enter_full_name')}
              value={fullName}
              onChange={(v) => setValues('fullName', v)}
              className="textField"
            />
            <TextField
              id={'email'}
              placeholder={t('enter_email')}
              value={email}
              onChange={(v) => setValues('email', v)}
              className="textField"
            />
            <div className="textField phone-field">
              <SelectField
                id={'country-code'}
                menuItems={countriesCodes?.map((el) => ({
                  value: el?.value,
                  label: (
                    <div
                      className="countries-dropdown"
                      onClick={() => setValues('countryCode', el?.value)}
                      key={el?.value}
                    >
                      <img width={20} src={el?.flag} />
                      {el?.value}
                    </div>
                  ),
                }))}
                defaultValue={'+968'}
                value={countryCode}
                onChange={(value) => setValues('countryCode', value)}
                className="country-code"
                // itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder={t('enter_phone_number')}
                value={phoneNum}
                onChange={(v) => setValues('phoneNum', v)}
                className="phone-number"
              />
            </div>
            <TextField
              id={'email'}
              type="password"
              placeholder={t('enter_password')}
              value={password}
              onChange={(v) => setValues('password', v)}
              className="textField"
            />
          </>
        )
    }
  }

  const signUp = () => {
    registerBidderMutation({
      body: {
        email: signupData?.email,
        mobile: `${signupData?.countryCode}${signupData?.phoneNum}`,
        password: signupData?.password,
        username: signupData?.fullName,
        notified_method: 'email',
        is_verified_code: false,
        terms_of_service: signupData?.acceptTerms,
      },
    })
  }
  return (
    <div className="registration-page">
      {confirmDialogVisible && (
        <ConfirmDialog
          title={t('Successfully_Registered')}
          description={t('you_can')}
          visible={confirmDialogVisible}
          msg={confirmDialogVisible?.error}
          imgCard={successRegister}
          onHide={() => {
            setConfirmDialogVisible(false)
          }}
        />
      )}
      <div className="registration-page-left">
        <div>
          <img className="background" src={backgroundImage} />
        </div>
      </div>
      <div>
        <div className="select-language-field">
          <span className="select-language-field-label">
            {t('choose_language')}
          </span>
          <SelectField
            id="select-field-3-1"
            menuItems={langs.map(({ key, label }) => {
              if (key === 'ar') {
                return {
                  label: 'اللغة العربية',
                  value: key,
                }
              }
              return {
                label: label,
                value: key,
              }
            })}
            getActiveLabel={getActiveLabel}
            simplifiedMenu={false}
            onChange={(v) => {
              // location.reload()
              changeLang(v)
            }}
            position={SelectField.Positions.BELOW}
            value={currentLang.key || 'en-US'}
            className="langSelector"
            dropdownIcon={<FontIcon>expand_more</FontIcon>}
          />
        </div>
        <div className="registration-page-right">
          <div className="registration-page-right-title">
            {t('new_to_auctions')}
          </div>
          <div className="registration-page-right-subtitle">
            {t('sign_up_to_view')}
          </div>
          <div className="body">
            <div className="tabs">
              <span
                onClick={() => setCurrentTab(0)}
                className={`item ${currentTab === 0 ? 'active' : ''}`}
              >
                {t('bidders')}
              </span>
              <div className="sep"></div>
              <span
                onClick={() => setCurrentTab(1)}
                className={`item ${currentTab === 1 ? 'active' : ''}`}
              >
                {t('brokers')}
              </span>
            </div>
            <div className="view">
              {renderView()}
              <div className="terms-checkbox">
                <Checkbox
                  id={'accept-terms'}
                  checked={acceptTerms}
                  onChange={(v) => setValues('acceptTerms', v)}
                  checkedIcon={<FontIcon className="checked">check</FontIcon>}
                  uncheckedIcon={
                    <FontIcon className="unchecked">
                      check_box_outline_blank
                    </FontIcon>
                  }
                />
                <div>
                  {t('i_accept')}{' '}
                  <span className="blue-text">{t('Terms_&_Conditions')}</span>{' '}
                  {t('and')}
                  <span className="blue-text"> {t('privacy_policy')}</span>
                </div>
              </div>
              <Button
                className="signUp-btn"
                onClick={() => (currentTab === 1 ? register() : signUp())}
                disabled={!acceptTerms}
              >
                {isLoading || loading ? <CircularProgress /> : t('sign_up')}
              </Button>
              <div className="grey-text font-size-bg">
                {t('continue_as_a')}{' '}
                <span
                  className="blue-text  font-size-bg"
                  onClick={() => navigate('/public/home')}
                >
                  {t('guest')}
                </span>
              </div>
              {/* <div className="social-container">
              <img
                className="social-container-icon"
                onClick={() => window.open('https://www.facebook.com/')}
                src={facebookIcon}
              />
              <img
                className="social-container-icon"
                onClick={() => window.open('https://www.facebook.com/')}
                src={appleIcon}
              />
              <img
                className="social-container-icon"
                onClick={() => window.open('https://www.facebook.com/')}
                src={googleIcon}
              />
            </div> */}
              <div className="grey-text font-size-bg">
                {t('Don_t_have')}{' '}
                <span
                  className="blue-text font-size-bg"
                  onClick={() => navigate('/auctions/home')}
                >
                  {t('log_in')}
                </span>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegistrationPage
