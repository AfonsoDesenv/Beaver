<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <center>Beaver</center>
      </q-toolbar-title>
    </div>
    <div class="layout-padding full-width">
      <div class="gutter sm-column" style="max-width: 600p;">
        <form>
          <div class="floating-label">
            <input required class="full-width" :value="signInState.email" @change="updateEmail" :class="{'has-error' : signInState.lastSignInnStatus === 401}" >
            <label>E-mail</label>
          </div>
          <div class="floating-label">
            <input required class="full-width" type="password" :value="signInState.password" @change="updatePassword" :class="{'has-error' : signInState.lastSignInnStatus === 401}">
            <label>Senha</label>
          </div>
          <div class="full-width">
            <button type="submit" class="primary big raised full-width" @click="login">Entrar</button>
          </div>
        </form>
        <center>
          <div class="full-width" style=" padding-top: 10px;">
            <button class="primary small outline full-width" v-link=" '/SignUp' ">Cadastrar</button>
          </div>
        </center>
      </div>
    </div>
  </q-layout>
</template>

<script>

import { Toast } from 'quasar'
import { mapActions, mapState } from 'vuex'
import { UPDATE_EMAIL, UPDATE_PASSWORD, PERFORM_SIGNIN, CLEAR_STATE } from 'src/store/signIn/signInActions.js'

export default {
  computed: mapState({
    signInState: state => state.signInModule
  }),
  created () {
    this.clearState()
  },
  methods: {
    ...mapActions({
      updateEmail: UPDATE_EMAIL,
      updatePassword: UPDATE_PASSWORD,
      performSignIn: PERFORM_SIGNIN,
      clearState: CLEAR_STATE
    }),
    login: function () {
      this.performSignIn().then(isLogged => {
        if (isLogged) {
          this.$router.push('/')
        }
        else {
          Toast.create.negative('Não foi possível se conectar!')
        }
      })
    }
  }
}
</script>
