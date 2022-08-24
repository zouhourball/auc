import { useState } from 'react'
import { TextField, Button, SelectField, Checkbox, FontIcon } from 'react-md'
import { countriesCodes } from './helper'
import { navigate } from '@reach/router'

import UploadImages from 'components/upload-images'
import backgroundImage from './background_image.png'
import appleIcon from './apple_logo.svg'
import facebookIcon from './facebook.svg'
import googleIcon from './google.svg'
import dragIcon from './drag_drop.svg'

import './style.scss'

const RegistrationPage = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [signupData, setSignupData] = useState({})
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
  const setValues = (key, value) => {
    setSignupData((data) => ({ ...data, [key]: value }))
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
              menuItems={[]}
              value={countryId}
              onChange={(value) => setValues('councountryIdtry', value)}
              position={SelectField.Positions.BELOW}
              className="textField selectField"
            />
            <SelectField
              id={'country-code'}
              menuItems={countriesCodes}
              value={countryCode}
              onChange={(value) => setValues('countryCode', value)}
              position={SelectField.Positions.BELOW}
              className="textField selectField"
            />
            <TextField
              id={'phone'}
              placeholder="Enter phone number"
              value={phoneNum}
              onChange={(v) => setValues('phoneNum', v)}
              className="textField"
            />
            <TextField
              id={'email'}
              placeholder="Enter email"
              value={email}
              onChange={(v) => setValues('email', v)}
              className="textField"
            />
            <UploadImages
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
                value={countryCode}
                onChange={(value) => setValues('countryCode', value)}
                className="country-code"
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
  const signUp = () => {}
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
            <Button className="signUp-btn" onClick={() => signUp()}>
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
