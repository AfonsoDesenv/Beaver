import Vue from 'vue'
import Vuex from 'vuex'
import signInModule from 'src/store/signIn/signInModule.js'
import signUpModule from 'src/store/signUp/signUpModule.js'
import indexModule from 'src/store/index/indexModule.js'
import setupModule from 'src/store/setup/setupModule.js'
import servicesModule from 'src/store/services/servicesModule.js'
import serviceProviderModule from 'src/store/serviceProvider/serviceProviderModule.js'
import serviceRequestModule from 'src/store/serviceRequest/serviceRequestModule.js'
import providerPerfilModule from 'src/store/providerPerfil/providerPerfilModule.js'
import userPerfilModule from 'src/store/userPerfil/userPerfilModule.js'
import messagesModule from 'src/store/messages/messagesModule.js'
import messageModule from 'src/store/message/messageModule.js'
import myRequestsModule from 'src/store/myRequests/myRequestsModule.js'
import commentsModule from 'src/store/comments/commentsModule.js'
import connectionModule from 'src/store/sockets/connection/connectionModule.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    signInModule,
    signUpModule,
    indexModule,
    setupModule,
    servicesModule,
    serviceProviderModule,
    serviceRequestModule,
    providerPerfilModule,
    userPerfilModule,
    messagesModule,
    messageModule,
    myRequestsModule,
    commentsModule,
    connectionModule
  }
})
