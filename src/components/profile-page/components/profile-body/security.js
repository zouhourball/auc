import { useState } from 'react'
import {
  Button,
  Checkbox,
  DialogContainer,
  SelectField,
  TextField,
} from 'react-md'

import { useTranslation } from 'libs/langs'
import OtpInput from 'react-otp-input'
import avatar from '../profile-menu/avatar.jpg'
import { countriesCodes } from 'components/registration/helper'

const Security = () => {
  const { t } = useTranslation()

  const [dialogType, setDialogType] = useState('')
  const [informations, setInformations] = useState({
    email: 'ah****@gmail.com',
    password: '********',
    phoneNumber: '+968 9*****81',
  })

  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div
        className="md-cell md-cell--12"
        style={{
          borderBottom: '1px solid gray',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2>Security</h2>
      </div>

      <div className="md-cell md-cell--6">
        <b>Email*</b>
        <span>
          <Button primary onClick={() => setDialogType('email')}>
            Change
          </Button>
        </span>
        <TextField
          disabled
          placeholder={t('enter_email')}
          value={informations?.email}
          onChange={(v) =>
            setInformations((prev) => ({
              ...informations,
              email: v,
            }))
          }
        />
      </div>
      <div className="md-cell md-cell--6">
        <b>Password*</b>
        <span>
          <Button primary onClick={() => setDialogType('password')}>
            Change
          </Button>
        </span>
        <TextField
          disabled
          placeholder={t('enter_email')}
          value={informations?.password}
          onChange={(v) =>
            setInformations((prev) => ({
              ...informations,
              password: v,
            }))
          }
        />
        <Button primary onClick={() => setDialogType('forgot')}>
          Forgot Password?
        </Button>
      </div>
      <div className="md-cell md-cell--6">
        <b>Phone Number*</b>
        <span>
          <Button primary onClick={() => setDialogType('phone')}>
            Change
          </Button>
        </span>
        <TextField
          disabled
          id={'phone'}
          placeholder={t('enter_phone_number')}
          value={informations?.phoneNumber}
          onChange={(v) =>
            setInformations((prev) => ({
              ...informations,
              phoneNumber: v,
            }))
          }
        />
      </div>
      {dialogType === 'email' && (
        <ChangeEmailDialog
          visible={dialogType === 'email'}
          onHide={() => setDialogType('')}
        />
      )}
      {dialogType === 'phone' && (
        <ChangeNumberDialog
          visible={dialogType === 'phone'}
          onHide={() => setDialogType('')}
        />
      )}
      {dialogType === 'password' && (
        <ChangePasswordDialog
          visible={dialogType === 'password'}
          onHide={() => setDialogType('')}
        />
      )}
      {dialogType === 'forgot' && (
        <ForgotPasswordDialog
          visible={dialogType === 'forgot'}
          onHide={() => setDialogType('')}
        />
      )}
    </div>
  )
}

export default Security

const ChangeEmailDialog = ({ visible, onHide }) => {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState(0)
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>Change Email</h2>}
        {step < 2 && (
          <>
            <b>Current Email</b>
            <TextField placeholder="Enter new email" />
          </>
        )}
        {step === 1 && (
          <>
            <b>New Email</b>
            <TextField placeholder="Enter current email" />
          </>
        )}
        {step === 2 && (
          <>
            <b>{'An OTP has been sent to "Mohammed@gmail.com"'}</b>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              separator={<span>-</span>}
            />
            <b>{"Didn't receive a code?"}</b>
            <span>
              <Button primary>Resend</Button>
            </span>
          </>
        )}
        {step === 3 && (
          <>
            <img
              src={avatar}
              width={100}
              height={100}
              style={{ borderRadius: 100 }}
            />
            <h2>Phone Number Changed</h2>
            <b>Your phone number has been changed successfully</b>
            <br />
            <Button primary onClick={onHide}>
              Done
            </Button>
          </>
        )}
        <br />
        {step < 2 && (
          <span>
            <Button onClick={onHide}>Cancel</Button>
          </span>
        )}
        {step === 2 && (
          <span>
            <Button onClick={() => setStep((prev) => prev - 1)}>Back</Button>
          </span>
        )}
        {step < 2 && (
          <span>
            <Button primary onClick={() => setStep((prev) => prev + 1)}>
              Next
            </Button>
          </span>
        )}
        {step === 2 && (
          <span>
            <Button primary onClick={() => setStep((prev) => prev + 1)}>
              Confirm
            </Button>
          </span>
        )}
      </div>
    </DialogContainer>
  )
}

