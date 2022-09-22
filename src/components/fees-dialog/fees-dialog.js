import { useTranslation } from 'libs/langs'
import { DialogContainer, FontIcon } from 'react-md'

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
          <div className="content-title">
            <div> {t('buyers_premium')} </div>
            <FontIcon onClick={() => onHide()}>close</FontIcon>
          </div>
          <p>{t('buyers_premium_content')}</p>
        </div>
      )}
      {type === 'commission' && (
        <div className="content">
          <div className="content-title">
            <div>{t('deposit')} </div>
            <FontIcon onClick={() => onHide()}>close</FontIcon>
          </div>
          <p> {t('deposit_content')} </p>
        </div>
      )}
    </DialogContainer>
  )
}

export default FeesDialog
