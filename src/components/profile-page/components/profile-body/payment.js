import { useTranslation } from 'libs/langs'
import { useState } from 'react'
import { Button } from 'react-md'

const Payment = () => {
  const { t } = useTranslation()

  const [edit, setEdit] = useState(true)

  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div className="personal-information-header md-cell md-cell--12">
        <h2>{t('payment')}</h2>
        <Button icon primary={!edit} onClick={() => setEdit((prev) => !prev)}>
          more_vert
        </Button>
      </div>
      {[1, 2, 3, 4, 5].map((el) => (
        <div key={el} className="payment-row md-cell md-cell--8">
          <div>Lot #124</div>
          <div>12/08/2022 13:11</div>
          <div>14,000 OMR</div>
          <Button flat primary>
            {t('download')}
          </Button>
        </div>
      ))}
    </div>
  )
}

export default Payment
