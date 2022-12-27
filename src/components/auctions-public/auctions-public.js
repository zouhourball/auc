import { useQuery } from 'react-query'
import { useTranslation } from 'libs/langs'
import { featuredAuctions, listAuction } from 'libs/api/auctions-api'

import HomeSlider from 'components/home-slider'
import UpcomingAuctions from 'components/upcoming-auctions/upcoming-auctions.js'

const AuctionsPublic = ({ logged }) => {
  const { t } = useTranslation()

  const { data: featAuctions } = useQuery(
    ['featuredAuctions', 'Active', 4],
    featuredAuctions,
  )
  const { data: upcomingAuctionsData, refetch } = useQuery(
    [logged ? 'upcomingAuctions' : 'featuredAuctions', 'Upcoming', 5],
    logged ? listAuction : featuredAuctions,
  )

  return (
    <>
      <HomeSlider
        logged={logged}
        auctions={featAuctions?.results}
        defaultNode={
          <>
            <div className="upcoming-auctions-title">{t('auction_market')}</div>
            <div className="upcoming-auctions-separateur" />
            <div
              className="upcoming-auctions-description"
              dangerouslySetInnerHTML={{
                __html: t('browse_auctions'),
              }}
            />
          </>
        }
      />
      <UpcomingAuctions
        cards={upcomingAuctionsData?.results}
        logged={logged}
        refetch={() => refetch()}
      />
    </>
  )
}
export default AuctionsPublic
