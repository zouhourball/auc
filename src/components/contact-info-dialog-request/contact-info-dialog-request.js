import { Button, DialogContainer } from 'react-md'
import './style.scss'

const ContactInfoDialogrequest = ({ visible, onHide }) => {
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
          <h3>Request for Viewing Sent Successfully</h3>
        </div>
        <div>
          <p>Please wait for approval from the broker</p>
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
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialogrequest
