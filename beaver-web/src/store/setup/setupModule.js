import * as setupMutations from 'src/store/setup/setupMutations.js'
import * as setupActions from 'src/store/setup/setupActions.js'
import { loadUser, saveUser, removeUser, changePassword, uploadPicture } from 'src/resources/user.js'

const state = {
  id: '',
  name: '',
  email: '',
  latitude: 0,
  longitude: 0,
  picture: ''
}

// getters
const getters = {}

// actions
const actions = {
  [setupActions.UPDATE_NAME] (store, e) {
    let name = e.target.value
    store.commit(setupMutations.UPDATE_NAME, {
      name
    })
  },
  [setupActions.UPDATE_EMAIL] (store, e) {
    let email = e.target.value
    store.commit(setupMutations.UPDATE_EMAIL, {
      email
    })
  },
  [setupActions.UPDATE_LOCATION] (store, payload) {
    let latitude = payload.latitude
    let longitude = payload.longitude
    store.commit(setupMutations.UPDATE_LATITUDE, {
      latitude
    })
    store.commit(setupMutations.UPDATE_LONGITUDE, {
      longitude
    })
  },
  [setupActions.UPLOAD_PICTURE] (store, payload) {
    return uploadPicture(payload)
      .then(response => {
        let picture = payload.picture
        store.commit(setupMutations.UPLOAD_PICTURE, {
          picture
        })
      })
  },
  [setupActions.PERFORM_LOAD_USER] (store) {
    return loadUser().then(response => {
      let user = response.data
      store.commit(setupMutations.LOAD_USER, {
        user
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [setupActions.PERFORM_SAVE_USER] (store) {
    let user = {
      name: store.state.name,
      email: store.state.email,
      latitude: store.state.latitude,
      longitude: store.state.longitude
    }
    return saveUser(user).then(response => {
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
  [setupActions.PERFORM_REMOVE_USER] (store, payload) {
    return removeUser(payload).then(response => {
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
  [setupActions.PERFORM_CHANGE_PASSWORD] (store, payload) {
    return changePassword(payload)
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
  [setupActions.CLEAR_STATE] (store) {
    store.commit(setupMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [setupMutations.UPDATE_NAME] (state, mutationState) {
    state.name = mutationState.name
  },
  [setupMutations.UPDATE_EMAIL] (state, mutationState) {
    state.email = mutationState.email
  },
  [setupMutations.UPDATE_LATITUDE] (state, mutationState) {
    state.latitude = mutationState.latitude
  },
  [setupMutations.UPDATE_LONGITUDE] (state, mutationState) {
    state.longitude = mutationState.longitude
  },
  [setupMutations.UPLOAD_PICTURE] (state, mutationState) {
    state.picture = mutationState.picture
  },
  [setupMutations.LOAD_USER] (state, mutationState) {
    state.id = mutationState.user.id
    state.name = mutationState.user.name
    state.email = mutationState.user.email
    state.latitude = mutationState.user.latitude
    state.longitude = mutationState.user.longitude
    state.picture = mutationState.user.picture
  },
  [setupMutations.CLEAR_STATE] (state, mutationState) {
    state.id = 0
    state.name = ''
    state.email = ''
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
