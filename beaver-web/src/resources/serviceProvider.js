import { getToken } from 'src/resources/token.js'
import { Loading } from 'quasar'
import axios from 'axios'

export const loadServiceProvider = (id) => {
  return axios.get(`http://localhost:3000/serviceProvider/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadLatestServices = () => {
  return axios.get(`http://localhost:3000/latestServiceProviders/`, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadMyProviderRating = (id) => {
  return axios.get(`http://localhost:3000/myRating/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
}

export const saveServiceProvider = (serviceProvider) => {
  Loading.show()
  return axios.put(`http://localhost:3000/serviceProvider/${serviceProvider.id}`, serviceProvider, {
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

export const loadImages = (id) => {
  Loading.show()
  return axios.get(`http://localhost:3000/images/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
  .then(response => {
    Loading.hide()
    return response
  }).catch(error => {
    Loading.hide()
    throw error
  })
}

export const uploadImage = (payload) => {
  Loading.show()
  return axios.post('http://localhost:3000/images', payload, {
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

export const removeImage = (id) => {
  Loading.show()
  return axios.delete(`http://localhost:3000/images/${id}`, {
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
