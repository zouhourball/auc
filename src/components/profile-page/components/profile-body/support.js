import { useState } from 'react'
import { Button, TextField } from 'react-md'

import { useTranslation } from 'libs/langs'

const Support = () => {
  const { t } = useTranslation()

  const [informations, setInformations] = useState({
    supportNumber: '+968 9817281',
    supportEmail: 'ahmed@gmail.com',
  })

  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div className="personal-information-header md-cell md-cell--12">
        <h2>Support</h2>
      </div>

      <div className="md-cell md-cell--6">
        <div className="label">Support Number</div>
        <TextField
          disabled
          block
          className="textField grey"
          placeholder={t('enter_email')}
          value={informations?.supportNumber}
          onChange={(v) =>
            setInformations((prev) => ({
              ...informations,
              supportNumber: v,
            }))
          }
        />
      </div>
      <div className="md-cell md-cell--6">
        <div className="label">Support Email</div>
        <TextField
          block
          className="textField grey"
          disabled
          placeholder={t('enter_email')}
          value={informations?.supportEmail}
          onChange={(v) =>
            setInformations((prev) => ({
              ...informations,
              supportEmail: v,
            }))
          }
        />
      </div>
      <div className="md-cell md-cell--12">
        <div className="label">Need Some Help?</div>
        <div className="textField">
          <TextField
            rows={5}
            block
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
          <div className="md-cell md-cell--12 personal-information-footer">
            <Button className="confirmBtn sendBtn" flat primary>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
