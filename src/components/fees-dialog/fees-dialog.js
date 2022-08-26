import { useTranslation } from 'libs/langs'
import { DialogContainer } from 'react-md'

import './style.scss'
const FeesDialog = ({ type, onHide }) => {
  const { t } = useTranslation()
  return (
    <DialogContainer
      className="feesDialog"
      visible={type}
      onHide={() => onHide()}
      focusOnMount={false}
    >
      {type === 'bayers' && (
        <div className="content">
          <h3> {t('buyers_premium')} </h3>
          <p>{t('buyers_premium_content')}</p>
        </div>
      )}
      {type === 'commission' && (
        <div className="content">
          <h3>{t('deposit')} </h3>
          <p> {t('deposit_content')} </p>
        </div>
      )}
    </DialogContainer>
  )
}

export default FeesDialog
