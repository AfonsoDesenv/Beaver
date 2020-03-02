import * as commentsMutations from 'src/store/comments/commentsMutations.js'
import * as commentsActions from 'src/store/comments/commentsActions.js'
import { loadComments } from 'src/resources/ratings.js'

const state = {
  comments: []
}

// getters
const getters = {}

// actions
const actions = {
  [commentsActions.PERFORM_LOAD_COMMENTS] (store) {
    return loadComments().then(response => {
      let comments = response.data
      store.commit(commentsMutations.LOAD_COMMENTS, {
        comments
      })
      return state.services
    }).catch(error => {
      console.info(error)
      throw error
    })
  },
  [commentsActions.CLEAR_STATE] (store) {
    store.commit(commentsMutations.CLEAR_STATE)
  }
}

// mutations
const mutations = {
  [commentsMutations.LOAD_COMMENTS] (state, mutationState) {
    state.comments = mutationState.comments
  },
  [commentsMutations.CLEAR_STATE] (state, mutationState) {
    state.comments = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
