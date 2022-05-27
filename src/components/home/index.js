import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import Auctions from 'components/auctions'

import './style.scss'

const queryClient = new QueryClient()

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="module-container">
        <Router>
          <Redirect from="/" to={`/auctions/home`} noThrow />
          <Auctions path={'/home'} />
        </Router>
      </div>
      <ReactQueryDevtools initialIsOpen={false} position="top-left" />
    </QueryClientProvider>
  )
}
export default Home
