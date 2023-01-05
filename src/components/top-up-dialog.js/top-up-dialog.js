import { useState } from 'react'

import { DialogContainer, Button, TextField } from 'react-md'

import successImage from 'images/successfully-register.png'

import './style.scss'
const TopUpDialog = ({ title, visible, onHide, onContinue }) => {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('card')
  return (
    <DialogContainer
      className="top-up-dialog"
      visible={visible}
      onHide={() => onHide()}
      id="confirm-dialog"
      title={title}
      actions={
        <>
          <Button
            flat
            className="cancel-button"
            onClick={(e) => {
              e.stopPropagation()
              onHide && onHide()
            }}
          >
            cancel
          </Button>
          <Button
            flat
            swapTheming
            primary
            className="continue-button"
            onClick={(e) => {
              e.stopPropagation()
              onContinue && onContinue({ type, amount })
            }}
          >
            Continue
          </Button>
        </>
      }
    >
      <div className="top-up-dialog-information">
        <div className="label">Deposit Amount</div>
        <TextField
          id="auctionTitle"
          placeholder={'Enter Amount'}
          value={amount}
          onChange={(v) => setAmount(v)}
          className="textField-withShadow active"
          block
        />
        <div className="danger-text">
          To participate in this auction deposit a minimum amount of 10,000 AED
        </div>
        <div className="label">
          <span className="blue-text">Note: </span>
          <span>
            Please make a security deposit using any of the methods below.Once
            your deposit hes been processed,you will be able to participate in
            the auction.{' '}
          </span>
        </div>
        <div className="label">Select Payment Method</div>
        <div
          className={`textField-withShadow ${type === 'card' ? 'active' : ''}`}
          onClick={() => {
            setType('card')
          }}
        >
          Credit/Debit Card
        </div>
        <div
          className={`textField-withShadow ${
            type === 'deposit' ? 'active' : ''
          }`}
          onClick={() => {
            setType('deposit')
          }}
        >
          Bank Deposit{' '}
        </div>
        <div
          className={`textField-withShadow ${type === 'wire' ? 'active' : ''}`}
          onClick={() => {
            setType('wire')
          }}
        >
          Wire Transfer{' '}
        </div>
      </div>
    </DialogContainer>
  )
}

TopUpDialog.defaultProps = {
  title: 'Top Up',
  imgCard: successImage,
}

export default TopUpDialog
