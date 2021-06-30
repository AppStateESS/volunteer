import axios from 'axios'
import 'regenerator-runtime'

const headers = {'X-Requested-With': 'XMLHttpRequest'}

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

const deleteVolunteer = async (id) => {
  const url = `./volunteer/Admin/Volunteer/${id}`
  return sendDelete(url)
}

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

const sponsorPreApproved = async (sponsorId, preApproved) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/preApproved`
  try {
    const response = await axios.patch(url, {preApproved}, {headers})
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

const sendAttendanceOnly = async (sponsorId, attendanceOnly) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/attendance`
  try {
    const response = await axios.patch(url, {attendanceOnly}, {headers})
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

const deletePunch = async (punchId) => {
  const url = `volunteer/Admin/Punch/${punchId}`
  try {
    const response = await axios.delete(url, {headers})
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

export {
  getList,
  sendDelete,
  getItem,
  saveSponsor,
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
}
