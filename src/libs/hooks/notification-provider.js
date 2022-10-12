import { createContext, useState, useCallback, useEffect } from 'react'

import { connectWebsocket } from 'libs/api/api-chat'

const defaultSend = (e) => {
  // console.log(e, 'newEvent2')
}

const NotifContext = createContext(defaultSend)

export const NotificationProvider = ({ children }) => {
  const [newEvent, setNewEvent] = useState('')
  const handleOnMessage = useCallback((text) => {
    setNewEvent(text)
  }, [])
  // console.log(newEvent, 'newEvent')
  useEffect(() => {
    connectWebsocket(handleOnMessage)
      .then((sendMessage) => {
        // setSendMessage(() => sendMessage);
      })
      .catch(
        (e) => {},
        //  setError(e.message)
      )
  }, [])
  return (
    <NotifContext.Provider value={{ newEvent }}>
      {children}
    </NotifContext.Provider>
  )
}
