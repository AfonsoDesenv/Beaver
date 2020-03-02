import * as serviceRequestMutations from 'src/store/serviceRequest/serviceRequestMutations.js'
import * as serviceRequestActions from 'src/store/serviceRequest/serviceRequestActions.js'
import { loadserviceRequest, acceptServiceRequest, refuseServiceRequest, concludeServiceRequest, cancelServiceRequest } from 'src/resources/serviceRequest.js'

const state = {
  id: 0,
  status: 0,
  user_id: 0,
  user_name: '',
  created_at: '',
  updated_at: '',
  service_title: '',
  service_provider_id: 0,
  provider_user_id: 0,
  provider_user_name: ''
}

// getters
const getters = {}

// actions
const actions = {
  [serviceRequestActions.PERFORM_LOAD_SERVICE_REQUEST] (store) {
    let id = store.rootState.route.params.serviceRequestId
    return loadserviceRequest(id).then(response => {
      let serviceRequest = response.data
      store.commit(serviceRequestMutations.LOAD_SERVICE_REQUEST, {
        serviceRequest
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [serviceRequestActions.PERFORM_ACCEPT_SERVICE_REQUEST] (store) {
    return acceptServiceRequest(store.state.id).then(response => {
      return {
        success: true
      }
    }).catch(error => {
      return {
        success: false,
        msg: error.response.data.msg
      }
    })
  },
  [serviceRequestActions.PERFORM_REFUSE_SERVICE_REQUEST] (store) {
    return refuseServiceRequest(store.state.id).then(response => {
      return {
        success: true
      }
    }).catch(error => {
      return {
        success: false,
        msg: error.response.data.msg
      }
    })
  },
  [serviceRequestActions.PERFORM_CONCLUDE_SERVICE_REQUEST] (store) {
    return concludeServiceRequest(store.state.id).then(response => {
      return {
        success: true
      }
    }).catch(error => {
      return {
        success: false,
        msg: error.response.data.msg
      }
    })
  },
  [serviceRequestActions.PERFORM_CANCEL_SERVICE_REQUEST] (store) {
    return cancelServiceRequest(store.state.id).then(response => {
      return {
        success: true
      }
    }).catch(error => {
      return {
        success: false,
        msg: error.response.data.msg
      }
    })
  },
  [serviceRequestActions.CLEAR_STATE] (store) {
    store.commit(serviceRequestMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [serviceRequestMutations.LOAD_SERVICE_REQUEST] (state, mutationState) {
    state.id = mutationState.serviceRequest.id
    state.status = mutationState.serviceRequest.status
    state.created_at = mutationState.serviceRequest.created_at
    state.updated_at = mutationState.serviceRequest.updated_at
    state.user_id = mutationState.serviceRequest.User.id
    state.user_name = mutationState.serviceRequest.User.name
    state.service_title = mutationState.serviceRequest.ServiceProvider.Service.title
    state.service_provider_id = mutationState.serviceRequest.ServiceProvider.id
    state.provider_user_id = mutationState.serviceRequest.ServiceProvider.User.id
    state.provider_user_name = mutationState.serviceRequest.ServiceProvider.User.name
  },
  [serviceRequestMutations.CLEAR_STATE] (state, mutationState) {
    state.id = 0
    state.status = 0
    state.created_at = ''
    state.updated_at = ''
    state.user_id = 0
    state.user_name = ''
    state.service_title = ''
    state.service_provider_id = 0
    state.provider_user_id = 0
    state.provider_user_name = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
