import { getToken } from 'src/resources/token.js'
import { Loading } from 'quasar'
import axios from 'axios'

export const loadMessages = (id) => {
  return axios.get(`http://localhost:3000/messages/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadConversations = () => {
  return axios.get('http://localhost:3000/conversations', {
    headers: {
      authorization: getToken()
    }
  })
}

export const saveMessage = (message) => {
  Loading.show()
  return axios.post('http://localhost:3000/messages/', message, {
    headers: {
      authorization: getToken()
    }
  })
  .then(response => {
    Loading.hide()
    return response
  })
  .catch(error => {
    Loading.hide()
    throw error
  })
}

export const removeServiceProvider = (id) => {
  Loading.show()
  return axios.delete(`http://localhost:3000/serviceProvider/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
  .then(response => {
    Loading.hide()
    return response
  })
  .catch(error => {
    Loading.hide()
    throw error
  })
}
