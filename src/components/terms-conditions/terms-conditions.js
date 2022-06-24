import { useState } from 'react'

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
    <div className={className}>
      <div className="nav-bar">
        <span onClick={() => setCurrentTab(0)}>Description</span>
        <span onClick={() => setCurrentTab(1)}>Terms of Sale</span>
        <span onClick={() => setCurrentTab(2)}>Disclosure</span>
      </div>
      <div>{renderContent()}</div>
    </div>
  )
}
export default TermsCondition
