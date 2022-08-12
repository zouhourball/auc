import headerBg from 'images/how-it-works-header.png'
import { useState } from 'react'
import { Button, ExpansionList, ExpansionPanel } from 'react-md'

import './style.scss'
const HowItWorks = () => {
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
              <ExpansionPanel key={el.id} label={el.title} footer={null}>
                <div className="subtitle">{el?.subtitle}</div>
                <p className="description">{el?.answer}</p>
              </ExpansionPanel>
            ))}
          </ExpansionList>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks

const questions1 = [
  {
    id: '1',
    title: 'Are you a buyer willing to buy?',
    subtitle: 'Registration',
    answer:
      'Before participating in any auction you will have to register to be a bidder. ' +
      'Bidders will have to provide their full name, email, and phone number. ' +
      'After registration bidders will directly be considered approved to participate in any auction.',
  },
  {
    id: '2',
    title: 'Who are certifiers to you?',
    subtitle: 'Registration',
    answer:
      'Before participating in any auction you will have to register to be a bidder. ' +
      'Bidders will have to provide their full name, email, and phone number. ' +
      'After registration bidders will directly be considered approved to participate in any auction.',
  },
  {
    id: '3',
    title: 'How can a bidder lose an auction?',
    subtitle: 'Registration',
    answer:
      'Before participating in any auction you will have to register to be a bidder. ' +
      'Bidders will have to provide their full name, email, and phone number. ' +
      'After registration bidders will directly be considered approved to participate in any auction.',
  },
]
const questions2 = [
  {
    id: '4',
    title: 'Are you a property owner willing to sell?',
    subtitle: 'Registration',
    answer:
      'No, registration will be required from property owners to participate in this platform. ' +
      'Owners will have to contact license brokers to list their auctions. Brokers must be approved ' +
      'and registered in the platform and will be fully responsible to all the details they will upload in the platform.',
  },
  {
    id: '5',
    title: 'Who are certifiers to you?',
    subtitle: 'Registration',
    answer:
      'Before participating in any auction you will have to register to be a bidder. ' +
      'Bidders will have to provide their full name, email, and phone number. ' +
      'After registration bidders will directly be considered approved to participate in any auction.',
  },
  {
    id: '6',
    title: 'what is the reserve price amount?',
    subtitle: 'Registration',
    answer:
      'Before participating in any auction you will have to register to be a bidder. ' +
      'Bidders will have to provide their full name, email, and phone number. ' +
      'After registration bidders will directly be considered approved to participate in any auction.',
  },
]
