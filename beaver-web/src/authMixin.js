import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import socketIo from 'socket.io-client'
import store from 'src/store/store.js'
import { validateToken, getToken } from 'src/resources/token.js'
import { mapState } from 'vuex'
import { Toast } from 'quasar'

export default {
  created () {
    let token = getToken()
    if (token) {
      validateToken()
        .then(response => {
          if (!response.error) {
            if (!this.$socket) {
              Vue.use(VueSocketio, socketIo('http://localhost:3000/', {
                query: `token=${token}`
              }), store)
            }
          }
        })
    }
    else {
      this.$router.push('/SignIn')
    }
  },
  computed: {
    ...mapState({
      authorized: state => state.connectionModule.authorized
    })
  },
  watch: {
    authorized: function () {
      if (!this.authorized) {
        Toast.create('Usuário não autenticado')
        this.$router.push('/SignIn')
      }
    }
  }
}
