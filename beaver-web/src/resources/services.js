import { Loading } from 'quasar'
import { getToken } from 'src/resources/token.js'
import axios from 'axios'

export const loadServices = () => {
  return axios.get('http://localhost:3000/services', {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadServiceProviders = () => {
  return axios.get('http://localhost:3000/serviceProviders', {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadServiceProvidersByUserId = (id) => {
  return axios.get('http://localhost:3000/serviceProvidersByUser/' + id, {
    headers: {
      authorization: getToken()
    }
  })
}

export const addServiceProvider = (payload) => {
  Loading.show()
  return axios.post('http://localhost:3000/services/add-service-provider', payload, {
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
