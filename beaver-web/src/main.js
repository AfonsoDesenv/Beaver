// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import quasarExtras from 'quasar-extras/material-icons'
import { sync } from 'vuex-router-sync'
import router from './router'
import VueResource from 'vue-resource'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueLocalStorage from 'vue-ls'
import store from './store/store'
import Vuelidate from 'vuelidate'

Vue.use(Quasar)
Vue.use(quasarExtras)
Vue.use(VueResource)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCxmijIO-TfpRehXOtwWVW-vlLW-4eJN2A'
  }
})
Vue.use(VueLocalStorage)
Vue.use(Vuelidate)

sync(store, router)

import moment from 'moment'
moment.locale('pt-BR')

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App'))
  })
})
