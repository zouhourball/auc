import { useState } from 'react'
import { cls } from 'reactutils'
import { get } from 'lodash-es'

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
} from 'react-md'
import { Link, navigate } from '@reach/router'
// import meera from './images/meera-logo.svg'
import {
  useTranslation,
  useSupportedLangs,
  useChangeLanguage,
  useCurrentLang,
} from 'libs/langs'

import './styles.scss'
import UserInfoBySubject from 'components/user-info-by-subject'

const TopBar = ({
  onClickLogo,
  onClickLoginUrl,
  onClickRegisterUrl,
  modulesList,
  className,
  currentModule,
  onClickModule,
  logged,
  clear,
  showUpdatePassword,
  user,
}) => {
  const { t } = useTranslation()
  const langs = useSupportedLangs()
  const changeLang = useChangeLanguage()
  const [openMenu, setOpenMenu] = useState(false)
  // const [auctionsMenu, setAuctionsMenu] = useState(false)

  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}
  let avatarLetter = user
    ? user?.profile?.fullName.match(/\b(\w)/g)?.join('')
    : null

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
            <span>Logo</span>
            {/* <img src={ logoWebp} alt="icon" height="40px" /> */}
          </picture>
        </h1>
        <div className="modules">
          <MenuButton
            id="smart-menu-button-1"
            className={cls(
              'modules-item',
              // currentModule === key ? 'active' : '',
            )}
            flat
            menuItems={[
              <ListItem
                key={1}
                primaryText="Live Auctions"
                onClick={() =>
                  navigate(`/${logged ? 'auctions' : 'public'}/live-auctions`)
                }
              />,
              <ListItem
                key={2}
                primaryText="upcoming-auctions"
                onClick={() =>
                  navigate(
                    `/${logged ? 'auctions' : 'public'}/upcoming-auctions`,
                  )
                }
              />,
            ]}
            simplifiedMenu={false}
            repositionOnScroll={false}
            anchor={{
              x: MenuButton.HorizontalAnchors.INNER_RIGHT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            position={MenuButton.Positions.BELOW}
          >
            Auctions
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
                      <Link key={i} to={linkToNewTab}>
                        <Button
                          className={cls(
                            'modules-item',
                            currentModule === key ? 'active' : '',
                          )}
                          flat
                          onClick={() => {
                            onClickModule && onClickModule(key)
                            link && link()
                          }}
                        >
                          {label}
                        </Button>
                      </Link>
                    ) : (
                      <MenuButton
                        className={cls(
                          'modules-item',
                          // currentModule === key ? 'active' : '',
                        )}
                        flat
                        menuItems={subMenu?.map((el) => (
                          <ListItem
                            key={1}
                            primaryText={el?.label}
                            onClick={() => navigate(`${el?.link}`)}
                          />
                        ))}
                        simplifiedMenu={false}
                        repositionOnScroll={false}
                        anchor={{
                          x: MenuButton.HorizontalAnchors.INNER_RIGHT,
                          y: MenuButton.VerticalAnchors.BOTTOM,
                        }}
                        position={MenuButton.Positions.BELOW}
                      >
                        {label}
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
                onClick={() => onClickRegisterUrl && onClickRegisterUrl()}
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
            position={SelectField.Positions.BELOW}
            value={currentLang.key || 'en-US'}
            className="langSelector"
            dropdownIcon={<FontIcon>expand_more</FontIcon>}
          />
          {logged && (
            <div className="top-bar-actions-menu-button">
              <MenuButton
                id="menu-button-2"
                className="top-bar-menu"
                icon
                menuItems={
                  <div className="top-bar-menu-items">
                    <div className="d-flex top-bar-profile-avatar-infos">
                      <span className="top-bar-profile-avatar">
                        {avatarLetter}
                      </span>
                      <span className="top-bar-profile-avatar-name">
                        {user?.profile?.fullName}
                      </span>
                    </div>
                    <div className="top-bar-profile-avatar-actions">
                      {/* <p
                        className="top-bar-profile-avatar-actions-link"
                        onClick={() => {
                          navigate('/iskan/individual')
                        }}
                      >
                        {t('tatwir_platform')}
                      </p> */}
                      <p
                        className="top-bar-profile-avatar-actions-sign-out"
                        onClick={() => {
                          cleanUp()
                          navigate('/public/home')
                        }}
                      >
                        {t('sign_out')}
                      </p>
                    </div>
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
                <UserInfoBySubject key={user?.subject} subject={user?.subject}>
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
            menu
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
                  close
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
                {t('new_user')}
              </Button>
              <Button
                flat
                className="login-btn"
                onClick={() => navigate(onClickLoginUrl)}
              >
                {t('sign-in')}
              </Button>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  )
}

export default TopBar
