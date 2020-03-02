import { getToken, setToken } from 'src/resources/token.js'
import { Loading } from 'quasar'
import axios from 'axios'

export const signup = (user) => {
  Loading.show()
  return axios.post('http://localhost:3000/users', user, {
    headers: {
      authorization: getToken()
    }
  }).then(response => {
    Loading.hide()
    setToken(response.data.token)
    return response
  }).catch(error => {
    Loading.hide()
    throw error
  })
}

export const loadUser = () => {
  return axios.get('http://localhost:3000/user', {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadUserById = (id) => {
  return axios.get('http://localhost:3000/user/' + id, {
    headers: {
      authorization: getToken()
    }
  })
}

export const saveUser = (user) => {
  Loading.show()
  return axios.put('http://localhost:3000/user', user, {
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

export const removeUser = (payload) => {
  Loading.show()
  return axios.delete('http://localhost:3000/user', {
    data: {
      password: payload.password
    },
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

export const changePassword = (payload) => {
  Loading.show()
  return axios.post('http://localhost:3000/user/change-password', payload, {
    headers: {
      authorization: getToken()
    }
  }).then(response => {
    Loading.hide()
    return response
  }).catch(error => {
    Loading.hide()
    throw error
  })
}

export const uploadPicture = (payload) => {
  Loading.show()
  return axios.post('http://localhost:3000/user/upload-pictures', payload, {
    headers: {
      authorization: getToken()
    }
  }).then(response => {
    Loading.hide()
    return response
  }).catch(error => {
    Loading.hide()
    throw error
  })
}
