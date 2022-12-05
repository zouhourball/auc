import { Button, DialogContainer } from 'react-md'
import './style.scss'

const ContactInfoDialog = ({ visible, onHide }) => {
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info"
    >
      <div className="contact-info-content">
        <div className="title">
          {visible?.type === 'phone' && <span>Phone Number</span>}
          {visible?.type === 'email' && <span>Email Adress</span>}
        </div>
        <div>
          {visible?.type === 'phone' && <span>{visible?.email}</span>}
          {visible?.type === 'email' && <span>{visible?.phoneMobile}</span>}
          <div>{visible?.contact}</div>
        </div>
        <Button flat primary className="contact-info-btn" onClick={onHide}>
          Done
        </Button>
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialog
