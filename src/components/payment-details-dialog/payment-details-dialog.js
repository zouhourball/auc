import { DialogContainer, TextField } from 'react-md'
import './style.scss'

const PaymentDetailsDialog = ({
  visible,
  onHide,
  depositData,
  setDepositData,
  actions,
}) => {
  const { amount } = depositData
  return (
    <DialogContainer
      className="payment-dialog"
      visible={visible}
      onHide={() => onHide()}
      id="payment-details-dialog"
      actions={actions}
      title={'Deposit Amount'}
    >
      <TextField
        id="deposit-amount"
        placeholder={'Enter Amount'}
        type={'number'}
        value={amount?.value}
        onChange={(t) =>
          setDepositData((prev) => ({
            ...prev,
            amount: {
              ...prev?.amount,
              value:
                t.indexOf('.') >= 0
                  ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 6)
                  : t,
            },
          }))
        }
        className="textField-withShadow"
        required
        block
      />
    </DialogContainer>
  )
}
export default PaymentDetailsDialog
