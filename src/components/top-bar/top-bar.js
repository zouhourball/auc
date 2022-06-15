import { useState } from 'react'
import { cls } from 'reactutils'
import { useSelector } from 'react-redux'
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
import CompanyInfoByOrg from 'components/company-info-by-org'

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
  const orgId = useSelector(({ shell }) => shell?.organizationId)
  // const [sideBarVisible, setSideBarVisible] = useState(false)

  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}
  let avatarLetter = user ? user.match(/\b(\w)/g)?.join('') : null

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
                primaryText={label}
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
            <h2>Logo</h2>
            {/* <img src={ logoWebp} alt="icon" height="40px" /> */}
          </picture>
        </h1>
        <div className="modules">
          <span
            className={cls(
              'modules-item',
              // currentModule === key ? 'active' : '',
            )}
            // onClick={() => {
            //   setSideBarVisible(true)
            // }}
          >
            Auctions
          </span>
          {modulesList &&
            modulesList.length > 0 &&
            modulesList.map(({ label, link, key, linkToNewTab }, i) => {
              return (
                <>
                  {linkToNewTab ? (
                    <Link key={i} to={linkToNewTab}>
                      <span
                        className={cls(
                          'modules-item',
                          currentModule === key ? 'active' : '',
                        )}
                        onClick={() => {
                          onClickModule && onClickModule(key)
                          link && link()
                        }}
                      >
                        {label}
                      </span>
                    </Link>
                  ) : (
                    <span
                      className={cls(
                        'modules-item',
                        currentModule === key ? 'active' : '',
                      )}
                      onClick={() => {
                        onClickModule && onClickModule(key)
                        link && link()
                      }}
                    >
                      {label}
                    </span>
                  )}
                </>
              )
            })}
        </div>
        <div className="top-bar-actions">
          {!logged && (
            <>
              <Button
                flat
                className="login-btn new-user"
                onClick={() => navigate(onClickRegisterUrl)}
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
                        {user}
                      </span>
                    </div>
                    <div className="top-bar-profile-avatar-actions">
                      <p
                        className="top-bar-profile-avatar-actions-link"
                        onClick={() => {
                          navigate('/iskan/individual')
                        }}
                      >
                        {t('tatwir_platform')}
                      </p>
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
                <CompanyInfoByOrg key={orgId} organisationID={orgId}>
                  {(org) => {
                    return (
                      <Avatar
                        src={getPublicUrl(
                          get(org, '0.companyLogo.aPIID', null),
                        )}
                        className="top-bar_avatar"
                      />
                    )
                  }}
                </CompanyInfoByOrg>
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
                onClick={() => navigate(onClickRegisterUrl)}
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
