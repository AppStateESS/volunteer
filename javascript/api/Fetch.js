import axios from 'axios'
import 'regenerator-runtime'

const headers = {'X-Requested-With': 'XMLHttpRequest'}

/** DELETE **/
const sendDelete = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const deletePunch = async (punchId) => {
  const url = `volunteer/Admin/Punch/${punchId}`
  try {
    const response = await axios.delete(url, {headers})
    return response
  } catch (error) {
    return false
  }
}

const deleteVolunteer = async (id) => {
  const url = `./volunteer/Admin/Volunteer/${id}`
  return sendDelete(url)
}

/** GET **/
const getItem = async (role, itemName, id) => {
  const url = `volunteer/${role}/${itemName}/${id}`
  try {
    const response = await axios.get(url, {
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const getList = async (url, options) => {
  try {
    const response = await axios.get(url, {
      params: options,
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const getSponsorReasonIds = async (sponsorId) => {
  const url = `volunteer/Admin/Reason/getSponsorReasonIds?sponsorId=${sponsorId}`
  return getList(url)
}

const getSponsorReasons = async (sponsorId) => {
  const url = `volunteer/User/Reason/?sponsorId=${sponsorId}`
  return getList(url)
}

/** PATCH **/
const sendAttendanceOnly = async (sponsorId, attendanceOnly) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/attendance`
  try {
    const response = await axios.patch(url, {attendanceOnly}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const sendKiosk = async (sponsorId, kioskMode) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/kiosk`
  try {
    const response = await axios.patch(url, {kioskMode}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const sendReasons = async (sponsorId, useReasons) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/useReasons`
  try {
    const response = await axios.patch(url, {useReasons}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const sponsorPreApproved = async (sponsorId, preApproved) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/preApproved`
  try {
    const response = await axios.patch(url, {preApproved}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const swipeVolunteer = async (studentBannerId, sponsorId) => {
  const url = 'volunteer/User/Punch/swipeIn'
  try {
    const response = await axios.get(url, {
      params: {studentBannerId, sponsorId},
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

/** POST **/
const assignReasons = async (sponsorId, matchList) => {
  if (sponsorId === 0) {
    return false
  }
  const method = 'post'
  const url = 'volunteer/Admin/Reason/assign'
  const data = {sponsorId, matchList}
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const clockInReason = async (sponsorId, volunteerId, reasonId) => {
  const method = 'post'
  const url = 'volunteer/User/Punch/clockInReason'
  const data = {sponsorId, volunteerId, reasonId}
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const saveReason = async (reason) => {
  let url = 'volunteer/Admin/Reason'
  let method = 'post'

  if (reason.id > 0) {
    method = 'put'
    url = url + '/' + reason.id
  }

  try {
    const response = await axios({
      method,
      url,
      data: reason,
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const saveSponsor = async (sponsor) => {
  let url = 'volunteer/Admin/Sponsor'
  let method = 'post'

  if (sponsor.id > 0) {
    method = 'put'
    url = url + '/' + sponsor.id
  }

  try {
    const response = await axios({
      method,
      url,
      data: sponsor,
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const sendApproves = async (approvals) => {
  const url = 'volunteer/Admin/Punch/approvalList'
  try {
    const response = await axios.post(url, {approvals}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const updateSetting = async (name, value) => {
  const url = 'volunteer/Admin/Settings'
  try {
    const response = await axios.post(url, {name, value}, {headers})
    return response
  } catch (error) {
    return false
  }
}

/** PUT **/
const ajaxPunchOut = async (punchId) => {
  try {
    const response = await axios.put(
      `volunteer/Admin/Punch/${punchId}/punchOut`,
      {},
      {headers}
    )
    return response
  } catch (error) {
    return false
  }
}

const updatePunch = async (punch) => {
  const url = `volunteer/Admin/Punch/${punch.id}`
  try {
    const response = await axios.put(
      url,
      {timeIn: punch.timeIn, timeOut: punch.timeOut},
      {headers}
    )
    return response
  } catch (error) {
    return false
  }
}

export {
  getList,
  sendDelete,
  getItem,
  saveSponsor,
  saveReason,
  ajaxPunchOut,
  sendKiosk,
  sponsorPreApproved,
  updateSetting,
  sendApproves,
  updatePunch,
  swipeVolunteer,
  deletePunch,
  deleteVolunteer,
  sendAttendanceOnly,
  sendReasons,
  getSponsorReasonIds,
  getSponsorReasons,
  assignReasons,
  clockInReason,
}
