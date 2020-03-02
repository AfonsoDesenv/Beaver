import * as servicesMutations from 'src/store/services/servicesMutations.js'
import * as servicesActions from 'src/store/services/servicesActions.js'
import { loadServices, loadServiceProviders, addServiceProvider, loadServiceProvidersByUserId } from 'src/resources/services.js'

const state = {
  services: [],
  serviceProviders: []
}

// getters
const getters = {}

// actions
const actions = {
  [servicesActions.PERFORM_LOAD_SERVICES] (store) {
    return loadServices().then(response => {
      let services = response.data
      store.commit(servicesMutations.LOAD_SERVICES, {
        services
      })
      return state.services
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [servicesActions.PERFORM_LOAD_SERVICE_PROVIDERS] (store) {
    return loadServiceProviders().then(response => {
      let serviceProviders = response.data
      store.commit(servicesMutations.LOAD_SERVICE_PROVIDERS, {
        serviceProviders
      })
      return state.serviceProviders
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [servicesActions.PERFORM_LOAD_SERVICE_PROVIDERS_BY_ID] (store, id) {
    return loadServiceProvidersByUserId(id).then(response => {
      let serviceProviders = response.data
      store.commit(servicesMutations.LOAD_SERVICE_PROVIDERS, {
        serviceProviders
      })
      return state.serviceProviders
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [servicesActions.PERFORM_ADD_SERVICE_PROVIDER] (store, payload) {
    return addServiceProvider(payload)
      .then(() => {
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
  [servicesActions.CLEAR_STATE] (store) {
    store.commit(servicesMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [servicesMutations.LOAD_SERVICES] (state, mutationState) {
    var services = mutationState.services
    for (var service in services) {
      let obj = {label: services[service].title.toString(), value: services[service].title.toString()}
      state.services.push(obj)
    }
  //  state.services = mutationState.services
  },
  [servicesMutations.LOAD_SERVICE_PROVIDERS] (state, mutationState) {
    state.serviceProviders = mutationState.serviceProviders
  },
  [servicesMutations.CLEAR_STATE] (state, mutationState) {
    state.services = []
    state.serviceProviders = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
