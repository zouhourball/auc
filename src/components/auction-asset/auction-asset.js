import Auctions from 'components/auctions'
import Calendar from 'components/calendar'
import { useTranslation } from 'libs/langs'

import './styles.scss'

const AuctionAsset = () => {
  const { t } = useTranslation()

  return (
    <div className="auction-asset">
      <Calendar />
      <div className="auction-asset-title">{t('auction_asset')}</div>
      <div className="auction-asset-subTitle">{t('fill_infos')}</div>
      <Auctions />
    </div>
  )
}
export default AuctionAsset
