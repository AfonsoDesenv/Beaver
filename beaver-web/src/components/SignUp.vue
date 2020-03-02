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
            <input class="full-width" v-model="form.name">
            <label>Nome</label>
          </div>
          <div class="floating-label">
            <input class="full-width" v-model="form.email">
            <label>E-mail</label>
          </div>
          <div class="floating-label">
            <input class="full-width" v-model="form.password" type="password">
            <label>Senha</label>
          </div>
          <div class="full-width" style="padding-top:10px;">
            <button type="submit" class="primary big raised full-width" @click="signUp">Cadastrar</button>
          </div>
        </form>
        <div class="full-width" style=" padding-top: 10px;">
          <button class="primary small outline full-width" v-link=" '/SignIn' ">Entrar</button>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import { PERFORM_SIGNUP } from 'src/store/signUp/signUpActions.js'
import { Toast } from 'quasar'
import { email, required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  computed: mapState({
    signUpState: state => state.signUpModule
  }),
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      email: {
        required, email
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {
    ...mapActions({
      performSignUp: PERFORM_SIGNUP
    }),
    signUp: function () {
      if (!this.$v.form.$invalid) {
        this.performSignUp(this.form).then(response => {
          if (response.success) {
            let $router = this.$router
            $router.push('/SignIn')
            Toast.create.positive({
              html: 'Usuário cadastrado!'
            })
          }
          else {
            Toast.create.negative(`${response.msg}`)
          }
        })
      }
      else {
        if (this.$v.form.name.$invalid) {
          Toast.create.negative('Nome Inválido')
        }
        else {
          if (this.$v.form.email.$invalid) {
            Toast.create.negative('Email Inválido')
          }
          else {
            if (this.$v.form.password.$invalid) {
              Toast.create.negative('Senha Inválida. Utilize pelo menos 8 caracteres!')
            }
          }
        }
      }
    }
  }
}
</script>
