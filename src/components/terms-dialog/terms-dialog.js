import { useState } from 'react'
import { Button, DialogContainer, Checkbox } from 'react-md'
import { navigate } from '@reach/router'

// import { payAuction } from 'libs/api/auctions-api'

import { useTranslation } from 'libs/langs'
// import { useMutation } from 'react-query'

import './style.scss'

const TermsDialogContainer = ({ visible, onHide, auctionId, isPublic }) => {
  const [agree, setAgree] = useState(false)
  // const payAuctionMutation = useMutation(payAuction)
  // const redirectToPay = () =>
  //   payAuctionMutation.mutate({
  //     uuid: auctionId,
  //     host: `https://auctions.dev.meeraspace.com/auctions/detail/${auctionId}`,
  //   })
  const { t } = useTranslation()

  const conditionsActions = [
    <Button
      key={1}
      flat
      className="disagree"
      onClick={() => {
        onHide(false)
      }}
    >
      Cancel
    </Button>,
    <Button
      key={2}
      flat
      primary={agree}
      swapTheming={agree}
      disabled={!agree}
      onClick={() => {
        isPublic
          ? navigate(`auctions/detail/${auctionId}`)
          : (window.location.href = `${PRODUCT_APP_URL_API}/auction/api/v1/auctions/${auctionId}/pay?host=${PRODUCT_APP_URL_AUCTION}/auctions/detail/${auctionId}`)
      }}
      // redirectToPay()
    >
      Proceed
    </Button>,
  ]

  return (
    <DialogContainer
      id="conditions-dialog"
      className="conditions-dialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      actions={conditionsActions}
      title={t('terms_&_conditions')}
    >
      <ul className="conditions-list">
        <li>
          To participate in the auction for granting government commercial,
          residential, commercial and industrial lands and investment lands
          using the usufruct right system through public auction, the following
          are required
          <ul className="conditions-list-sublist">
            <li>{t('term2')}</li>
            <li>{t('term3')}</li>
            <li>{t('term4')}</li>
            <li>{t('term5')}</li>
          </ul>
        </li>
        <li>
          Once the auction is closed, the winner (who submitted the highest
          price) must accept the payment of the usufruct value of the square
          meter of the land being auctioned according to the price he submitted
        </li>
        <li>
          The winner will be contacted with the outcome of the auction by text
          message to review the ministry within (10) ten working days from the
          date of the notification to complete the procedures and contract. The
          award and confiscation of the subscription value
        </li>
        <li>{t('condition4')}</li>
        <li>{t('condition5')}</li>
        <li>{t('condition6')}</li>
        <li>{t('condition7')}</li>
        <li>{t('condition8')}</li>
        <li>{t('condition9')}</li>
      </ul>
      <Checkbox
        key={0}
        id="checkbox-read-material-design-spec"
        name="simple-checkboxes[]"
        label={t('i_agree_to_the_terms_and_conditions')}
        checked={agree}
        onChange={(v) => {
          setAgree(v)
        }}
        className="conditions-dialog-checkbox"
      />
      ,
    </DialogContainer>
  )
}
export default TermsDialogContainer
