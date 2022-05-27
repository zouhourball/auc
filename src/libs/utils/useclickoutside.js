import { useRef, useEffect } from 'react'

/** custom clickoutside hook */
export function useClickOutside (closeFunc) {
  const node = useRef()
  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      return
    }
    closeFunc(e)
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return node
}
