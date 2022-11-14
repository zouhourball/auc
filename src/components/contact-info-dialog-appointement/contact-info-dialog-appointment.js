import { Button, DialogContainer } from 'react-md'
import './style.scss'

const ContactInfoDialogappointment = ({ visible, onHide }) => {
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
          <h3>Are you sure you want to cancel the appointment ?</h3>
        </div>
        <div>
          <Button
            flat
            primary
            swapTheming
            className="auction-details-btn"
            onClick={onHide}
          >
            Confirm
          </Button>
          <Button
            flat
            primary
            swapTheming
            className="auction-details-btn"
            onClick={onHide}
          >
            cancel
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialogappointment
