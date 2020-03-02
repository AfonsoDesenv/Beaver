import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    { path: '/', component: load('Index') },
    { path: '/Search', component: load('Search') },
    { path: '/SignIn', component: load('SignIn') },
    { path: '/SignUp', component: load('SignUp') },
    { path: '/Setup', component: load('Setup') },
    { path: '/Services', component: load('Services') },
    { path: '/Search', component: load('Search') },
    { path: '/Map', component: load('Map') },
    { path: '/Message/:userId', component: load('Message') },
    { path: '/Messages', component: load('Messages') },
    { path: '/UserPerfil/:serviceProviderId/:userId', component: load('UserPerfil') },
    { path: '/ServiceProvider/:serviceProviderId', component: load('ServiceProvider') },
    { path: '/ProviderPerfil/:serviceProviderId', component: load('ProviderPerfil') },
    { path: '/ServiceRequest/:serviceRequestId', component: load('ServiceRequest') },
    { path: '/MyRequests/', component: load('MyRequests') },
    { path: '/Comments/', component: load('Comments') },
    { path: '*', component: load('Error404') }
  ]
})
