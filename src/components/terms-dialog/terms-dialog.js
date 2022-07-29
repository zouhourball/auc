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
      {t('cancel')}
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
        <li>
          {t('part')}
          <ul className="conditions-list-sublist">
            <li>{t('term2')}</li>
            <li>{t('term3')}</li>
            <li>{t('term4')}</li>
            <li>{t('term5')}</li>
          </ul>
        </li>
        <li>{t('part_two')}</li>
        <li>{t('part_three')}</li>
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
