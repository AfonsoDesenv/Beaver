import * as messageMutations from 'src/store/message/messageMutations.js'
import * as messageActions from 'src/store/message/messageActions.js'
import { loadMessages, saveMessage } from 'src/resources/messages.js'
import { loadUserById } from 'src/resources/user.js'

const state = {
  messages: [],
  other_user: null
}

// getters
const getters = {}

// actions
const actions = {
  socket_directMessage (store, message) {
    let to = Number(message.to_id),
      from = Number(message.from_id),
      contactId = Number(store.rootState.route.params.userId),
      loggedUserId = Number(store.rootState.setupModule.id)
    if ((to === contactId && from === loggedUserId) ||
      (to === loggedUserId && from === contactId)) {
      store.dispatch(messageActions.PERFORM_LOAD_MESSAGE)
    }
  },
  [messageActions.PERFORM_LOAD_MESSAGE] (store) {
    let id = store.rootState.route.params.userId
    return loadMessages(id).then(response => {
      let messages = response.data
      store.commit(messageMutations.LOAD_MESSAGE, {
        messages
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [messageActions.PERFORM_LOAD_OTHER_USER] (store) {
    var id = store.rootState.route.params.userId
    return loadUserById(id).then(response => {
      let otherUser = response.data
      store.commit(messageMutations.LOAD_OTHER_USER, {
        otherUser
      })
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [messageActions.PERFORM_SAVE_MESSAGE] (store, payload) {
    return saveMessage(payload)
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
  [messageActions.CLEAR_STATE] (store) {
    store.commit(messageMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [messageMutations.LOAD_MESSAGE] (state, mutationState) {
    state.messages = mutationState.messages
  },
  [messageMutations.LOAD_OTHER_USER] (state, mutationState) {
    state.other_user = mutationState.otherUser
  },
  [messageMutations.CLEAR_STATE] (state, mutationState) {
    state.userPicture = ''
    state.serviceProviderPicture = ''
    state.messages = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
