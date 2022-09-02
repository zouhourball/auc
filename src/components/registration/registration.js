import { useState, useEffect } from 'react'
import { TextField, Button, SelectField, Checkbox, FontIcon } from 'react-md'
import { countriesCodes } from './helper'
import { navigate } from '@reach/router'
import {
  getCountry,
  // getCity,
  registerBidder,
  genUploadToken,
  registerBroker,
} from 'libs/api/auctions-api'
import { useCurrentLang } from 'libs/langs'
import { useInfiniteQuery, useMutation, useQuery } from 'react-query'

import backgroundImage from './background_image.png'
import appleIcon from './apple_logo.svg'
import facebookIcon from './facebook.svg'
import googleIcon from './google.svg'
import dragIcon from './drag_drop.svg'

import './style.scss'
import UploadImages from 'components/upload-images'

const RegistrationPage = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [signupData, setSignupData] = useState({ countryCode: '+968' })
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
  } = signupData
  const lang = useCurrentLang()
  const registerBidderMutation = useMutation(registerBidder, {
    onSuccess: (res) => {
      if (res?.statusText === 'OK') navigate('/public/home')
    },
  })

  const registerBrokerMutation = useMutation(registerBroker, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/public/home')
      }
    },
  })

  const register = () => {
    registerBrokerMutation.mutate({
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
  const renderView = () => {
    switch (currentTab) {
      case 1:
        return (
          <>
            <TextField
              id={'company-name'}
              placeholder="Enter company name"
              value={companyName}
              onChange={(v) => setValues('companyName', v)}
              className="textField"
            />
            <SelectField
              id={'country'}
              menuItems={renderCountry()}
              listClassName="country-list"
              value={countryId}
              onClick={() => setTest(1)}
              onChange={(value) => setValues('countryId', value)}
              position={SelectField.Positions.BELOW}
              className="textField selectField"
              placeholder="Choose Country"
            />

            <div className="textField phone-field">
              <SelectField
                id={'country-code'}
                menuItems={countriesCodes}
                defaultValue={'+968'}
                value={countryCode}
                onChange={(value) => setValues('countryCode', value)}
                className="country-code"
                itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder="Enter phone number"
                value={phoneNum}
                onChange={(v) => setValues('phoneNum', v)}
                className="phone-number"
              />
            </div>
            <TextField
              id={'email'}
              placeholder="Enter email"
              value={email}
              onChange={(v) => setValues('email', v)}
              className="textField"
            />
            <TextField
              id={'email'}
              placeholder="Enter password"
              value={password}
              onChange={(v) => setValues('password', v)}
              className="textField"
            />
            <UploadImages
              publicToken={uploadToken?.token}
              publicDownloadToken={downloadToken?.token}
              title={
                <>
                  <span className="drop-zone-placeholder grey-text font-size-bg">
                    {'Drop your logo here, or '}
                    <span className="blue-text font-size-bg">
                      <b>{'select_file'}</b>
                    </span>
                  </span>
                </>
              }
              setListFiles={(files) => setValues('logo', files)}
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
              placeholder="Enter full name"
              value={fullName}
              onChange={(v) => setValues('fullName', v)}
              className="textField"
            />
            <TextField
              id={'email'}
              placeholder="Enter email"
              value={email}
              onChange={(v) => setValues('email', v)}
              className="textField"
            />
            <div className="textField phone-field">
              <SelectField
                id={'country-code'}
                menuItems={countriesCodes}
                defaultValue={'+968'}
                value={countryCode}
                onChange={(value) => setValues('countryCode', value)}
                className="country-code"
                itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder="Enter phone number"
                value={phoneNum}
                onChange={(v) => setValues('phoneNum', v)}
                className="phone-number"
              />
            </div>
            <TextField
              id={'email'}
              placeholder="Enter password"
              value={password}
              onChange={(v) => setValues('password', v)}
              className="textField"
            />
          </>
        )
    }
  }
  const signUp = () => {
    registerBidderMutation.mutate({
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
      <div className="registration-page-left">
        <img className="background" src={backgroundImage} />
      </div>
      <div className="registration-page-right">
        <div className="registration-page-right-title">Welcome to ZEED</div>
        <div className="registration-page-right-subtitle">
          Login to view listed properties
        </div>
        <div className="body">
          <div className="tabs">
            <span
              onClick={() => setCurrentTab(0)}
              className={`item ${currentTab === 0 ? 'active' : ''}`}
            >
              Bidders
            </span>
            <div className="sep"></div>
            <span
              onClick={() => setCurrentTab(1)}
              className={`item ${currentTab === 1 ? 'active' : ''}`}
            >
              Brokers
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
                I accept <span className="blue-text">Terms & Conditions</span>{' '}
                and
                <span className="blue-text"> Privacy Policy</span>
              </div>
            </div>
            <Button
              className="signUp-btn"
              onClick={() => (currentTab === 1 ? register() : signUp())}
            >
              Sign Up
            </Button>
            <div className="grey-text font-size-bg">
              Continue as a{' '}
              <span
                className="blue-text  font-size-bg"
                onClick={() => navigate('/public/home')}
              >
                Guest
              </span>
            </div>
            <div className="social-container">
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
            </div>
            <div className="grey-text font-size-bg">
              Don t have an account?{' '}
              <span className="blue-text font-size-bg">Log In</span>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegistrationPage
