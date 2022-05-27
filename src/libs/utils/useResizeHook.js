import { useCallback, useEffect } from 'react'

const useResizeHook = (
  ratioStep = 23,
  onStopResizeCallBack = () => {},
  identifier,
  containerId,
) => {
  var pageX,
    curCol,
    curColWidth,
    diffX,
    currentPosVal,
    curColWidthOriginal,
    data

  useEffect(() => {
    curCol = undefined
    pageX = undefined
    curColWidth = undefined
    currentPosVal = undefined
  }, [identifier])

  const onResize = (e) => {
    if (curCol) {
      diffX = e.pageX - pageX
      if (curColWidth + diffX > 0) {
        curCol.style.width = curColWidth + diffX + 'px'
      }
    }
  }

  const onStopResize = useCallback(
    (e) => {
      document.removeEventListener('mousemove', onResize, false)
      document.removeEventListener('mouseup', onStopResize, false)
      const container = document.getElementById(containerId)
      const movePercentage =
        (100 * diffX) / container.getBoundingClientRect().width
      const band = Math.round(movePercentage / ratioStep)
      curCol.style.width = curColWidthOriginal + band * ratioStep + '%'

      onStopResizeCallBack(band, data)

      curCol = undefined
      pageX = undefined
      curColWidth = undefined
      currentPosVal = undefined
    },
    [onResize, currentPosVal, curColWidth, diffX, identifier],
  )

  const onPressResize = useCallback(
    (e, i, elemData) => {
      document.addEventListener('mousemove', onResize, false)
      document.addEventListener('mouseup', onStopResize, false)
      curCol = document.getElementsByClassName(`${identifier}-${i}`)[0]
      currentPosVal = i
      pageX = e.pageX
      data = elemData
      curColWidth = curCol.getBoundingClientRect().width
      curColWidthOriginal = +curCol.style.width.replace('%', '')
    },
    [onResize, onStopResize, identifier],
  )
  return { onPressResize }
}

export default useResizeHook
