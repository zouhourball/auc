import { Button, Checkbox, DialogContainer } from 'react-md'

import './style.scss'

const ContactInfoDialogdays = ({ visible, onHide }) => {
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog"
    >
      <div>
        <div>
          <div>
            <h3>Select Days</h3>{' '}
          </div>
          <div>
            <div className="days">
              <Checkbox label="Sunday" checked={true} />
              <Checkbox label="Monday" />
              <Checkbox label="Tuesday" />
              <Checkbox label="Wednesday" />
              <Checkbox label="Thursday" />
              <Checkbox label="Friday" />
              <Checkbox label="Saturday" />
            </div>
          </div>
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

export default ContactInfoDialogdays
