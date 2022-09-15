import { useRef, useEffect } from 'react'

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
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
