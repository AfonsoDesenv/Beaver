// import * as signUpMutations from 'src/store/signUp/signUpMutations.js'
import * as signUpActions from 'src/store/signUp/signUpActions.js'
import { signup } from 'src/resources/user.js'

const state = {
}

// getters
const getters = {}

// actions
const actions = {
  [signUpActions.PERFORM_SIGNUP] (store, payload) {
    let name = payload.name,
      email = payload.email,
      password = payload.password
    return signup({
      name,
      email,
      password
    }).then(response => {
      return {
        success: true
      }
    }).catch(error => {
      return {
        success: false,
        msg: error.response.data.msg
      }
    })
  }
}

// mutations
const mutations = {

}

export default {
  state,
  getters,
  actions,
  mutations
}
