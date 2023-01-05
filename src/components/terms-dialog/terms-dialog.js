import { useState } from 'react'
import { Button, DialogContainer, Checkbox } from 'react-md'
// import { navigate } from '@reach/router'

// import { payAuction } from 'libs/api/auctions-api'

import { useTranslation } from 'libs/langs'
// import { useMutation } from 'react-query'

import './style.scss'

const TermsDialogContainer = ({
  visible,
  onHide,
  auctionId,
  isPublic,
  onPayAuctionParticipation,
}) => {
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
      {t('cancel')}
    </Button>,
    <Button
      key={2}
      flat
      primary={agree}
      swapTheming={agree}
      disabled={!agree}
      onClick={
        () => onPayAuctionParticipation()
        // isPublic
        //   ? navigate(`auctions/detail/${auctionId}`)
        //   : (window.location.href = `${PRODUCT_APP_URL_API}/auction/api/v1/auctions/${auctionId}/pay?host=${PRODUCT_APP_URL_AUCTION}/auctions/detail/${auctionId}`)
      }
      // redirectToPay()
    >
      {t('proceed')}
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
      title={t('terms_condition')}
    >
      <ul className="conditions-list">
        <li className="item-with-number">{t('first_term')}</li>
        <li>{t('second_term')}</li>
        <li>{t('third_term')}</li>
        <li>{t('fourth_term')}</li>
        <li>{t('fifth_term')}</li>
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
    </DialogContainer>
  )
}
export default TermsDialogContainer
