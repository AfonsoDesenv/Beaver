import { getToken } from 'src/resources/token.js'
import { Loading } from 'quasar'
import axios from 'axios'

export const loadserviceRequest = (id) => {
  return axios.get(`http://localhost:3000/serviceRequest/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadRequestsByService = (id) => {
  return axios.get(`http://localhost:3000/requestsByService/${id}`, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadServiceRequests = (id) => {
  return axios.get('http://localhost:3000/serviceRequests/' + id, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadServiceRequestsUserPerfil = (ids) => {
  return axios.get('http://localhost:3000/serviceRequests/' + ids.service_provider_id + '/' + ids.user_id, {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadServiceRequestsByUser = () => {
  return axios.get('http://localhost:3000/serviceRequestsByUser/', {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadServiceRequestsByProvider = () => {
  return axios.get('http://localhost:3000/serviceRequestsByProvider/', {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadRequestsForRating = () => {
  return axios.get('http://localhost:3000/requestsForRating/', {
    headers: {
      authorization: getToken()
    }
  })
}

export const loadMyRequests = () => {
  return axios.get('http://localhost:3000/myRequests/', {
    headers: {
      authorization: getToken()
    }
  })
}

export const saveServiceRequest = (id) => {
  Loading.show()
  let body = { service_provider_id: id }
  return axios.post('http://localhost:3000/serviceRequests/', body, {
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

export const rateRequest = (payload) => {
  Loading.show()
  let body = {
    rate: payload.rate,
    comment: payload.comment,
    service_request_id: payload.service_request_id
  }
  return axios.post('http://localhost:3000/rateRequest/', body, {
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

export const loadMyRating = () => {
  return axios.get('http://localhost:3000/myRating/', {
    headers: {
      authorization: getToken()
    }
  })
}

export const acceptServiceRequest = (id) => {
  Loading.show()
  let body = { status: 2 }
  return axios.put(`http://localhost:3000/serviceRequests/${id}`, body, {
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

export const refuseServiceRequest = (id) => {
  Loading.show()
  let body = { status: 3 }
  return axios.put(`http://localhost:3000/serviceRequests/${id}`, body, {
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

export const concludeServiceRequest = (id) => {
  Loading.show()
  let body = { status: 4 }
  return axios.put(`http://localhost:3000/serviceRequests/${id}`, body, {
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

export const cancelServiceRequest = (id) => {
  Loading.show()
  let body = { status: 5 }
  return axios.put(`http://localhost:3000/serviceRequests/${id}`, body, {
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
