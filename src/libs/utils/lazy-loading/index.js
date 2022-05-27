import { memo, lazy, Suspense } from 'react'

import Loading from 'components/loading'

const defaultOptions = {
  LoadingIndicator: Loading,
}

const lazyLoad = (DynamicImportedComponent, options = {}) => {
  const opt = {
    ...defaultOptions,
    ...options,
  }

  const LazyComponent = lazy(DynamicImportedComponent)

  const { LoadingIndicator } = opt

  // eslint-disable-next-line react/display-name
  return memo((props) => (
    <Suspense fallback={<LoadingIndicator />}>
      <LazyComponent {...props} />
    </Suspense>
  ))
}

export default lazyLoad
