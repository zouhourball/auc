import moment from 'moment'

export function getUtcDate (date = new Date()) {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth()
  const day = moment(date).format('DD')
  return Date.UTC(year, month, +day)
}
