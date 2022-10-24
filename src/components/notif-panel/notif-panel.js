import { Button } from 'react-md'
import { navigate } from '@reach/router'
import auctionWon from 'images/auction_won.svg'
import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'
import { useTranslation, useCurrentLang } from 'libs/langs'
import moment from 'moment'
import onClickOutside from 'react-onclickoutside'

// import sent from 'images/bid_place_successfully.svg'
import clock from 'images/End Soon.svg'
import rejected from 'images/Auction Ended.svg'
import add from 'images/Added New Auction.svg'

import './style.scss'

const NotifPanel = ({ notifications, markRead, admin, onHide }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()
  NotifPanel.handleClickOutside = () => onHide()
  const renderIcon = (iconKey) => {
    switch (iconKey) {
      case 'SENT':
        return bidPlace
      case 'APPROVED':
        return bidPlace
      case 'REJECTED':
        return rejected
      case 'AUCTION':
        return myActivity
      case 'TIME':
        return clock
      case 'ADD':
        return add
      case 'AWARD':
        return auctionWon

      default:
        return add
    }
  }
  return (
    <div className="notifPanel">
      {notifications.map((item, index) => {
        return (
          <div
            key={index}
            className="notifPanel-item"
            onClick={() => {
              !item.viewed && markRead(item?.id)
              item?.data?.url
                ? navigate(item?.data?.url)
                : admin
                  ? navigate('/admin/notifications/a')
                  : navigate('/auctions/notifications')
              onHide()
            }}
          >
            <img
              className="notifPanel-item-icon"
              src={renderIcon(item?.data?.icon)}
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
            admin
              ? navigate('/admin/notifications/a')
              : navigate('/auctions/notifications')
            onHide()
          }}
          className="load-more"
        >
          {t('view_all')}{' '}
        </Button>
      </div>
    </div>
  )
}
const clickOutsideConfig = {
  handleClickOutside: () => NotifPanel.handleClickOutside,
}
export default onClickOutside(NotifPanel, clickOutsideConfig)

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
