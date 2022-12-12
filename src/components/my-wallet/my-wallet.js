import { useState } from 'react'
import { Button, TextField } from 'react-md'
import depositIcon from './images/deposit.svg'
import withdrawIcon from './images/withdraw.svg'
import committedIcon from './images/committed.svg'
import availableIcon from './images/available.svg'

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
      <div className="my-wallet-title">My Wallet</div>
      <div className="my-wallet-card">
        <div className="my-wallet-card-amount">Total Amount </div>
        <div className="my-wallet-card-currency">
          {balance} {currency?.name}
        </div>
        <div className="my-wallet-card-child">
          <div className="committed">
            <img src={committedIcon} />
            <div>
              <div className="label">Committed</div>
              <div className="value">0{currency?.name}</div>
            </div>
          </div>
          <div className="committed">
            <img src={availableIcon} />
            <div>
              <div className="label">Available</div>
              <div className="value">0 {currency?.name}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-wallet-tab">
        <Button
          className={`my-wallet-tab-btn ${tab === 1 ? 'active' : ''}`}
          onClick={() => setTab(1)}
        >
          <img src={depositIcon} />
          <span>Deposit</span>
        </Button>
        <Button
          className={`my-wallet-tab-btn ${tab === 2 ? 'active' : ''}`}
          onClick={() => setTab(2)}
        >
          <img src={withdrawIcon} />
          <span>withdraw</span>
        </Button>
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

          <div className="payement-label">Payment Method</div>
          <Button
            onClick={() => {
              setType('card')
            }}
            className={`payement-btn ${type === 'card' ? 'blue-border' : ''}`}
          >
            Credit/Debit Card
          </Button>
          <Button
            onClick={() => {
              setType('deposit')
            }}
            className={`payement-btn ${
              type === 'deposit' ? 'blue-border' : ''
            }`}
          >
            Bank Deposit{' '}
          </Button>
          <Button
            onClick={() => {
              setType('wire')
            }}
            className={`payement-btn ${type === 'wire' ? 'blue-border' : ''}`}
          >
            Bank Transfer{' '}
          </Button>
          <div className="note">
            <span className="blue">Note: </span>
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
          <div className="payement-label">Withdraw Amount</div>
          <TextField
            id="auctionTitle"
            placeholder={'Enter Amount'}
            value={amount}
            onChange={(v) => setAmount(v)}
            className="textField-withShadow"
            required
            block
          />
          <div className="error-text">
            Maximum withdraw Amount is 2,500 {currency?.name}
          </div>
        </>
      )}
      <div className="my-wallet-footer">
        <Button raised className="cancel-btn" onClick={(e) => {}}>
          cancel
        </Button>
        <Button
          raised
          primary
          className="confirm-btn"
          onClick={(e) => {
            e.stopPropagation()
            onContinue && onContinue()
          }}
        >
          Next{' '}
        </Button>
      </div>
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
