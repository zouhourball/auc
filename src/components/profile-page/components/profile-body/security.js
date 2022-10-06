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
import success from '../profile-menu/Success.svg'
import { countriesCodes } from 'components/registration/helper'
import {
  checkVerifiedCode,
  sendVerifiedCode,
  updateEmail,
  updatePassword,
} from 'libs/api/auctions-api'
import { useMutation } from 'react-query'

const Security = ({ userInfo }) => {
  const { t } = useTranslation()
  const [dialogType, setDialogType] = useState('')
  const [informations, setInformations] = useState({
    email:
      userInfo?.email.substring(0, 2) +
      '**********' +
      userInfo?.email.substring(
        userInfo?.email?.indexOf('@'),
        userInfo?.email?.length,
      ),
    password: '********',
    phoneMobile:
      userInfo?.phoneMobile.substring(0, 4) +
      '****' +
      userInfo?.phoneMobile.substring(
        userInfo?.phoneMobile?.length - 3,
        userInfo?.phoneMobile?.length,
      ),
  })

  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div className="personal-information-header md-cell md-cell--12">
        <h2>Security</h2>
      </div>

      <div className="md-cell md-cell--6">
        <div className="change">
          <div className="label">Email*</div>
          <Button primary onClick={() => setDialogType('email')}>
            Change
          </Button>
        </div>
        <TextField
          disabled
          className="textField"
          block
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
        <div className="change">
          <div className="label">Password*</div>
          <Button primary onClick={() => setDialogType('password')}>
            Change
          </Button>
        </div>
        <div className="passwordField">
          <TextField
            disabled
            block
            fullWidth={false}
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
      </div>
      <div className="md-cell md-cell--6">
        <div className="change">
          <div className="label">Phone Number*</div>
          <Button primary onClick={() => setDialogType('phone')}>
            Change
          </Button>
        </div>
        <TextField
          disabled
          className="textField"
          block
          id={'phone'}
          placeholder={t('enter_phone_number')}
          value={informations?.phoneMobile}
          onChange={(v) =>
            setInformations((prev) => ({
              ...informations,
              phoneMobile: v,
            }))
          }
        />
      </div>
      {dialogType === 'email' && (
        <ChangeEmailDialog
          visible={dialogType === 'email'}
          onHide={() => setDialogType('')}
          emailData={informations?.email}
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
          subject={userInfo?.subject}
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

const ChangeEmailDialog = ({ visible, onHide, emailData }) => {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [oldEmail, setOldEmail] = useState('')

  const { mutate: updateEmailMutation } = useMutation(updateEmail, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        alert(res?.error)
      }
    },
  })
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
      actions={[
        <>
          {step === 3 && (
            <div className="emailChanged">
              <Button className="confirmBtn" primary onClick={onHide}>
                Done
              </Button>
            </div>
          )}
          {step < 2 && (
            <span>
              <Button className="cancelBtn" onClick={onHide}>
                Cancel
              </Button>
            </span>
          )}{' '}
          {step === 2 && (
            <span>
              <Button
                className="cancelBtn"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Back
              </Button>
            </span>
          )}
        </>,
        <>
          {step < 2 && (
            <span>
              <Button
                primary
                className="confirmBtn"
                onClick={() => {
                  if (emailData === oldEmail && step === 0) {
                    setStep((prev) => prev + 1)
                  } else {
                    //
                  }
                  if (step === 1) {
                    updateEmailMutation({
                      body: {
                        oldEmail: oldEmail,
                        email,
                      },
                    })
                    setStep((prev) => prev + 1)
                  }
                }}
              >
                Next
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => setStep((prev) => prev + 1)}
              >
                Confirm
              </Button>
            </span>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>Change Email</h2>}
        {step < 2 && (
          <>
            <div className="grey-label">Current Email</div>
            <TextField
              placeholder="Enter current email"
              value={oldEmail}
              block
              className="emailField"
              onChange={setOldEmail}
            />
          </>
        )}
        {step === 1 && (
          <>
            <div className="grey-label">New Email</div>
            <TextField
              placeholder="Enter new email"
              value={email}
              block
              className="emailField"
              onChange={setEmail}
            />
          </>
        )}
        {step === 2 && (
          <>
            <div className="opt-text">
              {'An OTP has been sent to "Mohammed@gmail.com"'}
            </div>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              className="otp-input"
              containerStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              inputStyle={{
                width: '4em',
                height: '4em',
                borderRadius: 18,
                backgroundColor: '#fff',
                borderColor: '#fff',
                boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.18)',
              }}
            />
            <div className="opt-text">
              {"Didn't receive a code?"}{' '}
              <span>
                <Button primary>Resend</Button>
              </span>{' '}
            </div>
          </>
        )}
        {step === 3 && (
          <div className="emailChanged">
            <img
              src={success}
              width={50}
              height={50}
              className="success-image"
              style={{
                borderRadius: '50%',
              }}
            />
            <h2>Email Changed</h2>
            <div className="grey-label" style={{ textAlign: 'center' }}>
              Your email has been changed successfully
            </div>
          </div>
        )}
      </div>
    </DialogContainer>
  )
}

