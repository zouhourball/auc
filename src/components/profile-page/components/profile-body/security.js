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
  // checkVerifiedCode,
  checkVerifiedCodeAny,
  forgotPasswordSendCode,
  sendOTP,
  sendVerifiedCode,
  // sendOTPForResetPassword,
  // sendVerifiedCode,
  // updateEmail,
  updatePassword,
  updateUserEmail,
  // updateUserMobile,
  verifyEmails,
} from 'libs/api/auctions-api'
import { useMutation } from 'react-query'
import ToastMsg from 'components/toast-msg'
import { addToast } from 'modules/app/actions'
import { useDispatch } from 'react-redux'

const Security = ({ userInfo }) => {
  const { t } = useTranslation()
  const [dialogType, setDialogType] = useState('')
  const [informations, setInformations] = useState({
    email: userInfo?.email
      ? userInfo?.email?.substring(0, 2) +
        '**********' +
        userInfo?.email?.substring(
          userInfo?.email?.indexOf('@'),
          userInfo?.email?.length,
        )
      : '',
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
        <h2>{t('security')}</h2>
      </div>

      <div className="md-cell md-cell--6">
        <div className="change">
          <div className="label">{t('email')}*</div>
          <Button primary onClick={() => setDialogType('email')}>
            {t('change')}
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
          <div className="label">{t('password')}*</div>
          <Button primary onClick={() => setDialogType('password')}>
            {t('change')}
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
            {t('forgot_password_?')}
          </Button>
        </div>
      </div>
      <div className="md-cell md-cell--6">
        <div className="change">
          <div className="label">{t('phone_number')}*</div>
          <Button primary onClick={() => setDialogType('phone')}>
            {t('change')}
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
          emailData={userInfo?.email}
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
          user={userInfo}
        />
      )}
    </div>
  )
}

export default Security

const ChangeEmailDialog = ({ visible, onHide, emailData }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [oldEmail, setOldEmail] = useState('')

  // const { mutate: updateEmailMutation } = useMutation(updateEmail, {
  //   onSuccess: (res) => {
  //     if (res?.success) {
  //       setStep((prev) => prev + 1)
  //     } else {
  //       alert(res?.error)
  //     }
  //   },
  // })
  const { mutate: verifyEmailsMutation } = useMutation(verifyEmails, {
    onSuccess: (res) => {
      if (res?.data?.['0']?.exist) {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })
  // const { mutate: checkOtpMutation } = useMutation(checkVerifiedCodeAny, {
  //   onSuccess: (res) => {
  //     if (res?.code === 'ok') {
  //       setStep((prev) => prev + 1)
  //     } else {
  //       // alert(res?.message)
  //     }
  //   },
  // })
  const { mutate: sendOtpMutation } = useMutation(sendOTP, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })
  const { mutate: updateEmailMutation } = useMutation(updateUserEmail, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
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
              <Button
                className="confirmBtn"
                primary
                onClick={() => {
                  onHide()
                  location.reload()
                }}
              >
                {t('done')}
              </Button>
            </div>
          )}
          {step < 2 && (
            <span>
              <Button className="cancelBtn" onClick={onHide}>
                {t('cancel')}
              </Button>
            </span>
          )}{' '}
          {step === 2 && (
            <span>
              <Button
                className="cancelBtn"
                onClick={() => setStep((prev) => prev - 1)}
              >
                {t('back')}
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
                  if (step === 0) {
                    verifyEmailsMutation({
                      body: [{ email: oldEmail }],
                    })
                  } else if (step === 1) {
                    sendOtpMutation({
                      body: {
                        expiry: 300,
                        force: false,
                        method: 'email',
                        email: email,
                      },
                    })
                  }
                }}
              >
                {t('next')}
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() =>
                  updateEmailMutation({
                    body: {
                      oldEmail: oldEmail,
                      email: email,
                      code: otp,
                      method: 'otp',
                    },
                  })
                }
              >
                {t('confirm')}
              </Button>
            </span>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>{t('change_email')}</h2>}
        {step < 2 && (
          <>
            <div className="grey-label">{t('current_email')}</div>
            <TextField
              placeholder={t('enter_current_email')}
              value={oldEmail}
              block
              className="emailField"
              onChange={setOldEmail}
            />
          </>
        )}
        {step === 1 && (
          <>
            <div className="grey-label">{t('new_email')}</div>
            <TextField
              placeholder={t('enter_new_email')}
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
              {t('an_otp_has_been_sent_to')} {email}
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
                border: 'none',
                boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.18)',
              }}
            />
            <div className="opt-text">
              {t("didn't_receive_a_code?")}{' '}
              <span>
                <Button primary>{t('resend')}</Button>
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
            <h2>{t('email_changed')}</h2>
            <div className="grey-label" style={{ textAlign: 'center' }}>
              {t('your_email_has_been_changed_successfully')}
            </div>
          </div>
        )}
      </div>
    </DialogContainer>
  )
}

