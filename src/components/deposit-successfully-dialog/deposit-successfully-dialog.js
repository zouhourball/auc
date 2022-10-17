import { DialogContainer, Button } from 'react-md'

import successImage from 'images/successfully-register.png'

import './style.scss'
const DepositSuccessfullyDialog = ({
  title,
  description,
  btnTitle,
  imgCard,
  visible,
  onHide,
}) => {
  return (
    <DialogContainer
      className="confirm-dialog-success"
      visible={visible}
      onHide={() => onHide()}
      id="confirm-dialog"
    >
      <div className="confirm-dialog-success-information">
        <>
          {imgCard && <img src={imgCard} className="illustration" />}
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </>
      </div>
      <Button
        swapTheming
        flat
        primary
        className="confirm-dialog-success-button"
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

DepositSuccessfullyDialog.defaultProps = {
  title: 'Amount Deposit Successfully',
  description: `you have Deposit an amount of 39.000AED`,
  btnTitle: 'Done',
  imgCard: successImage,
}

export default DepositSuccessfullyDialog
