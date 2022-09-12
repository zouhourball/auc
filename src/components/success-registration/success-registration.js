import { DialogContainer, Button } from 'react-md'
import success from './success.png'
import './style.scss'

const SuccessfulRegistration = ({ visible, onHide }) => {
  const actions = [
    <Button
      key={1}
      flat
      className="doneBtn"
      onClick={() => {
        onHide(false)
      }}
    >
      Done
    </Button>,
  ]
  return (
    <DialogContainer
      id="successful-dialog"
      className="successful-dialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      actions={actions}
    >
      <img className="successful-dialog-img" src={success} />
      <div className="successful-dialog-title">Successfully Registered</div>
      <div className="successful-dialog-msg">
        Please wait for an approval to use the platform
      </div>
    </DialogContainer>
  )
}
export default SuccessfulRegistration
