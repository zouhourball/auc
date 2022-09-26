import headerBg from 'images/how-it-works-header.png'
import { useTranslation } from 'libs/langs'
import { useState } from 'react'
import { Button, ExpansionList, ExpansionPanel } from 'react-md'
import { questions1, questions2 } from './helper'

import './style.scss'

const HowItWorks = () => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(true)
  return (
    <div className="how-it-works">
      <div className="how-it-works-header">
        <img src={headerBg} className="how-it-works-header-image-bg" />
        <div className="how-it-works-header-title">
          {t('frequently_asked')}        </div>
      </div>
      <div className="how-it-works-body">
        <div className="">
          <div className="tabs-select">
            <Button
              className={selectedTab ? 'active' : 'inactive'}
              onClick={() => setSelectedTab(true)}
            >
              <span>{t('buying')}</span>
            </Button>
            <Button
              className={!selectedTab ? 'active' : 'inactive'}
              onClick={() => setSelectedTab(false)}
            >
              <span>{t('selling')}</span>
            </Button>
          </div>
        </div>
        <div className="">
          <ExpansionList className="expansion-list">
            {(selectedTab ? questions1 : questions2).map((el) => (
              <ExpansionPanel
                key={el.id}
                label={t(`${el.title}`)}
                footer={null}
              >
                <div className="content-description">{t(`${el?.answer}`)}</div>
                {el.subtitles?.map((sub, index) => (
                  <div className="content" key={index}>
                    <div className="content-title">{t(`${sub.label}`)} </div>
                    <div className="content-description">
                      {t(`${sub.value}`)}
                    </div>
                  </div>
                ))}
              </ExpansionPanel>
            ))}
          </ExpansionList>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
