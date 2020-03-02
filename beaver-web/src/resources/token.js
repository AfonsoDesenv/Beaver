import { LocalStorage, Loading } from 'quasar'
import axios from 'axios'

const TOKEN_NAME = 'token'

export const validateToken = () => {
  return axios.get('http://localhost:3000/token/validate', {
    headers: {
      authorization: getToken()
    }
  })
  .catch(error => {
    clearToken()
    return {
      error
    }
  })
}

export const signin = (email, password) => {
  Loading.show()
  return axios.post('http://localhost:3000/token', {
    email,
    password
  })
  .then(response => {
    Loading.hide()
    setToken(response.data.token)
    return response
  })
  .catch(e => {
    Loading.hide()
    clearToken()
    throw e
  })
}

export const logout = () => {
  clearToken()
}

export const getToken = () => {
  return LocalStorage.get.item(TOKEN_NAME)
}

export const setToken = (token) => {
  LocalStorage.set(TOKEN_NAME, `JWT ${token}`)
}

export const clearToken = () => {
  LocalStorage.remove(TOKEN_NAME)
}
