import { format as dateFns } from 'date-fns'
/**
 * @param {Number | Date} timeStamp
 * */
export function format (timeStamp) {
  const date = new Date(timeStamp)
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  } else {
    return dateFns(date, 'DD/MM/YYYY') // TODO
  }
}
