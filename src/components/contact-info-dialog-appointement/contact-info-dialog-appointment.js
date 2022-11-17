import { Button, DialogContainer } from 'react-md'
import closeIcon from './Auction Ended.svg'

import './style.scss'

const ContactInfoDialogappointment = ({ visible, onHide, onConfirm }) => {
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="cancel-appointment-dialog"
      title={
        <div className="title">
          <img height={40} src={closeIcon} />
          <div>Are you sure you want to cancel the appointment ?</div>
        </div>
      }
    >
      <div className="actions">
        <Button
          flat
          swapTheming
          className="cancel-btn"
          onClick={() => onHide()}
        >
          cancel
        </Button>
        <Button
          flat
          primary
          swapTheming
          className="add-btn"
          onClick={() => {
            onConfirm()
            onHide()
          }}
        >
          Confirm
        </Button>
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialogappointment
