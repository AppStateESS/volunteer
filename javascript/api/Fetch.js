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
    return response.data
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

export {getList, sendDelete, getItem}
