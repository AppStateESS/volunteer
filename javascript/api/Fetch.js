import axios from 'axios'
import 'regenerator-runtime'

const getList = async (url, options) => {
  try {
    const response = await axios.get(url, {
      params: options,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
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
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    )
    return response
  } catch (error) {
    return false
  }
}

const sendDelete = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
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
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    return response.data
  } catch (error) {
    return false
  }
}

const sendKiosk = async (sponsorId, kioskMode) => {
  const url = `volunteer/Admin/Sponsor/${sponsorId}/kiosk`
  try {
    const response = await axios.patch(
      url,
      {kioskMode},
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    )
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
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    return response
  } catch (error) {
    return false
  }
}

export {getList, sendDelete, getItem, saveSponsor, ajaxPunchOut, sendKiosk}
