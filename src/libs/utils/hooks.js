import { useRef, useEffect } from 'react'

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
export const moneyFormat = (labelValue) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? Math.abs(Number(labelValue)) / 1.0e9 + 'B' // Six Zeroes for Millions
    : Math.abs(Number(labelValue)) >= 1.0e6
      ? Math.abs(Number(labelValue)) / 1.0e6 + 'M' // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e3
        ? Math.abs(Number(labelValue)) / 1.0e3 + 'K'
        : Math.abs(Number(labelValue))
}
// const AnchorScroll = Wrapped => {
//   return class AnchorScrollWrapped extends Component {
//     scrollToRef = (ref, refContainer) => {
//       const scrollValue = refContainer ? refContainer.current : window
//       scrollValue.scrollTo({
//         top: ref && ref.current && ref.current.offsetTop,
//         behavior: 'smooth',
//       })
//     }

//     render() {
//       return <Wrapped {...this.props} onScroll={this.scrollToRef} />
//     }
//   }
// }
// export default AnchorScroll
