import { Button, DialogContainer, FontIcon } from 'react-md'
import './style.scss'

const ContactInfoDialog = ({ visible, onHide }) => {
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog"
      title={
        <div className="contact-info-dialog-title">
          {visible?.ownerName}
          <Button icon onClick={onHide}>
            close
          </Button>
        </div>
      }
    >
      <div className="contact-info-dialog-content">
        {visible?.type === 'phone' && <FontIcon>call</FontIcon>}
        {visible?.type === 'email' && <FontIcon>mail_outline</FontIcon>}
        <div>{visible?.contact}</div>
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialog
