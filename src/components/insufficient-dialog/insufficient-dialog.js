import { DialogContainer, Button } from 'react-md'

import successImage from 'images/successfully-register.png'

import './style.scss'
const InsufficientDialog = ({
  title,
  description,
  btnTitle,
  imgCard,
  visible,
  onHide,
  currentAmount,
  depositAmount,
}) => {
  return (
    <DialogContainer
      className="insufficient-dialog"
      visible={visible}
      onHide={() => onHide()}
      id="confirm-dialog"
    >
      <div className="insufficient-dialog-information">
        <>
          {imgCard && <img src={imgCard} className="illustration" />}
          <div className="title">{title}</div>
          <div className="description">{description}</div>
          <div>
            Current Amount :<span>{currentAmount}</span>{' '}
          </div>
          <div>
            Deposit Amount : <span>{depositAmount}</span>
          </div>
        </>
      </div>
      <Button
        swapTheming
        flat
        primary
        className="insufficient-dialog-button"
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

InsufficientDialog.defaultProps = {
  title: 'Insufficient Funds',
  description: `you don't have enough funds to pay this deposit`,
  btnTitle: 'Done',
  imgCard: successImage,
  currentAmount: '2.500 AED',
  depositAmount: '4.500 AED',
}

export default InsufficientDialog
