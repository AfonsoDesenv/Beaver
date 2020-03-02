import * as messagesMutations from 'src/store/messages/messagesMutations.js'
import * as messagesActions from 'src/store/messages/messagesActions.js'
import { loadConversations } from 'src/resources/messages.js'

const state = {
  messages: []
}

// getters
const getters = {}

// actions
const actions = {
  [messagesActions.PERFORM_LOAD_MESSAGES] (store) {
    return loadConversations().then(response => {
      let messages = response.data
      store.commit(messagesMutations.LOAD_MESSAGES, {
        messages
      })
      return state.messages
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [messagesActions.CLEAR_STATE] (store) {
    store.commit(messagesMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [messagesMutations.LOAD_MESSAGES] (state, mutationState) {
    var messages = mutationState.messages
    for (var message in messages) {
      let obj = {
        id: messages[message].User.id.toString(),
        name: messages[message].User.name.toString(),
        picture: messages[message].User.picture ? messages[message].User.picture.toString() : '',
        created_at: messages[message].created_at.toString()
      }
      state.messages.push(obj)
    }
  },
  [messagesMutations.CLEAR_STATE] (state, mutationState) {
    state.messages = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
