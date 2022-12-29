import React, { useState } from 'react'

export const IntlContext = React.createContext()
export const ContentContext = React.createContext()
export const PrimeContext = React.createContext()
export const SubModuleContext = React.createContext()
export const ActiveTab = React.createContext()
export const ActiveTabStringProvider = ({ children }) => {
  const [state, setState] = useState(0)

  return (
    <ActiveTab.Provider value={[state, setState]}>
      {children}
    </ActiveTab.Provider>
  )
}
// add comment
