import { DialogContainer, Button } from 'react-md'

import './style.scss'
const ConfirmDialog = ({
  title,
  description,
  btnTitle,
  imgCard,
  visible,
  onHide,
}) => {
  return (
    <DialogContainer
      className="confirm-dialog"
      visible={visible}
      onHide={() => onHide()}
      id="confirm-dialog"
    >
      <div className="confirm-dialog-information">
        {imgCard && <img src={imgCard} className="illustration" />}
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
      <Button
        swapTheming
        flat
        primary
        className="confirm-dialog-button"
        onClick={(e) => {
          e.stopPropagation()
          onHide && onHide()
        }}
      >
        {btnTitle}
      </Button>
    </DialogContainer>
  )
}

ConfirmDialog.defaultProps = {
  title: 'Successfully Registered',
  description: 'PLease wait for an approval to use the platform',
  btnTitle: 'Done',
  imgCard: '',
}

export default ConfirmDialog
