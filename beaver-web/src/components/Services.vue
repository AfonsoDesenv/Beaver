<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.sideMenu.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Serviços
      </q-toolbar-title>
    </div>

    <sideMenu ref="sideMenu"></sideMenu>
    <topTab slot="header"></topTab>
    <div class="layout-view full-width">
      <div class="list">
        <template v-for="(serviceProvider, index) in servicesState.serviceProviders">
            <div class="item">
                <div class="item-content has-secondary" @click="goToServiceProvider(serviceProvider.id)">
                    {{serviceProvider.Service.title}}
                </div>
            </div>
            <hr>
        </template>
      </div>
    </div>
    <button class="primary circular" style="position: absolute; bottom: 10px; right: 10px;" @click="$refs.minimizedModal.open()">
      <i>add</i>
    </button>
    <q-modal ref="minimizedModal" class="minimized" :content-css="{padding: '15px'}">
      <form>
        <h5>Deseja cadastrar novo serviço?</h5>
        <div class="floating-label">
          <q-autocomplete v-model="serviceTitle" :delay="0" @search="search" :max-results="5">
            <input required v-model="serviceTitle" class="full-width"/>
            <label>Serviço</label>
          </q-autocomplete>
        </div>
        <div class="full-width" style=" padding-top: 10px;">
          <center>
            <button class="red" style="margin: 5px;" @click="$refs.minimizedModal.close()">Cancelar</button>
            <button class="primary" style="margin: 5px;" type="submit" @click="addService" >Adic. Serviço</button>
          </center>
        </div>
      </form>
    </q-modal>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import topTab from 'src/components/TopTab.vue'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_SERVICES, PERFORM_LOAD_SERVICE_PROVIDERS, PERFORM_ADD_SERVICE_PROVIDER, CLEAR_STATE } from 'src/store/services/servicesActions.js'
import { Utils, Toast } from 'quasar'

export default {
  components: {
    sideMenu,
    topTab
  },
  computed: mapState({
    servicesState: state => state.servicesModule
  }),
  data () {
    return {
      serviceTitles: [],
      serviceTitle: ''
    }
  },
  created () {
    this.clearState()
    this.performLoadServices()
    .then((response) => {
      this.serviceTitles = response
    })
    this.performLoadServiceProviders()
  },
  methods: {
    ...mapActions({
      performLoadServices: PERFORM_LOAD_SERVICES,
      performLoadServiceProviders: PERFORM_LOAD_SERVICE_PROVIDERS,
      performAddServiceProvider: PERFORM_ADD_SERVICE_PROVIDER,
      clearState: CLEAR_STATE
    }),
    addService: function (e) {
      let payload = { title: this.serviceTitle }
      this.performAddServiceProvider(payload)
      .then(response => {
        this.serviceTitle = ''
        this.$refs.minimizedModal.close()
        this.performLoadServiceProviders()
        if (response.success) {
          Toast.create.positive({
            html: 'Serviço criado com sucesso!'
          })
        }
        else {
          Toast.create.negative(`Falha ao criar serviço, ${response.msg}`)
        }
      })
      .catch(e => {
        Toast.create.negative(`Falha ao criar serviço, ${e.msg}`)
      })
    },
    search (title, done) {
      done(Utils.filter(title, {field: 'label', list: this.serviceTitles}))
    },
    goToServiceProvider (id) {
      this.$router.push(`/serviceProvider/${id}`)
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
