import { useState } from 'react'
import { Button, TextField } from 'react-md'

import './style.scss'
const MyWallet = ({
  myWalletData,
  refetchWallet,
  amount,
  setAmount,
  onContinue,
}) => {
  const { balance, currency } = myWalletData
  const [tab, setTab] = useState(1)
  const [type, setType] = useState('card')
  return (
    <div className="my-wallet">
      <div>My Wallet</div>
      <div className="my-wallet-card">
        <div>Total Amount </div>
        <div>
          {balance} {currency?.name}
        </div>
        <div>Committed</div>
        <div>0{currency?.name}</div>
        <div>Available</div>
        <div>0 {currency?.name}</div>
      </div>
      <div className="my-wallet-tab">
        <Button onClick={() => setTab(1)}> Deposit</Button>
        <Button onClick={() => setTab(2)}>withdraw</Button>
      </div>
      {tab === 1 && (
        <>
          {/* <div className="title">Deposit Amount</div>
          <TextField
            id="auctionTitle"
            placeholder={'Enter Amount'}
            value={amount}
            onChange={(v) => setAmount(v)}
            className="textField-withShadow"
            required
            block
          /> */}

          <div>Payment Method</div>
          <Button
            onClick={() => {
              setType('card')
            }}
            className={`${type === 'card' ? 'blue-border' : ''}`}
          >
            Credit/Debit Card
          </Button>
          <Button
            onClick={() => {
              setType('deposit')
            }}
            className={`${type === 'deposit' ? 'blue-border' : ''}`}
          >
            Bank Deposit{' '}
          </Button>
          <Button
            onClick={() => {
              setType('wire')
            }}
            className={`${type === 'wire' ? 'blue-border' : ''}`}
          >
            Bank Transfer{' '}
          </Button>
          <div>
            <span>Note:</span>
            <span>
              Please make a security deposit using any of the methods below.Once
              your deposit hes been processed,you will be able to participate in
              the auction.{' '}
            </span>
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
          <div>Maximum withdraw Amount is 2,500 {currency?.name}</div>
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
          onContinue && onContinue()
        }}
      >
        Next{' '}
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
