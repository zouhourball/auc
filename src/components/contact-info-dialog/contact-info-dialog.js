import { Button, DialogContainer } from 'react-md'
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
          {visible?.type === 'phone' && <h3>Phone Number</h3>}
          {visible?.type === 'email' && <h3>Email Adress</h3>}
        </div>
      }
    >
      <div className="contact-info-dialog-content">
        {visible?.type === 'phone' && <h4>{visible?.email}</h4>}
        {visible?.type === 'email' && <h4>{visible?.phoneMobile}</h4>}
        <div>{visible?.contact}</div>
      </div>
      <Button
        flat
        primary
        swapTheming
        className="auction-details-btn"
        onClick={onHide}
      >
        Done
      </Button>
    </DialogContainer>
  )
}

export default ContactInfoDialog
