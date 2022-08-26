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
          FREQUENTLY ASKED QUESTIONS
        </div>
      </div>
      <div className="how-it-works-body">
        <div className="">
          <div className="tabs-select">
            <Button
              className={selectedTab ? 'active' : 'inactive'}
              onClick={() => setSelectedTab(true)}
            >
              Buying
            </Button>
            <Button
              className={!selectedTab ? 'active' : 'inactive'}
              onClick={() => setSelectedTab(false)}
            >
              Selling
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
                <p className="description">{t(`${el?.answer}`)}</p>
                {el.subtitles?.map((sub, index) => (
                  <div className="subtitle" key={index}>
                    <h4>{t(`${sub.label}`)} </h4>
                    <p>{t(`${sub.value}`)} </p>
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
