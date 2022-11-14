import { Button, DialogContainer } from 'react-md'
import { useTranslation } from 'libs/langs'
import './style.scss'

const ContactInfoDialogrequest = ({ visible, onHide }) => {
  const { t } = useTranslation()
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog"
    >
      <div>
        <div className="contact-info-dialog-title">
          <img src="" alt="icon" />
        </div>
        <div className="contact-info-dialog-content">
          <h3>{t('request_for_viewing_success')}</h3>
        </div>
        <div>
          <p>{t('wait_for_approval')}</p>
        </div>
        <Button
          flat
          primary
          swapTheming
          className="auction-details-btn"
          onClick={onHide}
        >
          {t('done')}
        </Button>
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialogrequest
