<style>

.profile-picture .picture-wrapper {
    height: 200px;
    width: 200px;
    background: lightgray;
    text-align: center;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
}

.profile-picture img {
    width: 200px;
    height: auto;
}

.profile-picture .change-picture{
    top: -31px;
    width: 100%;
    position: relative;
    font-size: 25px;
    left: 10px;
}

.profile-picture .input-file {
    opacity: 0;
    width: 200px;
    height: 200px;
    position: absolute;
    cursor: pointer;
}

</style>
<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="goBack()">
        <i>navigate_before</i>
      </button>
      <q-toolbar-title :padding="1">
        {{providerPerfilState.service ? providerPerfilState.service : '' }}
      </q-toolbar-title>
    </div>

    <sideMenu></sideMenu>

    <div id="providerPerfilForm" class="layout-view">
      <form class="full-width">
        <div class="full-width">
          <div class="layout-padding">
            <div class="profile-picture">
              <div class="row justify-center items-center">
                <div class="picture-wrapper">
                  <div class="column justify-center items-center centered" style="height: 100%;margin:0px; overflow: hidden;">
                    <img v-if="providerPerfilState.picture" :src="providerPerfilState.picture" class="responsive"></img>
                    <img v-if="!providerPerfilState.picture" src="../resources/pictures/user.jpg" class="responsive">
                  </div>
                </div>
              </div>
            </div>
            <label>Nome</label>
            <input class="full-width" readonly :value="providerPerfilState.name">
            <br>
            <label>Descrição</label>
            <textarea class="full-width" readonly :value="providerPerfilState.description"></textarea>
            <br>
            <label>Localização</label>
            <textarea class="full-width" :size="5" readonly v-model="address" @click="openMap"></textarea>
            <button class="full-width" :class="service_request_color" @click="goToRequest"><i>info</i> {{service_request_info}}</button>
            <center>
              <button class="primary small outline" style="margin-top: 5px;" @click="$refs.imageModal.open()"><i>camera_enhance</i> Fotos</button>
            </center>
          </div>
        </div>
      </form>
    </div>
    <button class="primary circular" style="position: absolute; bottom: 10px; right: 10px;">
      <i slot="target">
        more_vert
        <q-popover ref="popover">
          <div class="list">
            <div class="item item-link">
              <div class="item-content" @click="goToMessage()">Mandar Mensagem</div>
            </div>
            <div v-if="this.providerPerfilState.serviceRequests[0]" class="item item-link">
              <div class="item-content" @click="$refs.popover.close(), $refs.requestHistoryModal.open()">Histórico de solicitações</div>
            </div>
            <div v-if="(!this.providerPerfilState.serviceRequests[0] || this.providerPerfilState.serviceRequests[0].status > 2)" class="item item-link">
              <div class="item-content" @click="openConfirmMsg(1)">Solicitar Serviço</div>
            </div>
            <div v-if="(this.providerPerfilState.serviceRequests[0] && this.providerPerfilState.serviceRequests[0].status < 2)" class="item item-link">
              <div class="item-content" @click="openConfirmMsg(2)">Cancelar Serviço</div>
            </div>
          </div>
        </q-popover>
      </i>
    </button>
    <q-modal ref="confirmModal" class="minimized" :content-css="{padding: '10px'}">
      <h5>{{confirm_text}}</h5>
      <div class="full-width" style="padding-top: 10px;">
        <center>
          <button class="red" style="margin: 10px;" @click="$refs.confirmModal.close()">Cancelar</button>
          <button class="primary" style="margin: 10px;" @click="confirm">Confirmar</button>
        </center>
      </div>
    </q-modal>
    <q-modal ref="requestHistoryModal" :content-css="{padding: '10px'}">
        <q-layout>
          <div slot="header" class="toolbar">
            <button @click="$refs.requestHistoryModal.close()">
              <i>keyboard_arrow_left</i>
            </button>
            <q-toolbar-title :padding="1">
              Histórico de Solicitações
            </q-toolbar-title>
          </div>
          <div class="layout-view">
            <div class="">
              <template v-for="(serviceRequest, index) in providerPerfilState.serviceRequests">
                  <div class="item" :class="color[serviceRequest.status - 1]" @click="goToRequest(serviceRequest.id)">
                      <div class="item-content">
                        {{showStatus(serviceRequest.status)}}
                        <label class="absolute-bottom-right">
                          {{showDate(serviceRequest.updated_at, 'DD/MM/YYYY hh:mm:ss')}}
                        </label>
                      </div>
                  </div>
              </template>
            </div>
          </div>
        </q-layout>
    </q-modal>
    <q-modal ref="imageModal" class="maximized">
      <q-layout>
        <q-slider v-if="providerPerfilState.pictures[0]" dots infinite class="text-white" style="padding: 0px;">
          <div v-if="providerPerfilState.pictures[0]" slot="slide" class="bg-grey full-width full-height centered" v-for="(picture, index) in providerPerfilState.pictures">
            <img :src="picture.image" class="responsive" style="width: auto; height: auto; max-width: 100%; max-height: 100%;" @click="$refs.imageModal.close()"></img>
          </div>
        </q-slider>
        <div v-if="!providerPerfilState.pictures[0]" class="full-width full-height" style="align-text: center; margin-top: 50%;" @click="$refs.imageModal.close()">
          <center>
            Não há imagens!
          </center>
        </div>
      </q-layout>
    </q-modal>
    <q-modal ref="layoutModal">
      <q-layout>
        <div slot="header" class="toolbar">
          <button @click="$refs.layoutModal.close()">
            <i>keyboard_arrow_left</i>
          </button>
          <q-toolbar-title :padding="1">
            Localização
          </q-toolbar-title>
        </div>

        <div class="layout-view">
            <google-map
              :center="center"
              :zoom="14"
              :options="{
                disableDefaultUI: true,
                panControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                overviewMapControl: false,
                resetBoundsOnResize:true
              }"
              style=" height: 100%;">
              <map-marker
                :position="m.position"
                :opacity="m.opacity"
                :draggable="m.draggable"
                @position_changed="updMarker(m, $event)"
                @dragend="updateMarker(m)"
                v-for="(m, index) in markers"
                :key="index"
                >
              </map-marker>
            </google-map>
        </div>
      </q-layout>
    </q-modal>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import moment from 'moment'
import * as VueGoogleMaps from 'vue2-google-maps'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_PROVIDER_PERFIL, PERFORM_LOAD_IMAGES, PERFORM_LOAD_SERVICE_REQUESTS, PERFORM_SAVE_SERVICE_REQUEST, PERFORM_CANCEL_SERVICE_REQUEST, CLEAR_STATE } from 'src/store/providerPerfil/providerPerfilActions.js'
import { PERFORM_LOAD_SERVICE_PROVIDERS_BY_ID } from 'src/store/services/servicesActions.js'
import { Toast } from 'quasar'
import axios from 'axios'

export default {
  components: {
    'googleMap': VueGoogleMaps.Map,
    'MapMarker': VueGoogleMaps.Marker,
    sideMenu
  },
  computed: mapState({
    providerPerfilState: state => state.providerPerfilModule,
    servicesState: state => state.servicesModule
  }),
  data () {
    return {
      address: '',
      markers: [],
      center: { lat: 0, lng: 0 },
      service_request_info: 'Sem solicitações de serviço',
      service_request_color: 'grey',
      confirm_text: '',
      operation: 0,
      color: ['bg-secondary', 'bg-green-3', 'bg-red-3', 'bg-blue-5', 'bg-red-3']
    }
  },
  created () {
    this.loadProviderPerfil()
  },
  methods: {
    ...mapActions({
      performLoadProviderPerfil: PERFORM_LOAD_PROVIDER_PERFIL,
      performLoadImages: PERFORM_LOAD_IMAGES,
      performLoadServiceRequests: PERFORM_LOAD_SERVICE_REQUESTS,
      performSaveServiceRequest: PERFORM_SAVE_SERVICE_REQUEST,
      performCancelServiceRequest: PERFORM_CANCEL_SERVICE_REQUEST,
      performLoadServiceProvidersById: PERFORM_LOAD_SERVICE_PROVIDERS_BY_ID,
      clearState: CLEAR_STATE
    }),
    loadProviderPerfil () {
      this.clearState()
      .then((response) => {
        this.performLoadProviderPerfil()
        .then((response) => {
          this.performLoadImages()
          .then((response) => {
            this.performLoadServiceRequests()
            .then((response) => {
              this.loadServiceRequestStatus()
              this.performLoadServiceProvidersById(this.providerPerfilState.user_id)
              .then((response) => {
                this.displayLocation(this.providerPerfilState.latitude, this.providerPerfilState.longitude)
              })
            })
          })
        })
      })
    },
    markPosition (position) {
      let lat = position.coords.latitude
      let lng = position.coords.longitude

      this.newMarker(lat, lng)
      this.center.lat = lat
      this.center.lng = lng
    },
    newMarker (lat, lng) {
      const createdMarker = this.addMarker()
      createdMarker.position.lat = lat
      createdMarker.position.lng = lng
      console.log(createdMarker.position.lat, createdMarker.position.lng)
    },
    addMarker () {
      this.markers = []
      this.markers.push({
        position: { lat: 0, lng: 0 },
        draggable: false,
        enabled: true
      })
      return this.markers[this.markers.length - 1]
    },
    updMarker (m, event) {
      m.position = {
        lat: event.lat(),
        lng: event.lng()
      }
    },
    updateMarker (m) {
      this.location.latitude = m.position.lat
      this.location.longitude = m.position.lng
      console.log(m.position.lat, m.position.lng)
    },
    openMap () {
      if (this.providerPerfilState.latitude !== 0 && this.providerPerfilState.longitude !== 0) {
        this.$refs.layoutModal.open()
        var position = {
          coords: {
            latitude: this.providerPerfilState.latitude,
            longitude: this.providerPerfilState.longitude
          }
        }
        this.markPosition(position)
        this.$gmapDefaultResizeBus.$emit('resize')
      }
      else {
        Toast.create.negative('Usuário não compartilha sua localização!')
      }
    },
    closeMap () {
      this.$refs.layoutModal.close()
    },
    saveServiceProvider: function (e) {
      this.performSaveServiceProvider()
        .then((response) => {
          if (response.success) {
            Toast.create.positive({
              html: 'Informações salvas com sucesso.'
            })
          }
          else {
            Toast.create.negative({
              html: response.msg
            })
          }
        })
    },
    removeServiceProvider () {
      this.performRemoveServiceProvider()
        .then((response) => {
          if (response.success) {
            this.$router.push('/Services')
            Toast.create.positive({
              html: 'Serviço removido com sucesso.'
            })
          }
          else {
            Toast.create.negative({
              html: response.msg
            })
          }
        })
    },
    displayLocation (lat, lng) {
      if (lat !== 0 || lng !== 0) {
        axios.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true')
        .then(response => {
          var data = response.data
          this.address = data.results[0].formatted_address
        })
        .catch(e => {
          Toast.create.negative(e.message)
        })
      }
    },
    goToRequest (id) {
      if (id > 0) {
        this.$router.push(`/ServiceRequest/${id}`)
      }
      else {
        if (this.providerPerfilState.serviceRequests[0]) {
          this.$router.push(`/ServiceRequest/${this.providerPerfilState.serviceRequests[0].id}`)
        }
      }
    },
    goToMessage () {
      this.$router.push(`/Message/${this.providerPerfilState.user_id}`)
    },
    checkService (serviceProviderId) {
      this.checkeds.push(serviceProviderId)
    },
    openConfirmMsg (operation) {
      this.$refs.popover.close()
      this.$refs.confirmModal.open()
      this.operation = operation
      switch (operation) {
        case 1:
          this.confirm_text = 'Deseja solicitar os serviços de' + (this.providerPerfilState.service ? this.providerPerfilState.service : '') + '?'
          break
        case 2:
          this.confirm_text = 'Deseja cancelar a solicitação de serviço?'
          break
      }
    },
    confirm () {
      this.$refs.confirmModal.close()
      switch (this.operation) {
        case 1:
          this.sendServiceRequest()
          break
        case 2:
          this.cancelServiceRequest()
          break
      }
    },
    loadServiceRequestStatus () {
      if (this.providerPerfilState.serviceRequests[0]) {
        switch (this.providerPerfilState.serviceRequests[0].status) {
          // 1 - open / 2 - accepted / 3 - closed / 4 - canceled
          case 1:
            this.service_request_info = 'Solicitação aberta em ' + this.showDate(this.providerPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'secondary'
            break
          case 2:
            this.service_request_info = 'Solicitação aceita em ' + this.showDate(this.providerPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'green-3'
            break
          case 3:
            this.service_request_info = 'Solicitação recusada em ' + this.showDate(this.providerPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'red-3'
            break
          case 4:
            this.service_request_info = 'Solicitação concluída em ' + this.showDate(this.providerPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'blue-5'
            break
          case 5:
            this.service_request_info = 'Solicitação cancelada em ' + this.showDate(this.providerPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'red-3'
            break
        }
      }
    },
    sendServiceRequest () {
      this.performSaveServiceRequest(this.providerPerfilState.id)
      .then((response) => {
        if (response.success) {
          this.loadProviderPerfil()
          Toast.create.positive({
            html: 'Solicitação enviada com sucesso.'
          })
        }
        else {
          Toast.create.negative({
            html: response.msg
          })
        }
      })
    },
    cancelServiceRequest () {
      this.performCancelServiceRequest()
      .then((response) => {
        if (response.success) {
          this.loadProviderPerfil()
          Toast.create.positive({
            html: 'Solicitação cancelada com sucesso.'
          })
        }
        else {
          Toast.create.negative({
            html: response.msg
          })
        }
      })
    },
    showDate (date, format) {
      if (format) {
        return moment(date).format(format)
      }
      else {
        return moment(date).format('DD/MM/YYYY')
      }
    },
    showStatus (status) {
      switch (status) {
        case 1:
          return 'Em Aberto'
        case 2:
          return 'Aprovada'
        case 3:
          return 'Recusada'
        case 4:
          return 'Concluída'
        case 5:
          return 'Cancelada'
      }
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
