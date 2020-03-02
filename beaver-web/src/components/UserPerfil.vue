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
    max-height: 200px;
    max-width: 200px;
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
        {{userPerfilState.name}}
      </q-toolbar-title>
    </div>

    <sideMenu></sideMenu>

    <div id="setupForm" class="layout-view">
      <form class="full-width">
        <div class="full-width">
          <div class="layout-padding">
            <div class="profile-picture">
              <div class="row justify-center items-center">
                <div class="picture-wrapper">
                  <div class="column justify-center items-center" style="height: 100%;margin:0px;">
                    <img v-if="userPerfilState.picture" :src="userPerfilState.picture" class="responsive"></img>
                    <img v-if="!userPerfilState.picture" src="../resources/pictures/user.jpg" class="responsive"></img>
                  </div>
                </div>
              </div>
            </div>
            <br>
            <label>E-mail</label>
            <input readonly class="full-width" :value="userPerfilState.email">
            <br>
            <label>Localização</label>
            <textarea readonly class="full-width" v-model="address" @click="openMap"></textarea>
            <br>
            <div class="full-width" :class="service_request_color" style="padding: 10px;">
              <center>
                <i>info</i> {{service_request_info}}
              </center>
            </div>
            <center>
              <div class="full-width" style="position: absolute; bottom: 20px;">
                <button type="submit" class="primary" @click="goToMessage()">Enviar Mensagem <i>send</i></button>
              </div>
            </center>
          </div>
        </div>
      </form>
    </div>
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
import {
  PERFORM_LOAD_USER,
  PERFORM_LOAD_SERVICE_REQUESTS,
  PERFORM_ACCEPT_SERVICE_REQUEST,
  PERFORM_REFUSE_SERVICE_REQUEST,
  PERFORM_CANCEL_SERVICE_REQUEST,
  CLEAR_STATE
} from 'src/store/userPerfil/userPerfilActions.js'
import { Toast } from 'quasar'
import axios from 'axios'

export default {
  components: {
    'googleMap': VueGoogleMaps.Map,
    'MapMarker': VueGoogleMaps.Marker,
    sideMenu
  },
  computed: mapState({
    userPerfilState: state => state.userPerfilModule
  }),
  data () {
    return {
      location: {
        latitude: 0,
        longitude: 0
      },
      address: '',
      markers: [],
      center: { lat: 0, lng: 0 },
      service_request_info: 'Sem solicitações de serviço',
      service_request_color: 'grey',
      confirm_text: '',
      operation: 0
    }
  },
  created () {
    this.loadUserPerfil()
  },
  methods: {
    ...mapActions({
      performLoadUser: PERFORM_LOAD_USER,
      performLoadServiceRequests: PERFORM_LOAD_SERVICE_REQUESTS,
      performAcceptServiceRequest: PERFORM_ACCEPT_SERVICE_REQUEST,
      performRefuseServiceRequest: PERFORM_REFUSE_SERVICE_REQUEST,
      performCancelServiceRequest: PERFORM_CANCEL_SERVICE_REQUEST,
      clearState: CLEAR_STATE
    }),
    loadUserPerfil () {
      this.clearState()
      this.performLoadUser()
      .then((response) => {
        this.performLoadServiceRequests()
        .then((response) => {
          this.loadServiceRequestStatus()
          this.displayLocation(this.userPerfilState.latitude, this.userPerfilState.longitude)
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
      if (this.userPerfilState.latitude !== 0 && this.userPerfilState.longitude !== 0) {
        this.$refs.layoutModal.open()
        var position = {
          coords: {
            latitude: this.userPerfilState.latitude,
            longitude: this.userPerfilState.longitude
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
    openConfirmMsg (operation) {
      this.$refs.popover.close()
      this.$refs.confirmModal.open()
      this.operation = operation
      switch (operation) {
        case 1:
          this.confirm_text = 'Deseja aceitar a solicitação de ' + this.userPerfilState.name + '?'
          break
        case 2:
          this.confirm_text = 'Deseja recusar a solicitação de ' + this.userPerfilState.name + '?'
          break
      }
    },
    confirm () {
      this.$refs.confirmModal.close()
      switch (this.operation) {
        case 1:
          this.acceptServiceRequest()
          break
        case 2:
          this.refuseServiceRequest()
          break
        case 3:
          this.cancelServiceRequest()
          break
      }
    },
    loadServiceRequestStatus () {
      if (this.userPerfilState.serviceRequests[0]) {
        switch (this.userPerfilState.serviceRequests[0].status) {
          // 1 - open / 2 - accepted / 3 - closed / 4 - canceled
          case 1:
            this.service_request_info = 'Solicitação aberta em ' + this.showDate(this.userPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'bg-secondary'
            break
          case 2:
            this.service_request_info = 'Solicitação aceita em ' + this.showDate(this.userPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'bg-green-3'
            break
          case 3:
            this.service_request_info = 'Solicitação recusada em ' + this.showDate(this.userPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'bg-red-3'
            break
          case 4:
            this.service_request_info = 'Solicitação concluída em ' + this.showDate(this.userPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'bg-blue-3'
            break
          case 5:
            this.service_request_info = 'Solicitação cancelada em ' + this.showDate(this.userPerfilState.serviceRequests[0].updated_at)
            this.service_request_color = 'bg-red-3'
            break
        }
      }
    },
    acceptServiceRequest () {
      this.performAcceptServiceRequest()
      .then((response) => {
        if (response.success) {
          console.log('teste')
          this.loadUserPerfil()
          Toast.create.positive({
            html: 'Solicitação aceita com sucesso.'
          })
        }
        else {
          Toast.create.negative({
            html: response.msg
          })
        }
      })
    },
    refuseServiceRequest () {
      this.performRefuseServiceRequest()
      .then((response) => {
        if (response.success) {
          this.loadUserPerfil()
          Toast.create.positive({
            html: 'Solicitação recusada com sucesso.'
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
          this.loadUserPerfil()
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
    goToMessage () {
      this.$router.push(`/Message/${this.userPerfilState.id}`)
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