const ChangeNumberDialog = ({ visible, onHide }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
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
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })
  const { mutate: checkOtp } = useMutation(checkVerifiedCode, {
    onSuccess: (res) => {
      if (res?.code === 'ok') {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
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
                {t('cancel')}
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="cancelBtn"
                onClick={() => setStep((prev) => prev - 1)}
              >
                {t('back')}
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
                {t('next')}
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
                      phone: phoneNumber?.newCode + phoneNumber?.new,
                    },
                  })
                }}
              >
                {t('confirm')}
              </Button>
            </span>
          )}
          {step === 3 && (
            <Button className="confirmBtn" primary onClick={onHide}>
              {t('done')}
            </Button>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>{t('change_phone_number')}</h2>}
        {step < 2 && (
          <>
            <div className="grey-label">{t('current_phone_number')}</div>
            <div
              style={{ display: 'flex', marginBottom: 8 }}
              className="selectField"
            >
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
                simplifiedMenu={false}
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                block
                placeholder={t('current_phone_number')}
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
            <div className="gray-label">New Phone Number</div>
            <div style={{ display: 'flex' }} className="selectField">
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
                block
                value={phoneNumber?.newCode}
                onChange={(value) =>
                  setPhoneNumber((prev) => ({
                    ...prev,
                    newCode: value,
                  }))
                }
                className="country-code"
                simplifiedMenu={false}
                position={SelectField.Positions.BELOW}
              />
              <div className="sep"></div>
              <TextField
                id={'phone'}
                placeholder={t('new_phone_number')}
                block
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
            <div className="opt-text">
              {t('an_otp_has_been_sent_to') +
                ' ' +
                phoneNumber?.newCode +
                phoneNumber?.new +
                '"'}
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
                border: 'none',
                boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.18)',
              }}
              separator={<span>-</span>}
            />
            <div>
              {t("didn't_receive_a_code")}
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
                  {t('resend')}
                </Button>
              </span>
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
            <h2>{t('phone_number_changed')}</h2>
            <div>{t('your_phone_number_has_been_changed_successfully')}</div>
          </div>
        )}
      </div>
    </DialogContainer>
  )
}
const ChangePasswordDialog = ({ visible, onHide, subject }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
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
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
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
                  {t('cancel')}
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
                      dispatch(
                        addToast(
                          <ToastMsg
                            text={'Password are not match'}
                            type="error"
                          />,
                          'hide',
                        ),
                      )
                    }
                  }}
                >
                  {t('change')}
                </Button>
              </span>
            </>
          )}
        </>,
        <>
          {step === 1 && (
            <Button className="confirmBtn" primary onClick={onHide}>
              {t('done')}
            </Button>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step === 0 && (
          <>
            <h2>{t('forgot_password')}</h2>
            <div className="grey-label">{t('current_password')}</div>
            <TextField
              placeholder={t('enter_current_password')}
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
            <div className="grey-label">{t('new_password')}</div>
            <TextField
              placeholder={t('enter_new_password')}
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
            <div className="grey-label">{t('re-enter_password')}</div>
            <TextField
              placeholder={t('re-enter_new_password')}
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
            <h2>{t('password_changed')}</h2>
            <div>{t('your_password_has_been_changed_successfully')}</div>
          </div>
        )}
      </div>
    </DialogContainer>
  )
}

