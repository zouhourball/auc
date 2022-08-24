import { useState } from 'react'
import { TextField, Button, SelectField, Checkbox, FontIcon } from 'react-md'
import { countriesCodes } from './helper'
import { navigate } from '@reach/router'

import UploadImages from 'components/upload-images'

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
            />
            <SelectField
              id={'country'}
              menuItems={[]}
              value={countryId}
              onChange={(value) => setValues('councountryIdtry', value)}
            />
            <SelectField
              id={'country-code'}
              menuItems={countriesCodes}
              value={countryCode}
              onChange={(value) => setValues('countryCode', value)}
            />
            <TextField
              id={'phone'}
              placeholder="Enter phone number"
              value={phoneNum}
              onChange={(v) => setValues('phoneNum', v)}
            />
            <TextField
              id={'email'}
              placeholder="Enter email"
              value={email}
              onChange={(v) => setValues('email', v)}
            />
            <UploadImages
              title={
                <>
                  <span className="drop-zone-placeholder">
                    {'drag_and_drop'}
                    <b>{'select_file'}</b>
                  </span>
                </>
              }
              setListFiles={(files) => setValues('logo', files)}
              onRemoveFile={() => setValues('logo', [])}
              listFiles={logo}
              iconDelete={true}
              titleContent={' '}
              icon={<FontIcon>add_photo_alternate</FontIcon>}
              accept="image/jpeg, image/png, image/jpg"
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
            />
            <TextField
              id={'email'}
              placeholder="Enter email"
              value={email}
              onChange={(v) => setValues('email', v)}
            />

            <SelectField
              id={'country-code'}
              menuItems={countriesCodes}
              value={countryCode}
              onChange={(value) => {
                setValues('countryCode', value)
                // console.log(value, 'valuue')
              }}
              // getActiveLabel={(item) =>
              //   console.log(item?.activeItem, 'valuuuue')
              // }
              placeholder={'Country Code'}
              // itemProps={'flag'}
            />

            <TextField
              id={'phone'}
              placeholder="Enter phone number"
              value={phoneNum}
              onChange={(v) => setValues('phoneNum', v)}
            />
            <TextField
              id={'email'}
              placeholder="Enter password"
              value={password}
              onChange={(v) => setValues('password', v)}
            />
          </>
        )
    }
  }
  const signUp = () => {}
  return (
    <div>
      <div>image container</div>
      <div>
        <h1>Welcome to ZEED</h1>
        <span>Login to view listed properties</span>
        <div className="header">
          <span
            onClick={() => setCurrentTab(0)}
            className={`${currentTab === 0 ? 'active' : ''}`}
          >
            Bidders
          </span>
          |
          <span
            onClick={() => setCurrentTab(1)}
            className={`${currentTab === 1 ? 'active' : ''}`}
          >
            Brokers
          </span>
          <div className="view">
            {renderView()}
            <Checkbox
              id={'accept-terms'}
              checked={acceptTerms}
              onChange={(v) => setValues('acceptTerms', v)}
              className="md-cell md-cell--3"
              label={'I accept Terms & Conditions and Privacy Policy'}
            />
            <Button onClick={() => signUp()}>Sign Up</Button>
            <div>
              Continue as a{' '}
              <span onClick={() => navigate('/public/home')}>Guest</span>
            </div>
            <div>
              <img
                onClick={() => window.open('https://www.facebook.com/')}
                src="https://picsum.photos/50"
              />
              <img
                onClick={() => window.open('https://www.facebook.com/')}
                src="https://picsum.photos/50"
              />
              <img
                onClick={() => window.open('https://www.facebook.com/')}
                src="https://picsum.photos/50"
              />
            </div>
            <div>Don t have an account? Log In</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegistrationPage
