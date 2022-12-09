import { DialogContainer, TextField } from 'react-md'

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
      className="confirm-dialog"
      visible={visible}
      onHide={() => onHide()}
      id="payment-details-dialog"
      actions={actions}
    >
      <div className="title">Deposit Amount</div>
      <TextField
        id="deposit-amount"
        placeholder={'Enter Amount'}
        type={'number'}
        value={amount?.value}
        onChange={(value) =>
          setDepositData((prev) => ({
            ...prev,
            amount: {
              ...prev?.amount,
              value: +value,
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
