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
    >
      <div className="top-up-dialog-information">
        <>
          <div className="title">{title}</div>
          <TextField
            id="auctionTitle"
            placeholder={'Enter Amount'}
            value={amount}
            onChange={(v) => setAmount(v)}
            className="textField-withShadow"
            required
            block
          />
          <div>
            To participate in this auction deposit a minimum amount of 10,000
            AED
          </div>
          <div>
            <span>Note:</span>
            <span>
              Please make a security deposit using any of the methods below.Once
              your deposit hes been processed,you will be able to participate in
              the auction.{' '}
            </span>
          </div>
          <div>Select Payment Method</div>
          <div
            onClick={() => {
              setType('card')
            }}
          >
            Credit/Debit Card
          </div>
          <div
            onClick={() => {
              setType('deposit')
            }}
          >
            Bank Deposit{' '}
          </div>
          <div
            onClick={() => {
              setType('wire')
            }}
          >
            Wire Transfer{' '}
          </div>
        </>
      </div>
      <Button
        swapTheming
        flat
        primary
        className="top-up-dialog-button"
        onClick={(e) => {
          e.stopPropagation()
          onHide && onHide()
        }}
      >
        cancel
      </Button>
      <Button
        swapTheming
        flat
        primary
        className="top-up-dialog-button"
        onClick={(e) => {
          e.stopPropagation()
          onContinue && onContinue({ type, amount })
        }}
      >
        Continue{' '}
      </Button>
    </DialogContainer>
  )
}

TopUpDialog.defaultProps = {
  title: 'Top Up',
  imgCard: successImage,
}

export default TopUpDialog
