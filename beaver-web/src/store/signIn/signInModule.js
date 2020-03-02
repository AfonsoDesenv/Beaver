import * as signInMutations from 'src/store/signIn/signInMutations.js'
import * as signInActions from 'src/store/signIn/signInActions.js'
import { signin } from 'src/resources/token.js'

const state = {
  email: '',
  password: '',
  lastSignInStatus: 200
}

// getters
const getters = {}

// actions
const actions = {
  [signInActions.UPDATE_EMAIL] (store, e) {
    let email = e.target.value
    store.commit(signInMutations.UPDATE_EMAIL, {
      email
    })
  },
  [signInActions.UPDATE_PASSWORD] (store, e) {
    let password = e.target.value
    store.commit(signInMutations.UPDATE_PASSWORD, {
      password
    })
  },
  [signInActions.PERFORM_SIGNIN] (store) {
    let email = store.state.email
    let password = store.state.password
    return signin(email, password)
      .then(response => {
        let lastSignInStatus = response.status
        store.commit(signInMutations.LAST_SIGNIN_STATUS, {
          lastSignInStatus
        })
        return true
      })
      .catch(error => {
        let lastSignInStatus = error.response.status
        store.commit(signInMutations.LAST_SIGNIN_STATUS, {
          lastSignInStatus
        })
        return false
      })
  },
  [signInActions.CLEAR_STATE] (store) {
    store.commit(signInMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [signInMutations.UPDATE_EMAIL] (state, mutationState) {
    state.email = mutationState.email
  },
  [signInMutations.UPDATE_PASSWORD] (state, mutationState) {
    state.password = mutationState.password
  },
  [signInMutations.LAST_SIGNIN_STATUS] (state, mutationState) {
    state.lastSignInStatus = mutationState.lastSignInStatus
  },
  [signInMutations.CLEAR_STATE] (state, mutationState) {
    state.email = ''
    state.password = ''
    state.lastSignInStatus = 200
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