const ChangeNumberDialog = ({ visible, onHide }) => {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState(0)
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>Change Phone Number</h2>}
        {step < 2 && (
          <>
            <b>Current Phone Number</b>
            <div style={{ display: 'flex' }}>
              <SelectField
                id={'country-code'}
                menuItems={countriesCodes?.map((el) => ({
                  value: el?.value,
                  label: (
                    <div
                      className="countries-dropdown"
                      //   onClick={() => setInformations(prev => ({
                      //     ...informations,
                      //     countryCode: el?.value,
                      //   }))}
                      key={el?.value}
                    >
                      <img width={20} src={el?.flag} />
                      {el?.value}
                    </div>
                  ),
                }))}
                defaultValue={'+968'}
                // value={informations?.countryCode}
                //   onChange={(value) => setInformations('countryCode', value)}
                className="country-code"
                // itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder="Current Phone Number"
                // value={informations?.phoneNumber}
                // onChange={(v) => setInformations(prev => ({
                //   ...informations,
                //   phoneNumber: v,
                // }))}
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <b>New Email</b>
            <div style={{ display: 'flex' }}>
              <SelectField
                id={'country-code'}
                menuItems={countriesCodes?.map((el) => ({
                  value: el?.value,
                  label: (
                    <div
                      className="countries-dropdown"
                      // onClick={() => setInformations(prev => ({
                      //   ...informations,
                      //   countryCode: el?.value,
                      // }))}
                      key={el?.value}
                    >
                      <img width={20} src={el?.flag} />
                      {el?.value}
                    </div>
                  ),
                }))}
                defaultValue={'+968'}
                //   value={informations?.countryCode}
                //   onChange={(value) => setInformations('countryCode', value)}
                className="country-code"
                // itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder="New Phone Number"
                //   value={informations?.phoneNumber}
                //   onChange={(v) => setInformations(prev => ({
                //     ...informations,
                //     phoneNumber: v,
                //   }))}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <b>{'An OTP has been sent to "+968 827859285"'}</b>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              separator={<span>-</span>}
            />
            <b>{"Didn't receive a code?"}</b>
            <span>
              <Button primary>Resend</Button>
            </span>
          </>
        )}
        {step === 3 && (
          <>
            <img
              src={avatar}
              width={100}
              height={100}
              style={{ borderRadius: 100 }}
            />
            <h2>Email Changed</h2>
            <b>Your email has been changed successfully</b>
            <br />
            <Button primary onClick={onHide}>
              Done
            </Button>
          </>
        )}
        <br />
        {step < 2 && (
          <span>
            <Button onClick={onHide}>Cancel</Button>
          </span>
        )}
        {step === 2 && (
          <span>
            <Button onClick={() => setStep((prev) => prev - 1)}>Back</Button>
          </span>
        )}
        {step < 2 && (
          <span>
            <Button primary onClick={() => setStep((prev) => prev + 1)}>
              Next
            </Button>
          </span>
        )}
        {step === 2 && (
          <span>
            <Button primary onClick={() => setStep((prev) => prev + 1)}>
              Confirm
            </Button>
          </span>
        )}
      </div>
    </DialogContainer>
  )
}
const ChangePasswordDialog = ({ visible, onHide }) => {
  const [step, setStep] = useState(0)
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
    >
      <div className="change-email-dialog-container">
        {step === 0 && (
          <>
            <h2>Change Password</h2>
            <b>Current Password</b>
            <TextField placeholder="Enter current password" type="password" />
            <b>New Password</b>
            <TextField placeholder="Enter new password" type="password" />
            <b>Re-enter Password</b>
            <TextField placeholder="Re-enter new password" type="password" />
          </>
        )}
        {step === 1 && (
          <>
            <img
              src={avatar}
              width={100}
              height={100}
              style={{ borderRadius: 100 }}
            />
            <h2>Password Changed</h2>
            <b>Your password has been changed successfully</b>
            <br />
            <Button primary onClick={onHide}>
              Done
            </Button>
          </>
        )}
        <br />
        {step === 0 && (
          <>
            <span>
              <Button onClick={onHide}>Cancel</Button>
            </span>
            <span>
              <Button primary onClick={() => setStep((prev) => prev + 1)}>
                Change
              </Button>
            </span>
          </>
        )}
      </div>
    </DialogContainer>
  )
}

const ForgotPasswordDialog = ({ visible, onHide }) => {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState(0)
  const [type, setType] = useState(true)
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>Forgot Password</h2>}
        {step === 0 && (
          <>
            <Checkbox
              checked={type}
              label="Email"
              onClick={() => setType((prev) => !prev)}
            />
            <Checkbox
              checked={!type}
              label="Phone Number"
              onClick={() => setType((prev) => !prev)}
            />
          </>
        )}
        {step === 1 && (
          <>
            <b>{'An OTP has been sent to "Mohammed@gmail.com"'}</b>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              separator={<span>-</span>}
            />
            <b>{"Didn't receive a code?"}</b>
            <span>
              <Button primary>Resend</Button>
            </span>
          </>
        )}
        {step === 2 && (
          <>
            <b>New Password</b>
            <TextField placeholder="Enter new password" type="password" />
            <b>Re-enter Password</b>
            <TextField placeholder="Re-enter new password" type="password" />
          </>
        )}
        {step === 3 && (
          <>
            <img
              src={avatar}
              width={100}
              height={100}
              style={{ borderRadius: 100 }}
            />
            <h2>Password Changed</h2>
            <b>Your password has been changed successfully</b>
            <br />
            <Button primary onClick={onHide}>
              Done
            </Button>
          </>
        )}
        <br />
        {(step === 0 || step === 2) && (
          <span>
            <Button onClick={onHide}>Cancel</Button>
          </span>
        )}
        {step === 1 && (
          <span>
            <Button onClick={() => setStep((prev) => prev - 1)}>Back</Button>
          </span>
        )}
        {step < 2 && (
          <span>
            <Button primary onClick={() => setStep((prev) => prev + 1)}>
              Next
            </Button>
          </span>
        )}
        {step === 2 && (
          <span>
            <Button primary onClick={() => setStep((prev) => prev + 1)}>
              Confirm
            </Button>
          </span>
        )}
      </div>
    </DialogContainer>
  )
}
