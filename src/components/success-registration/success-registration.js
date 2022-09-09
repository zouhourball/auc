import { DialogContainer, Button, FontIcon } from 'react-md'

const SuccessfulRegistration = ({ visible, onHide }) => {
  const actions = [
    <Button
      key={1}
      flat
      className="disagree"
      onClick={() => {
        onHide(false)
      }}
    >
      Done
    </Button>,
  ]
  return (
    <DialogContainer
      id="conditions-dialog"
      className="conditions-dialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      actions={actions}
    >
      <FontIcon>info</FontIcon>

      <h1>Successfully Registered</h1>
      <span>Please wait for an approval to use the platform</span>
    </DialogContainer>
  )
}
export default SuccessfulRegistration
