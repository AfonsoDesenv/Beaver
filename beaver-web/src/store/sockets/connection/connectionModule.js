const state = {
  connected: false,
  authorized: false,
  onlineUsers: []
}

const getters = {}

const actions = {
  socket_connect (store) {
    store.commit('connection_status', {
      connected: true
    })
  },
  socket_disconnect (store) {
    store.commit('connection_status', {
      connected: false
    })
  }
}

const mutations = {
  connection_status (state, mutationState) {
    state.connected = mutationState.connected
  },
  SOCKET_ONLINE_USERS (state, mutationState) {
    state.onlineUsers = mutationState.onlineUsers
  },
  SOCKET_AUTHORIZED (state, mutationState) {
    state.authorized = mutationState.success
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
