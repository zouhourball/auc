import { useState } from 'react'

import './style.scss'

const TermsCondition = ({ description, termOfSale, disclosure, className }) => {
  const [currentTab, setCurrentTab] = useState(0)
  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return termOfSale
      case 2:
        return disclosure
      default:
        return description
    }
  }
  return (
    <div className={`terms-condition ${className}`}>
      <div className="terms-condition-nav-bar">
        <div
          className={currentTab === 0 ? 'active' : ''}
          onClick={() => setCurrentTab(0)}
        >
          Description
        </div>
        <div
          className={currentTab === 1 ? 'active' : ''}
          onClick={() => setCurrentTab(1)}
        >
          Terms of Sale
        </div>
        <div
          className={currentTab === 2 ? 'active' : ''}
          onClick={() => setCurrentTab(2)}
        >
          Disclosure
        </div>
      </div>
      <div className="terms-condition-content">{renderContent()}</div>
    </div>
  )
}
export default TermsCondition
