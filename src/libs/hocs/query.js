import React from 'react'
import query from '@target-energysolutions/react-hoc-query'
import { isFunction, camelCase } from 'lodash-es'
function capitalize (name) {
  return name.charAt(0).toUpperCase() + name.substr(1)
}

/**
 *

 *
 * {
 *   [groupName]:{
 *      [apiName]: props => object
 *    }
 * }
 */
export default function queries (option) {
  return (Comp) => {
    let groups = Object.keys(option)
    // [ ['apiOfGroup0','...'], ['apiOfGroup1']]
    let groupedApiNames = groups.map((name) => {
      let group = option[name]
      return Object.keys(group).filter((api) => isFunction(group[api]))
    })

    class Wrapper extends React.PureComponent {
      render () {
        let loading = false
        const errors = []
        for (let i = 0; i < groups.length; i++) {
          let apiNames = groupedApiNames[i]
          for (let name of apiNames) {
            let groupName = groups[i]
            let res = this.props[groupName] && this.props[groupName][name]
            if (res) {
              loading = loading || res.loading
              if ('error' in res) {
                errors.push({
                  group: groupName,
                  apiName: name,
                  error: res.error,
                })
              }
            }
          }
        }
        return <Comp {...this.props} loading={loading} errors={errors} />
      }
    }
    let wraped = Wrapper
    wraped.displayName = Comp.name
    for (let i = 0; i < groups.length; i++) {
      let apiNames = groupedApiNames[i]
      let groupName = groups[i]
      let apis = option[groups[i]]
      for (let api of apiNames) {
        wraped = query({
          group: groupName,
          key: api,
          name: camelCase(camelCase(groupName) + capitalize(camelCase(api))),
          op: apis[api],
        })(wraped)
        // prevent displayName too long
        wraped.displayName = Comp.name
      }
    }
    wraped.displayName = `MQuery(${Comp.name})`
    return wraped
  }
}
