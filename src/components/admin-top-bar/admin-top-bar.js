import { cleanUp } from '@target-energysolutions/hoc-oauth'
import { Button, FontIcon, SelectField, Badge } from 'react-md'
import NotifPanel from 'components/notif-panel'
import moment from 'moment'
import { navigate } from '@reach/router'
import {
  useTranslation,
  useChangeLanguage,
  useSupportedLangs,
  useCurrentLang,
} from 'libs/langs'
import {
  getNotifications,
  markAsReadNotifications,
  // countNotifications,
} from 'libs/api/auctions-api'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNotificationsContext } from 'libs/hooks/notification-provider'
import './style.scss'

import bidPlace from 'images/bid_place_successfully.svg'

const AdminTopBar = ({
  modules,
  currentTab,
  setCurrentTab,
  notifNumber,
  refetchCount,
}) => {
  const { t } = useTranslation()
  const changeLang = useChangeLanguage()
  const langs = useSupportedLangs()
  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}
  // useEffect(() => {
  // setCurrentTab(0)
  // }, [])
  useEffect(() => {
    const shouldRedirect =
      window.location.pathname.split('/')?.filter((el) => el !== '')?.length > 1
    shouldRedirect && currentTab !== 'other' && navigate('/admin')
  }, [currentTab])
  const { data: notifications, refetch: refetchNotifs } = useQuery(
    ['getNotifications', 3],
    getNotifications,
  )

  const { mutate: markRead } = useMutation(markAsReadNotifications, {
    onSuccess: () => {
      refetchNotifs()
      refetchCount()
    },
  })
  const [newNotif, setNewNotif] = useState('')
  const [visible, setVisible] = useState(false)

  const getActiveLabel = ({ activeLabel }) => {
    if (activeLabel === 'اللغة العربية') {
      return 'عربي'
    } else {
      return activeLabel.slice(0, 3)
    }
  }
  const renderModules = () =>
    modules?.map((el, i) => (
      <Button
        key={i}
        flat
        className={`item ${currentTab === i && 'active'}`}
        onClick={() => setCurrentTab(i)}
      >
        {el?.label}
      </Button>
    ))
  const { newEvent } = useNotificationsContext()
  const refetchNewNotif = (newNotification) => {
    refetchCount()
    refetchNotifs()
    setNewNotif(newNotification)
  }
  useEffect(() => {
    if (newEvent && JSON.parse(newEvent)?.event === 'NOTIFICATION') {
      refetchNewNotif(JSON.parse(newEvent)?.payload?.payload)
    }
  }, [newEvent])
  return (
    <div className="admin-page-header">
      <div className="admin-page-logo" onClick={() => navigate('/admin')}>
        LEILAM
      </div>
      <div className="admin-page-actions">{renderModules()}</div>
      <div className="admin-page-options">
        <SelectField
          id="select-field-3-1"
          menuItems={langs.map(({ key, label }) => {
            if (key === 'ar') {
              return {
                label: 'اللغة العربية',
                value: key,
              }
            }
            return {
              label: label,
              value: key,
            }
          })}
          getActiveLabel={getActiveLabel}
          simplifiedMenu={false}
          onChange={(v) => {
            // location.reload()
            changeLang(v)
          }}
          position={SelectField.Positions.BELOW}
          value={currentLang.key || 'en-US'}
          className="langSelector"
          dropdownIcon={<FontIcon>expand_more</FontIcon>}
        />
        <div className="top-bar-actions-menu-button notif-bull">
          <Badge badgeContent={notifNumber} invisibleOnZero circular>
            <Button
              primary
              onClick={() => {
                setVisible(!visible)
                setNewNotif('')
              }}
              icon
            >
              notifications_none
            </Button>
          </Badge>

          {visible && (
            <div className="notification-panel">
              <NotifPanel
                notifications={notifications?.content || []} // ?.filter(el => el?.sentTo?.sub === currentUser?.mev2?.user?.subject
                markRead={(id) => markRead({ id })}
                admin
                setCurrentTab={setCurrentTab}
                onHide={() => setVisible(false)}
              />
            </div>
          )}
          {/* <MenuButton
          id="menu-button-1"
          onClick={() => setNewNotif('')}
          icon
          menuItems={
            <div className="notification-panel">
              <NotifPanel
                notifications={notifications?.content || []} // ?.filter(el => el?.sentTo?.sub === currentUser?.mev2?.user?.subject
                markRead={(id) => markRead({ id })}
                admin
              />
            </div>
          }
          listInline
          centered
          anchor={{
            x: MenuButton.HorizontalAnchors.CENTER,
            y: MenuButton.VerticalAnchors.CENTER,
          }}
          position={MenuButton.Positions.BOTTOM}
        >
          {notifNumber > 0 && (
            <Badge badgeContent={notifNumber} circular>
              <Button icon>notifications_none</Button>
            </Badge>
          )}
        </MenuButton> */}
          {/* {notifNumber > 0 && (
          <span
            className={
              'notif-bull-number whiteNumber' // : 'blueNumber',
            }
          >
            {notifNumber}
          </span>
        )} */}
          {newNotif && (
            <div
              className="new-notif"
              onClick={() => {
                navigate(newNotif?.data?.url)
                setNewNotif('')
                markRead(newNotif?.id)
              }}
            >
              <img
                className="notifPanel-item-icon"
                src={bidPlace}
                width="20px"
                height="20px"
              />
              <div className="notifPanel-item-data">
                <div className="label">{newNotif.title}</div>
                <div className="date">
                  {moment(newNotif.createdAt).fromNow()}
                </div>
              </div>
              <div className="notificationCard-right">
                {!newNotif.viewed && <div className="notifPoint" />}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => {
            cleanUp()
            navigate('/public/home')
          }}
          flat
          swapTheming
          primary
          className="admin-page-loginBtn"
        >
          {t('log_out')}
        </Button>
      </div>
    </div>
  )
}
export default AdminTopBar
