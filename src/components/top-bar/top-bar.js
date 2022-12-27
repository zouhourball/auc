import { useEffect, useState } from 'react'
import { cls } from 'reactutils'
import { get } from 'lodash-es'
import { useQuery, useMutation } from 'react-query'
import { useQuery as useQueryApollo } from 'react-apollo-hooks'
import signOutEnabled from 'images/sign_out_enable.svg'
import organisationByID from 'libs/queries/organization-by-id.gql'

import {
  // countNotifications,
  getNotifications,
  markAsReadNotifications,
} from 'libs/api/auctions-api'

import { cleanUp } from '@target-energysolutions/hoc-oauth'

import { getPublicUrl } from 'libs/utils/custom-function'

import {
  FontIcon,
  SelectField,
  Button,
  Drawer,
  Toolbar,
  ListItem,
  MenuButton,
  Avatar,
  Badge,
  DialogContainer,
} from 'react-md'
import { Link, navigate } from '@reach/router'
// import meera from './images/meera-logo.svg'
import {
  useTranslation,
  useSupportedLangs,
  useChangeLanguage,
  useCurrentLang,
} from 'libs/langs'
import moment from 'moment'
import { useSelector } from 'react-redux'

import { useNotificationsContext } from 'libs/hooks/notification-provider'
import bidPlace from 'images/bid_place_successfully.svg'

import UserInfoBySubject from 'components/user-info-by-subject'
import NotifPanel from 'components/notif-panel'

import './styles.scss'

