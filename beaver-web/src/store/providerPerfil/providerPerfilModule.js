import * as providerPerfilMutations from 'src/store/providerPerfil/providerPerfilMutations.js'
import * as providerPerfilActions from 'src/store/providerPerfil/providerPerfilActions.js'
import { loadServiceProvider, loadImages } from 'src/resources/serviceProvider.js'
import { loadServiceRequests, saveServiceRequest, cancelServiceRequest } from 'src/resources/serviceRequest.js'

const state = {
  id: 0,
  user_id: 0,
  picture: '',
  pictures: [],
  name: '',
  service: '',
  description: '',
  latitude: 0,
  longitude: 0,
  serviceRequests: []
}

// getters
const getters = {}

// actions
const actions = {
  [providerPerfilActions.PERFORM_LOAD_PROVIDER_PERFIL] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadServiceProvider(id).then(response => {
      let providerPerfil = response.data
      store.commit(providerPerfilMutations.LOAD_PROVIDER_PERFIL, {
        providerPerfil
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [providerPerfilActions.PERFORM_LOAD_IMAGES] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadImages(id).then(response => {
      let images = response.data
      store.commit(providerPerfilMutations.LOAD_IMAGES, {
        images
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [providerPerfilActions.PERFORM_LOAD_SERVICE_REQUESTS] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadServiceRequests(id).then(response => {
      let serviceRequests = response.data
      store.commit(providerPerfilMutations.LOAD_SERVICE_REQUESTS, {
        serviceRequests
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [providerPerfilActions.PERFORM_SAVE_SERVICE_REQUEST] (store, id) {
    return saveServiceRequest(id).then(response => {
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
  [providerPerfilActions.PERFORM_CANCEL_SERVICE_REQUEST] (store) {
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
  [providerPerfilActions.CLEAR_STATE] (store) {
    store.commit(providerPerfilMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [providerPerfilMutations.LOAD_PROVIDER_PERFIL] (state, mutationState) {
    state.id = mutationState.providerPerfil.id
    state.user_id = mutationState.providerPerfil.user_id
    state.picture = mutationState.providerPerfil.User.picture
    state.name = mutationState.providerPerfil.User.name
    state.service = mutationState.providerPerfil.Service.title
    state.description = mutationState.providerPerfil.description
    state.latitude = mutationState.providerPerfil.latitude
    state.longitude = mutationState.providerPerfil.longitude
  },
  [providerPerfilMutations.LOAD_IMAGES] (state, mutationState) {
    state.pictures = mutationState.images
  },
  [providerPerfilMutations.LOAD_SERVICE_REQUESTS] (state, mutationState) {
    state.serviceRequests = mutationState.serviceRequests
  },
  [providerPerfilMutations.CLEAR_STATE] (state, mutationState) {
    state.id = 0
    state.user_id = 0
    state.picture = ''
    state.pictures = []
    state.name = ''
    state.service = ''
    state.description = ''
    state.latitude = 0
    state.longitude = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
