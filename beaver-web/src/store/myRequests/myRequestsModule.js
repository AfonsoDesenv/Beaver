import * as myRequestsMutations from 'src/store/myRequests/myRequestsMutations.js'
import * as myRequestsActions from 'src/store/myRequests/myRequestsActions.js'
import { loadMyRequests } from 'src/resources/serviceRequest.js'

const state = {
  myRequests: []
}

// getters
const getters = {}

// actions
const actions = {
  [myRequestsActions.PERFORM_LOAD_MY_REQUESTS] (store) {
    return loadMyRequests().then(response => {
      let myRequests = response.data
      store.commit(myRequestsMutations.LOAD_MY_REQUESTS, {
        myRequests
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [myRequestsActions.CLEAR_STATE] (store) {
    store.commit(myRequestsMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [myRequestsMutations.LOAD_MY_REQUESTS] (state, mutationState) {
    state.myRequests = mutationState.myRequests
  },
  [myRequestsMutations.CLEAR_STATE] (state, mutationState) {
    state.myRequests = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
