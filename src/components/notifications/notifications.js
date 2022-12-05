import { Button, FontIcon, TextField } from 'react-md'
import { useMemo, useState } from 'react'
import { useInfiniteQuery, useMutation } from 'react-query'
import moment from 'moment'
import { useCurrentLang, useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'

import {
  getNotifications,
  markAsReadNotifications,
} from 'libs/api/auctions-api'

import NotificationCard from 'components/notification-card'
import FilterBox from 'components/filter-box'

import auctionWon from 'images/auction_won.svg'
import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'
// import sent from 'images/bid_place_successfully.svg'
import clock from 'images/End Soon.svg'
import rejected from 'images/Auction Ended.svg'
import add from 'images/Added New Auction.svg'

import './style.scss'

const Notifications = ({ admin }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()
  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState({})
  const size = 7

  const {
    data: listNotifications,
    refetch: refetchNotifs,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(['', size], getNotifications, {
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length <= Math.ceil(+lastPage?.totalPages / +lastPage?.size)) {
        return pages.length
      }
    },
  })
  const { mutate: markRead } = useMutation(markAsReadNotifications, {
    onSuccess: () => {
      refetchNotifs()
    },
  })

  const filterDateList = [
    { name: t('today'), value: moment().format('YYYY-MM-DD') },
    {
      name: t('yesterday'),
      value: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    {
      name: t('last_7_days'),
      value: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    },
    {
      name: t('last_30_days'),
      value: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    },
  ]
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
  const notifications = listNotifications?.pages?.flatMap(
    (notifList) =>
      notifList?.content?.map((el) => ({
        id: el?.id,
        icon: renderIcon(el?.data?.icon),
        label: lang === 'ar' ? el?.data?.['title_ar'] : el?.title,
        date: moment(el.createdAt).fromNow(),
        withPoint: !el.viewed,
        formattedDate: moment(el.createdAt).format('YYYY-MM-DD'),
        url: el?.data?.url,
      })),
    // {
    //   icon: myActivity,
    //   label:
    //     'You have been successfully registered to participate in auction Lot #123',
    //   date: '23 minutes',
    // },
    // {
    //   icon: auctionWon,
    //   label: 'You have outbid! Auction LOt #124',
    //   date: '23 minutes',
    // },
  )
  // ||  ||
  let beforeMark = filterData?.dateRange?.startDate
    ? moment(filterData?.dateRange?.startDate).format('YYYY-MM-DD')
    : ''
  let afterMark = filterData?.dateRange?.endDate
    ? moment(filterData?.dateRange?.endDate).format('YYYY-MM-DD')
    : ''
  const renderNotification = useMemo(() => {
    return Object.keys(filterData).length
      ? notifications?.filter((el) => {
        return (
            el?.formattedDate >= filterData?.selectedItem ||
            (!filterData?.dateRange?.endDate &&
              filterData?.dateRange?.startDate &&
              el?.formattedDate >= beforeMark) ||
            (!filterData?.dateRange?.startDate &&
              filterData?.dateRange?.endDate &&
              el?.formattedDate <= afterMark) ||
            (el?.formattedDate >= beforeMark && el?.formattedDate < afterMark)
        )
      })
      : search
        ? notifications?.filter((el) => el?.label?.toLowerCase().includes(search))
        : notifications
  }, [filterData, listNotifications, search])
  const onMarkRead = () =>
    Promise.all(
      renderNotification
        ?.filter((el) => el?.withPoint)
        ?.map((el) => markRead({ id: el?.id })),
    ).then((values) => {})
  return (
    <div className="notifications">
      <div className="notifications-title">
        {t('notifications')}{' '}
        <span className="blue-text">({renderNotification?.length})</span>
      </div>
      <div className="notifications-container md-grid">
        {renderNotification?.length > 0 ? (
          <div className="notifications-container-content md-cell md-cell--6">
            {renderNotification?.map((item, index) => {
              return (
                <NotificationCard
                  key={item?.index}
                  icon={item?.icon}
                  label={item?.label}
                  date={item?.date}
                  withPoint={item?.withPoint}
                  cardHandler={() => {
                    item?.withPoint && markRead({ id: item?.id })
                    navigate(item?.url)
                  }}
                />
              )
            })}
            {hasNextPage && renderNotification?.length > 0 && (
              <div className="actions">
                <Button
                  flat
                  swapTheming
                  onClick={() => {
                    fetchNextPage()
                    setFilterData({})
                  }}
                  className="load-more"
                >
                  {t('load_more_notifications')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-notification md-cell md-cell--6 md-grid">
            {t('no_notifications')}
          </div>
        )}
        <div className="notifications-container-filter md-cell md-cell--3">
          <TextField
            id="search_textField"
            className="searchTextField"
            block
            rightIcon={<FontIcon>search</FontIcon>}
            value={search}
            onChange={(v) => {
              setSearch(v)
            }}
            placeholder={t('search_for_notification')}
            fullWidth={false}
          />
          <FilterBox
            items={filterDateList}
            setFilterData={setFilterData}
            filterData={filterData}
          />
          <Button
            flat
            swapTheming
            onClick={() => onMarkRead()}
            className="markAllRead-btn"
          >
            {t('mark_read')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Notifications
