import * as userPerfilMutations from 'src/store/userPerfil/userPerfilMutations.js'
import * as userPerfilActions from 'src/store/userPerfil/userPerfilActions.js'
import { loadUserById } from 'src/resources/user.js'
import { loadServiceRequestsUserPerfil, acceptServiceRequest, refuseServiceRequest, cancelServiceRequest } from 'src/resources/serviceRequest.js'

const state = {
  id: '',
  name: '',
  email: '',
  latitude: 0,
  longitude: 0,
  picture: '',
  serviceRequests: []
}

// getters
const getters = {}

// actions
const actions = {
  [userPerfilActions.PERFORM_LOAD_USER] (store) {
    let id = store.rootState.route.params.userId
    return loadUserById(id).then(response => {
      let user = response.data
      store.commit(userPerfilMutations.LOAD_USER, {
        user
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [userPerfilActions.PERFORM_LOAD_SERVICE_REQUESTS] (store) {
    let ids = {
      service_provider_id: store.rootState.route.params.serviceProviderId,
      user_id: store.rootState.route.params.userId
    }
    return loadServiceRequestsUserPerfil(ids).then(response => {
      let serviceRequests = response.data
      store.commit(userPerfilMutations.LOAD_SERVICE_REQUESTS, {
        serviceRequests
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [userPerfilActions.PERFORM_ACCEPT_SERVICE_REQUEST] (store) {
    return acceptServiceRequest(store.state.serviceRequests[0].id).then(response => {
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
  [userPerfilActions.PERFORM_REFUSE_SERVICE_REQUEST] (store) {
    return refuseServiceRequest(store.state.serviceRequests[0].id).then(response => {
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
  [userPerfilActions.PERFORM_CANCEL_SERVICE_REQUEST] (store) {
    return cancelServiceRequest(store.state.serviceRequests[0].id).then(response => {
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
  [userPerfilActions.CLEAR_STATE] (store) {
    store.commit(userPerfilMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [userPerfilMutations.LOAD_USER] (state, mutationState) {
    state.id = mutationState.user.id
    state.name = mutationState.user.name
    state.email = mutationState.user.email
    state.latitude = mutationState.user.latitude
    state.longitude = mutationState.user.longitude
    state.picture = mutationState.user.picture
  },
  [userPerfilMutations.LOAD_SERVICE_REQUESTS] (state, mutationState) {
    state.serviceRequests = mutationState.serviceRequests
  },
  [userPerfilMutations.CLEAR_STATE] (state, mutationState) {
    state.id = 0
    state.name = ''
    state.email = ''
    state.latitude = 0
    state.longitude = 0
    state.serviceRequests = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
