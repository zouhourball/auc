import { Avatar, Button, FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'

import AuctionTimer from 'components/auction-timer'
import TermsCondition from 'components/terms-conditions'
import DocumentsContainer from 'components/docs-dialog'

import { dummyData } from 'components/auctions-public/helper'
import { useState } from 'react'
import { dummyDocs } from 'components/admin-page/helper'

import mailIcon from 'images/mail_gray.svg'
import phoneIcon from 'images/phone_white.svg'

import icon1 from './icons/bedroom.svg'
import icon2 from './icons/bath.svg'
import icon3 from './icons/area.svg'

import './style.scss'

const AuctionDetail = ({
  auctionId,
  isAdmin = true,
  status,
  isActive = false,
}) => {
  const { t } = useTranslation()
  const data = dummyData[0]
  const [docAction, setDocAction] = useState(false)
  const [currentImg, setCurrentImg] = useState(data?.url)
  return (
    <div className="auction-details md-grid md-grid--no-spacing">
      <div className="auction-details-gallery md-cell md-cell--5 md-grid">
        <div className="auction-details-header md-cell md-cell--12">
          <div className="title">{t('auction_detail')}</div>
          <Button
            flat
            primary
            className=""
            iconClassName="mdi mdi-map-marker-outline"
          >
            {t('view_map')}
          </Button>
        </div>

        <img className="gallery-image md-cell md-cell--12" src={currentImg} />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
        <img
          className="gallery-image md-cell md-cell--3"
          onClick={() => setCurrentImg(data?.url)}
          src={data?.url}
        />
      </div>
      <div className="auction-details-info md-cell md-cell--7 md-grid">
        <div className="auction-details-info-header md-cell md-cell--12">
          {isAdmin &&
            (status ? (
              <div>{status}</div>
            ) : (
              <>
                <Button
                  flat
                  primary
                  swapTheming
                  onClick={() => setDocAction(false)}
                  className="auction-details-action"
                >
                  {t('approve')}
                </Button>
                <Button
                  flat
                  secondary
                  swapTheming
                  onClick={() => setDocAction(false)}
                  className="auction-details-action"
                >
                  {t('reject')}
                </Button>
              </>
            ))}
        </div>
        <div className="auction-details-card md-cell md-cell--12">
          <div className="note">Posted 3 days ago</div>
          <div className="title">{data?.name}</div>
          <div className="auction-details-card-details">
            <div className="auction-details-card-details-item">
              <img src={icon1} />3 Bedrooms
            </div>
            <div className="auction-details-card-details-item">
              <img src={icon2} />2 bathrooms
            </div>
            <div className="auction-details-card-details-item">
              <img src={icon3} />
              900 sqm
            </div>
          </div>
        </div>
        {!isActive || isAdmin ? (
          <div className="auction-details-card md-cell md-cell--12">
            <div className="auction-timer-details">
              <div className="auction-timer-info">
                <div>
                  <strong>27th April, 2022</strong>
                </div>
                <div>{t('start_date')}</div>
              </div>
              <div className="sep" />
              <div className="auction-timer-info">
                <div>
                  <strong>1623</strong>
                </div>
                <div>{t('lot_number')}</div>
              </div>
            </div>
            <div className="auction-timer-details">
              <div className="auction-timer-info">
                <div>
                  <strong>22,000 AED</strong>
                </div>
                <div>{t('current_price')}</div>
              </div>
              <div className="sep" />
              <div className="auction-timer-info">
                <div>
                  <strong>1,000 AED</strong>
                </div>
                <div>{t('minimum_incr')}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="md-cell md-cell--12">
              <AuctionTimer
                time={{ days: 0, hours: 0, minutes: 0, secondes: 0 }}
                label={t('current_price')}
                bid={0}
                minIncrement={0}
              />
            </div>
            <div className="auction-details-card center-text md-cell md-cell--6">
              <div>
                <strong>14</strong>
              </div>
              <div>{t('number_bids')}</div>
            </div>
            <div className="auction-details-card center-text md-cell md-cell--6">
              <div>
                <strong>0</strong>
              </div>
              <div>{t('lot_number')}</div>
            </div>
          </>
        )}

        <div className="owner-card md-cell md-cell--12">
          <Avatar className="owner-card-avatar" src={null} />
          <div className="owner-card-info">
            <div>{t('owned_by')}</div>
            <div className="name">Ali Salim</div>
          </div>
          <Button
            floating
            iconEl={<img src={mailIcon} />}
            className="owner-card-btn"
          />
          <Button
            floating
            primary
            iconEl={<img src={phoneIcon} />}
            className="owner-card-btn"
          />
        </div>
        <div className="md-cell md-cell--12">
          {isAdmin ? (
            <Button
              primary
              flat
              swapTheming
              onClick={() => setDocAction(true)}
              className="auction-details-btn"
            >
              {t('documents')}
            </Button>
          ) : isActive ? (
            <Button flat primary swapTheming className="auction-details-btn">
              {t('bid_now')}
            </Button>
          ) : (
            <div className="auction-details-card md-cell md-cell--12">
              <div className="fees-commission-title">{t('fees')}</div>
              <div className="auction-timer-details">
                <div className="auction-timer-info">
                  <div>
                    <strong>12%</strong>
                  </div>
                  <div>{t('buyer')}</div>
                </div>
                <div className="sep" />
                <div className="auction-timer-info">
                  <div>
                    <strong>3%</strong>
                  </div>
                  <div>{t('comission')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <TermsCondition
        description={'description'}
        termOfSale={'terms of sale'}
        disclosure={'Disclosure'}
        className="md-cell md-cell--12"
      />
      <div className="key-features  md-cell md-cell--12">
        <div className="key-features-title">{t('key_features')}</div>
        <div className="key-features-content">
          <div className="key-features-item">
            <FontIcon primary>task_alt</FontIcon> {t('wifi')}
          </div>
          <div className="key-features-item">
            <FontIcon primary>task_alt</FontIcon> {t('pool')}
          </div>
          <div className="key-features-item">
            <FontIcon primary>task_alt</FontIcon> {t('heat')}
          </div>
        </div>
      </div>
      {(isAdmin || isActive) && (
        <div className="fees-commission md-cell md-cell--12">
          <div className="fees-commission-title">{t('fees')}</div>
          <div className="fees-commission-content">
            <div className="fees-commission-item">
              <div>{t('buyer')}</div>
              <div className="value">11%</div>
            </div>
            <div className="fees-commission-item">
              <div>{t('comission')}</div>
              <div className="value">3%</div>
            </div>
          </div>
        </div>
      )}

      {docAction && (
        <DocumentsContainer
          visible={docAction}
          onHide={() => setDocAction(false)}
          data={dummyDocs}
        />
      )}
    </div>
  )
}
export default AuctionDetail
