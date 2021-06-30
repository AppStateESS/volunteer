'use strict'
import dayjs from 'dayjs'
const totalTime = (punch) => {
  if (punch.attended) {
    return 'Attended'
  }
  const inTime = punch.timeIn * 1000
  const outTime = punch.timeOut * 1000
  const date1 = dayjs(inTime)
  if (outTime > 0) {
    const date2 = dayjs(outTime)
    const hours = date2.diff(date1, 'hour')
    const minutes = Math.floor(date2.diff(date1, 'minute') % 60)

    return `${hours} hour(s), ${minutes} minute(s)`
  } else {
    return 'N/A'
  }
}

export default totalTime
