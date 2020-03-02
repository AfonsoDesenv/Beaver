import * as serviceProviderMutations from 'src/store/serviceProvider/serviceProviderMutations.js'
import * as serviceProviderActions from 'src/store/serviceProvider/serviceProviderActions.js'
import { loadServiceProvider, saveServiceProvider, removeServiceProvider, loadMyProviderRating, uploadImage, loadImages, removeImage } from 'src/resources/serviceProvider.js'
import { loadRequestsByService } from 'src/resources/serviceRequest.js'

const state = {
  id: 0,
  service_title: '',
  description: '',
  latitude: 0,
  longitude: 0,
  serviceRequests: [],
  myProviderRating: 0,
  images: []
}

// getters
const getters = {}

// actions
const actions = {
  [serviceProviderActions.UPDATE_DESCRIPTION] (store, e) {
    let description = e.target.value
    store.commit(serviceProviderMutations.UPDATE_DESCRIPTION, {
      description
    })
  },
  [serviceProviderActions.UPDATE_LOCATION] (store, payload) {
    let latitude = payload.latitude
    let longitude = payload.longitude
    store.commit(serviceProviderMutations.UPDATE_LATITUDE, {
      latitude
    })
    store.commit(serviceProviderMutations.UPDATE_LONGITUDE, {
      longitude
    })
  },
  [serviceProviderActions.PERFORM_LOAD_SERVICE_PROVIDER] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadServiceProvider(id).then(response => {
      let serviceProvider = response.data
      store.commit(serviceProviderMutations.LOAD_SERVICE_PROVIDER, {
        serviceProvider
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [serviceProviderActions.PERFORM_LOAD_SERVICE_REQUESTS] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadRequestsByService(id).then(response => {
      let serviceRequests = response.data
      store.commit(serviceProviderMutations.LOAD_SERVICE_REQUESTS, {
        serviceRequests
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [serviceProviderActions.PERFORM_LOAD_PROVIDER_RATING] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadMyProviderRating(id).then(response => {
      let myProviderRating = response.data[0] ? response.data[0].average : '0'
      store.commit(serviceProviderMutations.LOAD_PROVIDER_RATING, {
        myProviderRating
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [serviceProviderActions.PERFORM_SAVE_SERVICE_PROVIDER] (store) {
    let serviceProvider = {
      id: store.state.id,
      description: store.state.description,
      latitude: store.state.latitude,
      longitude: store.state.longitude
    }
    return saveServiceProvider(serviceProvider).then(response => {
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
  [serviceProviderActions.PERFORM_REMOVE_SERVICE_PROVIDER] (store) {
    let id = store.state.id
    return removeServiceProvider(id)
    .then(response => {
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
  [serviceProviderActions.PERFORM_LOAD_IMAGES] (store) {
    let id = store.rootState.route.params.serviceProviderId
    return loadImages(id).then(response => {
      let images = response.data
      store.commit(serviceProviderMutations.LOAD_IMAGES, {
        images
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [serviceProviderActions.PERFORM_UPLOAD_IMAGE] (store, payload) {
    return uploadImage(payload)
      .then(response => {
        let id = store.rootState.route.params.serviceProviderId
        return loadImages(id).then(response => {
          let images = response.data
          store.commit(serviceProviderMutations.LOAD_IMAGES, {
            images
          })
        })
      }).catch(error => {
        return {
          success: false,
          msg: error.response.data.msg
        }
      })
  },
  [serviceProviderActions.PERFORM_REMOVE_IMAGE] (store, id) {
    return removeImage(id)
    .then(response => {
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
  [serviceProviderActions.CLEAR_STATE] (store) {
    store.commit(serviceProviderMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [serviceProviderMutations.UPDATE_ID] (state, mutationState) {
    state.id = mutationState.id
  },
  [serviceProviderMutations.UPDATE_DESCRIPTION] (state, mutationState) {
    state.description = mutationState.description
  },
  [serviceProviderMutations.UPDATE_LATITUDE] (state, mutationState) {
    state.latitude = mutationState.latitude
  },
  [serviceProviderMutations.UPDATE_LONGITUDE] (state, mutationState) {
    state.longitude = mutationState.longitude
  },
  [serviceProviderMutations.LOAD_SERVICE_PROVIDER] (state, mutationState) {
    state.id = mutationState.serviceProvider.id
    state.service_title = mutationState.serviceProvider.Service.title
    state.description = mutationState.serviceProvider.description
    state.latitude = mutationState.serviceProvider.latitude
    state.longitude = mutationState.serviceProvider.longitude
  },
  [serviceProviderMutations.LOAD_SERVICE_REQUESTS] (state, mutationState) {
    state.serviceRequests = mutationState.serviceRequests
  },
  [serviceProviderMutations.LOAD_PROVIDER_RATING] (state, mutationState) {
    state.myProviderRating = mutationState.myProviderRating
  },
  [serviceProviderMutations.LOAD_IMAGES] (state, mutationState) {
    state.images = mutationState.images
  },
  [serviceProviderMutations.CLEAR_STATE] (state, mutationState) {
    state.id = 0
    state.service_title = ''
    state.description = ''
    state.latitude = 0
    state.longitude = 0
    state.myProviderRating = 0
    state.images = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