const TopBar = ({
  onClickLogo,
  onClickLoginUrl,
  onClickRegisterUrl,
  modulesList,
  className,

  onClickModule,
  logged,
  clear,
  showUpdatePassword,
  broker,
  notifNumber,
  refetchCount,
}) => {
  const { t } = useTranslation()
  const user = useSelector(({ app }) => app?.userInfos)

  const langs = useSupportedLangs()
  const changeLang = useChangeLanguage()
  const [openMenu, setOpenMenu] = useState(false)
  const [signOutDialog, setSignOutdialog] = useState(false)
  const [currentModule, setCurrentModule] = useState('')
  const [newNotif, setNewNotif] = useState('')
  // const [auctionsMenu, setAuctionsMenu] = useState(false)
  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}
  // let avatarLetter = user
  //   ? user?.profile?.fullName.match(/\b(\w)/g)?.join('')
  //   : null
  const modules = location.pathname.split('/').filter((v) => v !== '')
  // const { data: notifNumber, refetch: refetchCount } = useQuery(
  //   ['getCount'],
  //   countNotifications,
  //   {
  //     enabled: logged,
  //   },
  // )
  const { data: organization } = useQueryApollo(organisationByID, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      // skip: !orgId,
    },
    variables: {
      orgId: broker,
    },
  })
  useEffect(() => {
    setTimeout(() => setNewNotif(''), 5000)
  }, [newNotif?.id])
  const { data: notifications, refetch: refetchNotifs } = useQuery(
    ['getNotifications', 3],
    getNotifications,
    {
      enabled: logged,
    },
  )

  const { mutate: markRead } = useMutation(markAsReadNotifications, {
    onSuccess: () => {
      refetchNotifs()
      refetchCount()
    },
  })
  const { newEvent } = useNotificationsContext()
  const [visible, setVisible] = useState(false)
  const refetchNewNotif = (newNotification) => {
    refetchCount()
    refetchNotifs()
    setNewNotif(newNotification)
  }
  // console.log(JSON.parse(newEvent), 'message')
  useEffect(() => {
    if (newEvent && JSON.parse(newEvent)?.event === 'NOTIFICATION') {
      refetchNewNotif(JSON.parse(newEvent)?.payload?.payload)
    }
  }, [newEvent])
  // remove this **Begin**
  // useEffect(() => {
  //   setNewNotif(notifications?.content[0])
  // }, [notifications])
  // remove this **End**
  useEffect(() => {
    if (
      modules?.includes('live-auctions') ||
      modules?.includes('upcoming-auctions')
    ) {
      setCurrentModule('auctions')
    } else if (
      modulesList?.find(
        (el) =>
          el?.linkToNewTab === modules[1] ||
          el?.subMenu?.find((s) => s?.link === modules[1]),
      ) &&
      !(modules.includes('broker') && modules.length > 2)
    ) {
      setCurrentModule(
        modulesList?.find(
          (el) =>
            el?.linkToNewTab === modules[1] ||
            el?.subMenu?.find((s) => s?.link === modules[1]),
        )?.key,
      )
    } else {
      setCurrentModule('')
    }
  }, [modules])
  const getActiveLabel = ({ activeLabel }) => {
    if (activeLabel === 'اللغة العربية') {
      return 'عربي'
    } else {
      return activeLabel.slice(0, 3)
    }
  }
  const inboxListItems = () => {
    return (
      modulesList &&
      modulesList.length > 0 &&
      modulesList.map(({ label, link, key, linkToNewTab }, i) => {
        return (
          <>
            {linkToNewTab ? (
              <ListItem
                key={i}
                primaryText={label}
                onClick={() => {
                  onClickModule && onClickModule(key)

                  link && link()
                  navigate(linkToNewTab)
                }}
                className={cls(
                  'menu-item  md-divider-border md-divider-border--bottom',
                  currentModule === key ? 'active' : '',
                )}
              />
            ) : (
              <ListItem
                primaryText={`${label} list item`}
                onClick={() => {
                  onClickModule && onClickModule(key)
                  link && link()
                }}
                className={cls(
                  'menu-item md-divider-border md-divider-border--bottom',
                  currentModule === key ? 'active' : '',
                )}
              />
            )}
          </>
        )
      })
    )
  }
  return (
    <div className={cls(`top-bar`, clear && 'clear', className)}>
      <div className="top-bar-content">
        <h1
          className={cls(`logo`, onClickLogo && 'clickable')}
          onClick={onClickLogo}
        >
          <picture>
            <span
              onClick={() =>
                logged ? navigate('/auctions/home') : navigate('/public/home')
              }
            >
              LEILAM
            </span>
            {/* <img src={ logoWebp} alt="icon" height="40px" /> */}
          </picture>
        </h1>
        <div className="modules">
          <MenuButton
            id="smart-menu-button-1"
            className={cls(
              'modules-item',
              currentModule === 'auctions' ? 'active' : '',
            )}
            flat
            menuItems={[
              <ListItem
                key={1}
                primaryText={t('live_auctions')}
                onClick={() => {
                  navigate(`/${logged ? 'auctions' : 'public'}/live-auctions`)
                  setCurrentModule('auctions')
                }}
              />,
              <ListItem
                key={2}
                primaryText={t('upcoming_auctions')}
                onClick={() => {
                  navigate(
                    `/${logged ? 'auctions' : 'public'}/upcoming-auctions`,
                  )
                  setCurrentModule('auctions')
                }}
              />,
            ]}
            simplifiedMenu
            repositionOnScroll={false}
            anchor={{
              x: MenuButton.HorizontalAnchors.INNER_LEFT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            position={MenuButton.Positions.BELOW}
          >
            <span className="active-item">{t('auctions')}</span>
          </MenuButton>
          {/* <div>
            <span
              className={cls(
                'modules-item',
                // currentModule === key ? 'active' : '',
              )}
              onClick={() => {
                setAuctionsMenu(true)
              }}
            >
              Auctions
            </span>
            {auctionsMenu && (
              <ul>
                <li onClick={() => navigate('live-auctions')}>Live Auctions</li>
                <li onClick={() => navigate('upcoming-auctions')}>
                  Upcoming Auctions
                </li>
              </ul>
            )}
          </div> */}

          {modulesList &&
            modulesList.length > 0 &&
            modulesList.map(
              ({ label, link, key, linkToNewTab, subMenu }, i) => {
                return (
                  <>
                    {linkToNewTab ? (
                      <Link
                        key={i}
                        to={
                          logged
                            ? `/auctions/${linkToNewTab}`
                            : `/public/${linkToNewTab}`
                        }
                      >
                        <Button
                          className={cls(
                            'modules-item',
                            currentModule === key ? 'active' : '',
                          )}
                          flat
                          onClick={() => {
                            onClickModule && onClickModule(key)
                            link && link()
                            setCurrentModule(key)
                          }}
                        >
                          <span className="active-item">{label}</span>
                        </Button>
                      </Link>
                    ) : (
                      <MenuButton
                        className={cls(
                          'modules-item',
                          currentModule === key ? 'active' : '',
                        )}
                        flat
                        menuItems={subMenu?.map((el) => (
                          <ListItem
                            key={1}
                            primaryText={el?.label}
                            onClick={() => {
                              navigate(
                                logged
                                  ? `/auctions/${el?.link}`
                                  : `/public/${el?.link}`,
                              )
                              setCurrentModule(key)
                            }}
                          />
                        ))}
                        simplifiedMenu
                        repositionOnScroll={false}
                        anchor={{
                          x: MenuButton.HorizontalAnchors.INNER_LEFT,
                          y: MenuButton.VerticalAnchors.BOTTOM,
                        }}
                        position={MenuButton.Positions.BELOW}
                      >
                        <span className="active-item">{label}</span>
                      </MenuButton>
                    )}
                  </>
                )
              },
            )}
        </div>
        <div className="top-bar-actions">
          {!logged && (
            <>
              <Button
                flat
                className="login-btn new-user"
                onClick={() => navigate('/registration')}
              >
                {t('register')}
              </Button>
              <Button
                flat
                className="login-btn"
                primary
                swapTheming
                onClick={() => onClickLoginUrl && onClickLoginUrl()}
              >
                {t('login')}
              </Button>
            </>
          )}
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
            position={SelectField.Positions.TOP_RIGHT}
            anchor={{
              x: SelectField.HorizontalAnchors.INNER_RIGHT,
              y: SelectField.VerticalAnchors.TOP,
            }}
            value={currentLang.key || 'en-US'}
            className="langSelector"
            dropdownIcon={<FontIcon>expand_more</FontIcon>}
          />
          {logged && (
            <div className="top-bar-actions-menu-button notif-bull">
              <Badge
                className={cls(
                  `notif-icon`,
                  clear ? 'white' : 'blue',
                  className,
                )}
                badgeContent={
                  ['string', 'number'].includes(typeof notifNumber)
                    ? notifNumber
                    : ''
                }
                invisibleOnZero
                circular
              >
                <Button
                  primary={!clear}
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
                    onHide={() => setVisible(false)}
                  />
                </div>
              )}
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
          )}

          {logged && (
            <div className="top-bar-actions-menu-button">
              <MenuButton
                id="menu-button-2"
                className="top-bar-menu"
                icon
                menuItems={[
                  {
                    primaryText: t('my_profile'),
                    onClick: () =>
                      broker
                        ? navigate('/auctions/company-profile/' + broker)
                        : navigate('/auctions/profile'),
                  },
                  {
                    primaryText: t('sign_out'),
                    className: 'top-bar-profile-avatar-actions-sign-out',
                    onClick: () => {
                      setSignOutdialog(true)
                    },
                  },
                ]}
                position={SelectField.Positions.TOP_RIGHT}
                anchor={{
                  x: SelectField.HorizontalAnchors.INNER_RIGHT,
                  y: SelectField.VerticalAnchors.BOTTOM,
                }}
              >
                {broker ? (
                  <Avatar
                    src={getPublicUrl(
                      organization?.companyByOrganisationID?.companyLogo?.aPIID,
                    )}
                  />
                ) : (
                  <UserInfoBySubject
                    key={user?.subject}
                    subject={user?.subject}
                  >
                    {(res) => {
                      return (
                        <Avatar
                          src={
                            get(res, 'photo.aPIURL', null)
                              ? getPublicUrl(res?.photo?.aPIURL)
                              : null
                          }
                        >
                          {get(res, 'photo.aPIURL', null)
                            ? null
                            : get(res, 'fullName.0', '')}
                        </Avatar>
                      )
                    }}
                  </UserInfoBySubject>
                )}
              </MenuButton>
            </div>
          )}
          <Button
            icon
            className="drawer-btn"
            onClick={() => {
              setOpenMenu(true)
            }}
          >
            {t('menu')}
          </Button>
        </div>

        <Drawer
          id="simple-drawer-example"
          type={Drawer.DrawerTypes.TEMPORARY}
          className="mobileMenu"
          visible={openMenu}
          position={
            localStorage.getItem('language') === 'ar' ? 'left' : 'right'
          }
          onVisibilityChange={() => {
            setOpenMenu(!openMenu)
          }}
          navItems={inboxListItems()}
          header={
            <Toolbar
              actions={
                <Button
                  icon
                  onClick={() => {
                    setOpenMenu(false)
                  }}
                >
                  {t('close')}
                </Button>
              }
            />
          }
          overlay={false}
        >
          {!logged && (
            <div className="btnWrapper">
              <Button
                flat
                className="login-btn new-user"
                onClick={() => onClickRegisterUrl && onClickRegisterUrl()}
              >
                {t('register')}
              </Button>
              <Button
                flat
                className="login-btn"
                onClick={() => navigate(onClickLoginUrl)}
              >
                {t('sign_in')}
              </Button>
            </div>
          )}
        </Drawer>
      </div>
      {signOutDialog && (
        <DialogContainer
          visible={signOutDialog}
          dialogClassName="sign-out-dialog"
          focusOnMount={false}
          onHide={() => setSignOutdialog(false)}
          portal={true}
          lastChild={true}
          disableScrollLocking={true}
          renderNode={document.body}
          actions={[
            <Button key={'2'} flat onClick={() => setSignOutdialog(false)}>
              {t('cancel')}
            </Button>,
            <Button
              key={'3'}
              flat
              primary
              swapTheming
              onClick={() => {
                cleanUp()
                navigate('/public/home')
              }}
            >
              {t('confirm')}
            </Button>,
          ]}
        >
          <div style={{ margin: '8px auto', textAlign: 'center' }}>
            <img
              src={signOutEnabled}
              width={50}
              height={50}
              className="success-image"
            />
          </div>
          <h2>{t('are_you_sure')}</h2>
        </DialogContainer>
      )}
    </div>
  )
}

export default TopBar
