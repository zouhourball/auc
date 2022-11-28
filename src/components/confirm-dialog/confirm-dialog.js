import { DialogContainer, Button } from 'react-md'
import { useTranslation } from 'libs/langs'

import './style.scss'
const ConfirmDialog = ({
  onConfirm,
  title,
  description,
  btnTitle,
  imgCard,
  visible,
  onHide,
  msg,
}) => {
  const { t } = useTranslation()

  return (
    <DialogContainer
      className="confirm-dialog"
      visible={visible}
      onHide={() => onHide()}
      id="confirm-dialog"
    >
      <div className="confirm-dialog-information">
        {msg ? (
          <div className="title">
            {msg === 'OrgAlreadyExists'
              ? t('org_exists')
              : msg === 'MobileAlreadyExists'
                ? t('mobile_exists')
                : msg === 'EmailAlreadyExists'
                  ? t('email_exists')
                  : msg}
          </div>
        ) : (
          <>
            {imgCard && <img src={imgCard} className="illustration" />}
            <div className="title">{title}</div>
            <div className="description">{description}</div>
          </>
        )}
      </div>
      <Button
        swapTheming
        flat
        primary
        className="confirm-dialog-button"
        onClick={(e) => {
          onConfirm()
          onHide && onHide()
        }}
      >
        {btnTitle}
      </Button>
    </DialogContainer>
  )
}

ConfirmDialog.defaultProps = {
  title: 'Successfully Registered',
  description: 'PLease wait for an approval to use the platform',
  btnTitle: 'Done',
  imgCard: '',
}

export default ConfirmDialog