const ForgotPasswordDialog = ({ visible, onHide, user }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState(0)
  const [type, setType] = useState(true)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const { mutate: sendOtpMutation } = useMutation(forgotPasswordSendCode, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })
  const { mutate: checkOtpMutation } = useMutation(checkVerifiedCodeAny, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })
  const { mutate: updatePasswordMutation } = useMutation(updatePassword, {
    onSuccess: (res) => {
      if (res?.success) {
        setStep((prev) => prev + 1)
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
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
          {(step === 0 || step === 2) && (
            <span>
              <Button className="cancelBtn" onClick={onHide}>
                {t('cancel')}
              </Button>
            </span>
          )}
          {step === 1 && (
            <span>
              <Button
                className="cancelBtn"
                onClick={() => setStep((prev) => prev - 1)}
              >
                {t('back')}
              </Button>
            </span>
          )}
        </>,
        <>
          {step < 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => {
                  if (step === 0) {
                    sendOtpMutation(
                      type
                        ? {
                          body: {
                            expiry: 300,
                            force: true,
                            method: 'email',
                            email: user?.email,
                          },
                        }
                        : {
                          body: {
                            expiry: 300,
                            force: true,
                            method: 'mobile',
                            mobile: user?.phoneMobile,
                          },
                        },
                    )
                  } else {
                    checkOtpMutation(
                      type
                        ? {
                          body: {
                            email: user?.email,
                            code: otp,
                            method: 'email',
                          },
                        }
                        : {
                          body: {
                            mobile: user?.phoneMobile,
                            code: otp,
                            method: 'mobile',
                          },
                        },
                    )
                  }
                }}
              >
                {t('next')}
              </Button>
            </span>
          )}
          {step === 2 && (
            <span>
              <Button
                className="confirmBtn"
                primary
                onClick={() => {
                  if (password1 === password2) {
                    updatePasswordMutation(
                      type
                        ? {
                          body: {
                            subject: user?.subject,
                            code: otp,
                            method: 'email',
                            password: password1,
                          },
                        }
                        : {
                          body: {
                            subject: user?.subject,
                            code: otp,
                            method: 'mobile',
                            password: password1,
                          },
                        },
                    )
                  }
                }}
              >
                {t('confirm')}
              </Button>
            </span>
          )}
          {step === 3 && (
            <Button className="confirmBtn" primary onClick={onHide}>
              {t('done')}
            </Button>
          )}
        </>,
      ]}
    >
      <div className="change-email-dialog-container">
        {step !== 3 && <h2>{t('forgot_password')}</h2>}
        {step === 0 && (
          <div className="checkbox-group">
            <Checkbox
              type="radio"
              className={`checkbox-container ${type === true ? 'active' : ''}`}
              checked={type}
              label={t('email')}
              onClick={() => setType((prev) => !prev)}
            />
            <Checkbox
              type="radio"
              className={`checkbox-container ${!type === true ? 'active' : ''}`}
              checked={!type}
              label={t('phone_number')}
              onClick={() => setType((prev) => !prev)}
            />
          </div>
        )}
        {step === 1 && (
          <>
            <div className="opt-text">
              {t('an_otp_has_been_sent_to')}{' '}
              {type ? user?.email : user?.phoneMobile}
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
                border: 'none',
                boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.18)',
              }}
              separator={<span>-</span>}
            />
            <div>
              {t("didn't_receive_a_code?")}{' '}
              <span>
                <Button primary>{t('resend')}</Button>
              </span>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>{t('new_password')}</div>
            <TextField
              className="textField"
              block
              placeholder={t('enter_new_password')}
              type="password"
              value={password1}
              onChange={(text) => setPassword1(text)}
            />
            <div>{t('re-enter_password')}</div>
            <TextField
              placeholder={t('re-enter_new_password')}
              className="textField"
              block
              type="password"
              value={password2}
              onChange={(text) => setPassword2(text)}
            />
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
            <h2>{t('password_changed')}</h2>
            <div className="grey-label" style={{ textAlign: 'center' }}>
              {t('your_password_has_been_changed_successfully')}
            </div>
          </div>
        )}
      </div>
    </DialogContainer>
  )
}
