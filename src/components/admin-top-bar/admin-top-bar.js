import { cleanUp } from '@target-energysolutions/hoc-oauth'
import { Button, FontIcon, SelectField, MenuButton } from 'react-md'
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
  countNotifications,
} from 'libs/api/auctions-api'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import notifBlue from 'images/Notifications Purple.svg'
import bidPlace from 'images/bid_place_successfully.svg'

const AdminTopBar = ({ modules, currentTab, setCurrentTab }) => {
  const { t } = useTranslation()
  const changeLang = useChangeLanguage()
  const langs = useSupportedLangs()
  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}
  useEffect(() => {
    setCurrentTab(0)
  }, [])
  const { data: notifications, refetch: refetchNotifs } = useQuery(
    ['getNotifications', 3],
    getNotifications,
  )
  const { data: notifNumber, refetch: refetchCount } = useQuery(
    ['getCount'],
    countNotifications,
  )
  const { mutate: markRead } = useMutation(markAsReadNotifications, {
    onSuccess: () => {
      refetchNotifs()
      refetchCount()
    },
  })
  const [newNotif, setNewNotif] = useState('')

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
  return (
    <div className="admin-page-header">
      <div className="admin-page-logo" onClick={() => navigate('/admin')}>
        LEILAM
      </div>
      <div className="admin-page-actions">{renderModules()}</div>
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
        <MenuButton
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
          <img
            className="top-bar-actions-menu-button-notifIcon"
            src={notifBlue}
          />
        </MenuButton>
        {notifNumber > 0 && (
          <span
            className={
              'notif-bull-number whiteNumber' // : 'blueNumber',
            }
          >
            {notifNumber}
          </span>
        )}
      </div>
      {newNotif && (
        <div className="new-notif">
          <img
            className="notifPanel-item-icon"
            src={bidPlace}
            width="20px"
            height="20px"
          />
          <div className="notifPanel-item-data">
            <div className="label">{newNotif.title}</div>
            <div className="date">{moment(newNotif.createdAt).fromNow()}</div>
          </div>
          <div className="notificationCard-right">
            {!newNotif.viewed && <div className="notifPoint" />}
          </div>
        </div>
      )}
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
  )
}
export default AdminTopBar
