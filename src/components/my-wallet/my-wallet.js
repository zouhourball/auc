import { useState } from 'react'
import { Button, TextField } from 'react-md'

import './style.scss'
const MyWallet = ({
  totalAmount,
  committed,
  nbrAuction,
  available,
  amount,
  setAmount,
  onContinue,
}) => {
  const [tab, setTab] = useState(1)
  const [type, setType] = useState('card')
  return (
    <div className="my-wallet">
      <div>My Wallet</div>
      <div className="my-wallet-card">
        <div>Total Amount </div>
        <div>{totalAmount} AED</div>
        <div>Committed</div>
        <div>
          {committed}AED ({nbrAuction + 'auctions'})
        </div>
        <div>Available</div>
        <div>{available} AED</div>
      </div>
      <div className="my-wallet-tab">
        <div onClick={() => setTab(1)}> Deposit</div>
        <div onClick={() => setTab(2)}>withdraw</div>
      </div>
      {tab === 1 && (
        <>
          <div className="title">Deposit Amount</div>
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
            <span>Note:</span>
            <span>
              Please make a security deposit using any of the methods below.Once
              your deposit hes been processed,you will be able to participate in
              the auction.{' '}
            </span>
          </div>
          <div>Payment Method</div>
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
      )}
      {tab === 2 && (
        <>
          {' '}
          <div className="title">Withdraw Amount</div>
          <TextField
            id="auctionTitle"
            placeholder={'Enter Amount'}
            value={amount}
            onChange={(v) => setAmount(v)}
            className="textField-withShadow"
            required
            block
          />
          <div>Maximum withdraw Amount is 2,500 AED</div>
        </>
      )}
      <Button
        swapTheming
        flat
        primary
        className="top-up-dialog-button"
        onClick={(e) => {}}
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
    </div>
  )
}
export default MyWallet
MyWallet.defaultProps = {
  totalAmount: '2,500',
  committed: '1,500',
  nbrAuction: '2',
  available: '1,000',
}