const ChangeNumberDialog = ({ visible, onHide }) => {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState('')
  const [key, setKey] = useState('')
  const [phoneNumber, setPhoneNumber] = useState({
    current: '',
    currentCode: '',
    new: '',
    newCode: '',
  })
  const { mutate: changePhoneNumberOTP } = useMutation(sendVerifiedCode, {
    onSuccess: (res) => {
      if (res?.code === 'ok') {
        setKey(res?.data?.key)
        setStep((prev) => prev + 1)
      } else {
        alert(res?.message)
      }
    },
  })
  const { mutate: checkOtp } = useMutation(checkVerifiedCode, {
    onSuccess: (res) => {
      if (res?.code === 'ok') {
        setStep((prev) => prev + 1)
      } else {
        alert(res?.message)
      }
    },
  })

  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
      actions={[
        <>
          {step < 2 && (
            <span>
              <Button className="cancelBtn" onClick={onHide}>
                Cancel
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="cancelBtn"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Back
              </Button>
            </span>
          )}
        </>,
        <>
          {step < 2 && (
            <span>
              <Button
                primary
                className="confirmBtn"
                onClick={() => {
                  if (step === 1) {
                    changePhoneNumberOTP({
                      body: {
                        phone: phoneNumber?.newCode + phoneNumber?.new,
                      },
                    })
                  } else {
                    setStep((prev) => prev + 1)
                  }
                }}
              >
                Next
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => {
                  checkOtp({
                    body: {
                      code: otp,
                      key: key,
                    },
                  })
                }}
              >
                Confirm
              </Button>
            </span>
          )}
          {step === 3 && (
            <Button className="confirmBtn" primary onClick={onHide}>
              Done
            </Button>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>Change Phone Number</h2>}
        {step < 2 && (
          <>
            <div className="gray-label">Current Phone Number</div>
            <div style={{ display: 'flex' }} className="selectField">
              <SelectField
                id={'country-code'}
                block
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
                value={phoneNumber?.currentCode}
                onChange={(value) =>
                  setPhoneNumber((prev) => ({
                    ...prev,
                    currentCode: value,
                  }))
                }
                // itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                block
                placeholder="Current Phone Number"
                value={phoneNumber?.current}
                onChange={(v) =>
                  setPhoneNumber((prev) => ({
                    ...prev,
                    current: v,
                  }))
                }
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div>New Phone Number</div>
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
                value={phoneNumber?.newCode}
                onChange={(value) =>
                  setPhoneNumber((prev) => ({
                    ...prev,
                    newCode: value,
                  }))
                }
                className="country-code"
                // itemLabel="value"
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder="New Phone Number"
                value={phoneNumber?.new}
                onChange={(v) =>
                  setPhoneNumber((prev) => ({
                    ...prev,
                    new: v,
                  }))
                }
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              {'An OTP has been sent to "' +
                phoneNumber?.newCode +
                phoneNumber?.new +
                '"'}
            </div>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              separator={<span>-</span>}
            />
            <div>{"Didn't receive a code?"}</div>
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => {
                  changePhoneNumberOTP({
                    body: {
                      phone: phoneNumber?.newCode + phoneNumber?.new,
                    },
                  })
                }}
              >
                Resend
              </Button>
            </span>
          </>
        )}
        {step === 3 && (
          <div className="emailChanged">
            <img
              src={success}
              width={50}
              height={50}
              className="success-image"
              style={{
                borderRadius: '50%',
              }}
            />
            <h2>Email Changed</h2>
            <div>Your phone number has been changed successfully</div>
            <br />
          </div>
        )}
        <br />
      </div>
    </DialogContainer>
  )
}
const ChangePasswordDialog = ({ visible, onHide, subject }) => {
  const [password, setPassword] = useState({
    current: '',
    new: '',
    newConfirm: '',
  })
  const { mutate: updatePasswordMutation } = useMutation(updatePassword, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        alert(res?.error)
      }
    },
  })

  const [step, setStep] = useState(0)
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="change-email-dialog"
      focusOnMount={false}
      onHide={onHide}
      actions={[
        <>
          {step === 0 && (
            <>
              <span>
                <Button className="cancelBtn" onClick={onHide}>
                  Cancel
                </Button>
              </span>
              <span>
                <Button
                  className="confirmBtn"
                  primary
                  onClick={() => {
                    if (password?.new === password?.newConfirm) {
                      updatePasswordMutation({
                        body: {
                          old_password: password?.current,
                          password: password?.new,
                          subject: subject,
                        },
                      })
                    } else {
                      alert('Unmatched password')
                    }
                  }}
                >
                  Change
                </Button>
              </span>
            </>
          )}
        </>,
        <>
          {step === 1 && (
            <Button className="confirmBtn" primary onClick={onHide}>
              Done
            </Button>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step === 0 && (
          <>
            <h2>Change Password</h2>
            <div className="grey-label">Current Password</div>
            <TextField
              placeholder="Enter current password"
              type="password"
              block
              className="textField"
              value={password?.current}
              onChange={(v) =>
                setPassword((prev) => ({
                  ...prev,
                  current: v,
                }))
              }
            />
            <div className="grey-label">New Password</div>
            <TextField
              placeholder="Enter new password"
              type="password"
              block
              className="textField"
              value={password?.new}
              onChange={(v) =>
                setPassword((prev) => ({
                  ...prev,
                  new: v,
                }))
              }
            />
            <div className="grey-label">Re-enter Password</div>
            <TextField
              placeholder="Re-enter new password"
              type="password"
              block
              className="textField"
              value={password?.newConfirm}
              onChange={(v) =>
                setPassword((prev) => ({
                  ...prev,
                  newConfirm: v,
                }))
              }
            />
          </>
        )}
        {step === 1 && (
          <div className="emailChanged">
            <img
              src={success}
              width={50}
              height={50}
              className="success-image"
              style={{
                borderRadius: '50%',
              }}
            />
            <h2>Password Changed</h2>
            <div>Your password has been changed successfully</div>
            <br />
          </div>
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
      actions={[
        <>
          {step < 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => setStep((prev) => prev + 1)}
              >
                Next
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => setStep((prev) => prev + 1)}
              >
                Confirm
              </Button>
            </span>
          )}
          {step === 3 && (
            <Button className="confirmBtn" primary onClick={onHide}>
              Done
            </Button>
          )}
        </>,
        <>
          {(step === 0 || step === 2) && (
            <span>
              <Button className="cancelBtn" onClick={onHide}>
                Cancel
              </Button>
            </span>
          )}
          {step === 1 && (
            <span>
              <Button
                className="cancelBtn"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Back
              </Button>
            </span>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>Forgot Password</h2>}
        {step === 0 && (
          <div className="checkbox-group">
            <Checkbox
              type="radio"
              className={`checkbox-container ${type === true ? 'active' : ''}`}
              checked={type}
              label="Email"
              onClick={() => setType((prev) => !prev)}
            />
            <Checkbox
              type="radio"
              className={`checkbox-container ${!type === true ? 'active' : ''}`}
              checked={!type}
              label="Phone Number"
              onClick={() => setType((prev) => !prev)}
            />
          </div>
        )}
        {step === 1 && (
          <>
            <div>{'An OTP has been sent to "Mohammed@gmail.com"'}</div>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              separator={<span>-</span>}
            />
            <div>{"Didn't receive a code?"}</div>
            <span>
              <Button primary>Resend</Button>
            </span>
          </>
        )}
        {step === 2 && (
          <>
            <div>New Password</div>
            <TextField placeholder="Enter new password" type="password" />
            <div>Re-enter Password</div>
            <TextField placeholder="Re-enter new password" type="password" />
          </>
        )}
        {step === 3 && (
          <>
            <img
              src={success}
              width={100}
              height={100}
              style={{ borderRadius: 100 }}
            />
            <h2>Password Changed</h2>
            <div>Your password has been changed successfully</div>
          </>
        )}
      </div>
    </DialogContainer>
  )
}
