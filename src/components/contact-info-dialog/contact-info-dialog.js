import { Button, DialogContainer } from 'react-md'

const ContactInfoDialog = ({ visible, onHide }) => {
  return (
    <DialogContainer visible={visible} onHide={onHide} focusOnMount={false}>
      <Button onClick={onHide}>X</Button>
      <h1>{visible?.ownerName}</h1>
      <h1>{visible?.contact}</h1>
    </DialogContainer>
  )
}

export default ContactInfoDialog
