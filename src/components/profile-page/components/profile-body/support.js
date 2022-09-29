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
      <div
        className="md-cell md-cell--12"
        style={{
          borderBottom: '1px solid gray',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2>Support</h2>
      </div>

      <div className="md-cell md-cell--6">
        <b>Support Number</b>
        <TextField
          disabled
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
        <b>Support Email</b>
        <TextField
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
      <div className="md-cell md-cell--6">
        <b>Need Some Help?</b>
        <TextField
          rows={5}
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
      <div
        className="md-cell md-cell--8"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button flat primary>
          Send
        </Button>
      </div>
    </div>
  )
}

export default Support
