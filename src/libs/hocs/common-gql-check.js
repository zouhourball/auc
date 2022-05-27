/* eslint-disable space-before-function-paren */

import { PureComponent } from 'react'

export default function ({
  endPointName,
  queryName,
  countExtractPath,
  suffix = '',
}) {
  return (Comp) => {
    return class CheckerInjected extends PureComponent {
      getTotalCount = () => {
        const endPoint = this.getEndPoint()

        if (endPoint[queryName]) {
          let dataNode = endPoint[queryName]
          if (countExtractPath) {
            countExtractPath.split('.').forEach((path) => {
              dataNode = dataNode[path]
            })
          }

          return dataNode.totalCount
        } else {
          return undefined
        }
      }

      getEndPoint = () => this.props[endPointName]

      isGraphqlReady = () => {
        const { loading, [queryName]: data } = this.getEndPoint() || {}
        // !!data to make sure we get a boolean and not the actual data, lest users mis-use this endpoint
        return !loading && data
      }

      refetch = async () => {
        const endPoint = this.getEndPoint()
        if (endPoint && endPoint.refetch) {
          await endPoint.refetch()
        }
      }

      fetchMore = (offset, variables) => {
        const endPoint = this.getEndPoint()
        return endPoint.fetchMore({
          variables,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return fetchMoreResult
          },
        })
      }

      render() {
        let props = {
          [`isGraphqlReady${suffix}`]: this.isGraphqlReady,
          [`getEndPoint${suffix}`]: this.getEndPoint,
          [`getTotalCount${suffix}`]: this.getTotalCount,
          [`refetch${suffix}`]: this.refetch,
          [`fetchMore${suffix}`]: this.fetchMore,
          [`endPointName${suffix}`]: endPointName,
          [`queryName${suffix}`]: queryName,
        }

        return <Comp {...this.props} {...props} />
      }
    }
  }
}
