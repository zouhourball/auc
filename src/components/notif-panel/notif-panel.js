import { Button } from 'react-md'
import { navigate } from '@reach/router'
import auctionWon from 'images/auction_won.svg'
import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'
import { useTranslation, useCurrentLang } from 'libs/langs'
import moment from 'moment'

import './style.scss'

const NotifPanel = ({ notifications, markRead }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()
  return (
    <div className="notifPanel">
      {notifications.map((item, index) => {
        return (
          <div
            key={index}
            className="notifPanel-item"
            onClick={() => {
              !item.viewed && markRead(item?.id)
              navigate(item?.data?.url)
            }}
          >
            <img
              className="notifPanel-item-icon"
              src={bidPlace}
              width="20px"
              height="20px"
            />
            <div className="notifPanel-item-data">
              <div className="label">
                {lang === 'ar' ? item?.data?.['title_ar'] : item.title}
              </div>
              <div className="date">{moment(item.createdAt).fromNow()}</div>
            </div>
            <div className="notificationCard-right">
              {!item.viewed && <div className="notifPoint" />}
            </div>
          </div>
        )
      })}
      <div className="notifPanel-action">
        <Button
          flat
          primary
          onClick={() => {
            navigate('/admin/notifications/a')
          }}
          className="load-more"
        >
          {t('view_all')}{' '}
        </Button>
      </div>
    </div>
  )
}

export default NotifPanel

NotifPanel.defaultProps = {
  notifications: [
    {
      icon: bidPlace,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes ago',
      withPoint: true,
    },
    {
      icon: myActivity,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes ago',
      withPoint: true,
    },
    {
      icon: auctionWon,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes ago',
      withPoint: true,
    },
  ],
}
