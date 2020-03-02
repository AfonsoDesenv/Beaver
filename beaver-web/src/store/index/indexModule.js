import * as indexMutations from 'src/store/index/indexMutations.js'
import * as indexActions from 'src/store/index/indexActions.js'
import { loadLatestServices } from 'src/resources/serviceProvider.js'
import { loadServiceRequestsByUser, loadServiceRequestsByProvider, loadRequestsForRating, rateRequest, loadMyRating } from 'src/resources/serviceRequest.js'

const state = {
  latestServices: [],
  requestByUser: [],
  requestByProvider: [],
  requestForRating: null,
  myRating: 0
}

// getters
const getters = {}

// actions
const actions = {
  [indexActions.PERFORM_LOAD_LATEST_SERVICES] (store) {
    return loadLatestServices().then(response => {
      let latestServices = response.data
      store.commit(indexMutations.LOAD_LATEST_SERVICES, {
        latestServices
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [indexActions.PERFORM_LOAD_REQUESTS_BY_USER] (store) {
    return loadServiceRequestsByUser().then(response => {
      let requestByUser = response.data
      store.commit(indexMutations.LOAD_REQUESTS_BY_USER, {
        requestByUser
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [indexActions.PERFORM_LOAD_REQUESTS_BY_PROVIDER] (store) {
    return loadServiceRequestsByProvider().then(response => {
      let requestByProvider = response.data
      store.commit(indexMutations.LOAD_REQUESTS_BY_PROVIDER, {
        requestByProvider
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [indexActions.PERFORM_LOAD_REQUESTS_FOR_RATING] (store) {
    return loadRequestsForRating().then(response => {
      let requestForRating = response.data
      store.commit(indexMutations.LOAD_REQUESTS_FOR_RATING, {
        requestForRating
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [indexActions.PERFORM_LOAD_MY_RATING] (store) {
    return loadMyRating().then(response => {
      let myRating = response.data[0] ? response.data[0].average : 0
      store.commit(indexMutations.LOAD_MY_RATING, {
        myRating
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [indexActions.PERFORM_RATE_REQUEST] (store, payload) {
    return rateRequest(payload)
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
  [indexActions.CLEAR_STATE] (store) {
    store.commit(indexMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [indexMutations.LOAD_LATEST_SERVICES] (state, mutationState) {
    state.latestServices = mutationState.latestServices
  },
  [indexMutations.LOAD_REQUESTS_BY_USER] (state, mutationState) {
    state.requestByUser = mutationState.requestByUser
  },
  [indexMutations.LOAD_REQUESTS_BY_PROVIDER] (state, mutationState) {
    state.requestByProvider = mutationState.requestByProvider
  },
  [indexMutations.LOAD_REQUESTS_FOR_RATING] (state, mutationState) {
    state.requestForRating = mutationState.requestForRating
  },
  [indexMutations.LOAD_MY_RATING] (state, mutationState) {
    state.myRating = mutationState.myRating
  },
  [indexMutations.CLEAR_STATE] (state, mutationState) {
    state.latestServices = []
    state.requestByUser = []
    state.requestByProvider = []
    state.requestForRating = null
    state.myRating = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
