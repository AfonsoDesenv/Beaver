<style>

.input-file {
    opacity: 0;
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
        Configurações de Serviço
      </q-toolbar-title>
    </div>

    <sideMenu></sideMenu>

    <div id="serviceProviderForm" class="layout-view">
      <form class="full-width">
        <div class="full-width">
          <div class="layout-padding">
            <div v-if="serviceProviderState.myProviderRating > 0" class="row gutter" style="position: absolute; right: 10px; font-size: 2rem; margin-bottom: 0px; padding-left: 10px;">
              <div style="padding: 5px;">
                <div>{{serviceProviderState.myProviderRating}}</div>
              </div>
              <div style="padding: 0px;">
                <div><q-rating :value="1" :max="1" readonly></q-rating></div>
              </div>
            </div>
            <div v-if="serviceProviderState.myProviderRating > 0" style="padding-top: 25px;"></div>
            <div class="card">
              <q-slider dots infinite class="text-white" style="height: 190px;">
                <div v-if="!serviceProviderState.images[0]" slot="slide" class="bg-grey centered" style="font-size: 20px;">
                  <div>
                    <input type="file" accept="image/*" class="input-file full-width full-height" @change="uploadImage($event.target.files[0])">
                      <center>Adicionar Fotos!</center>
                  </div>
                </div>
                <template v-for="(image, index) in serviceProviderState.images">
                  <div slot="slide" class="bg-grey full-width full-height" style="padding: 0px; overflow: hidden;">
                    <div class="full-width">
                      <button style="padding: 0px; left:85%; width: 20px; height: 20px;" class="circular" @click="">
                        <input type="file" accept="image/*" class="input-file" @change="uploadImage($event.target.files[0])">
                        <i>add_circle</i>
                      </button>
                      <button style="padding: 0px; left:85%; width: 20px; height: 20px;" class="circular" @click="confirmRemoveImage(image.id)">
                        <i>cancel</i>
                      </button>
                    </div>
                    <img :src="image.image" class="responsive" style="width: 100%; height: auto; margin-top: -40px;" @click="$refs.imageModal.open()"></img>
                  </div>
                </template>
              </q-slider>
            </div>
            <div class="floating-label">
              <textarea class="full-width" style="height: 100px;" :value="serviceProviderState.description" @change="updateDescription"></textarea>
              <label>Descrição</label>
            </div>
            <div class="stacked-label">
              <textarea class="full-width" readonly v-model="address" @click="openMap"></textarea>
              <label>Localização</label>
            </div>
          </div>
          <center>
            <div class="full-width" style=" padding-top: 10px;">
              <button type="submit" class="primary small outline" @click="saveServiceProvider">Alterar Dados</button>
            </div>
          </center>
        </div>
      </form>
    </div>
    <button class="primary circular" style="position: absolute; bottom: 10px; right: 10px;">
      <i slot="target">
        more_vert
        <q-popover ref="popover">
          <div class="list">
            <div class="item item-link" v-link=" '/Services' ">
              <div class="item-content">Serviços</div>
            </div>
            <div class="item item-link" @click="$refs.popover.close(), $refs.serviceRequestsModal.open()">
              <div class="item-content">Solicitações de Serviço</div>
            </div>
            <div class="item item-link" @click="$refs.popover.close(), openConfirmMsg(1)">
              <div class="item-content">Remover Serviço</div>
            </div>
          </div>
        </q-popover>
      </i>
    </button>
    <q-modal ref="layoutModal" class="maximized">
      <q-layout>
        <div slot="header" class="toolbar">
          <button @click="$refs.layoutModal.close()">
            <i>keyboard_arrow_left</i>
          </button>
          <q-toolbar-title :padding="1">
            Localização
          </q-toolbar-title>
          <button @click="closeMap">
            <i>done</i>
          </button>
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
    <q-modal ref="confirmModal" class="minimized" :content-css="{padding: '15px'}">
      <h5>{{confirm_text}}</h5>
      <div class="full-width" style="padding-top: 10px;">
        <center>
          <button class="red" style="margin: 10px;" @click="$refs.confirmModal.close()">Cancelar</button>
          <button class="primary" style="margin: 10px;" @click="confirm">Confirmar</button>
        </center>
      </div>
    </q-modal>
    <q-modal ref="serviceRequestsModal" class="maximized" :content-css="{padding: '10px'}">
        <q-layout>
          <div slot="header" class="toolbar">
            <button @click="$refs.serviceRequestsModal.close()">
              <i>keyboard_arrow_left</i>
            </button>
            <q-toolbar-title :padding="1">
              Solicitações de serviço
            </q-toolbar-title>
          </div>
          <div class="layout-view" style="padding-top: 10px;">
              <center>
                <label v-if="!serviceProviderState.serviceRequests[0]" >Não há solicitações no momento.</label>
              </center>
              <template v-for="(serviceRequest, index) in serviceProviderState.serviceRequests">
                  <div class="item" :class="color[serviceRequest.status - 1]">
                      <div class="item-content" @click="goToServiceRequest(serviceRequest.id)">
                        {{showStatus(serviceRequest.status)}}
                        <label class="absolute-bottom-right">
                          {{showDate(serviceRequest.updated_at, 'DD/MM/YYYY hh:mm:ss')}}
                        </label>
                      </div>
                  </div>
              </template>
          </div>
        </q-layout>
    </q-modal>
    <q-modal ref="imageModal" class="maximized">
      <q-layout>
        <q-slider dots infinite class="text-white" style="padding: 0px;">
          <div slot="slide" class="bg-grey full-width full-height centered" v-for="(image, index) in serviceProviderState.images">
            <img :src="image.image" class="responsive" style="width: auto; height: auto; max-width: 100%; max-height: 100%;" @click="$refs.imageModal.close()"></img>
          </div>
        </q-slider>
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
  UPDATE_ID,
  UPDATE_DESCRIPTION,
  UPDATE_LOCATION,
  PERFORM_LOAD_SERVICE_PROVIDER,
  PERFORM_LOAD_SERVICE_REQUESTS,
  PERFORM_LOAD_PROVIDER_RATING,
  PERFORM_SAVE_SERVICE_PROVIDER,
  PERFORM_REMOVE_SERVICE_PROVIDER,
  PERFORM_LOAD_IMAGES,
  PERFORM_UPLOAD_IMAGE,
  PERFORM_REMOVE_IMAGE,
  CLEAR_STATE
} from 'src/store/serviceProvider/serviceProviderActions.js'
import { Toast } from 'quasar'
import axios from 'axios'

export default {
  components: {
    'googleMap': VueGoogleMaps.Map,
    'MapMarker': VueGoogleMaps.Marker,
    sideMenu
  },
  computed: mapState({
    serviceProviderState: state => state.serviceProviderModule
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
      color: ['bg-secondary', 'bg-green-3', 'bg-red-3', 'bg-blue-5', 'bg-red-3'],
      image_id_to_remove: 0,
      operation: 0,
      confirm_text: ''
    }
  },
  created () {
    this.clearState()
    this.performLoadServiceProvider()
    .then((response) => {
      this.performLoadServiceRequests()
      this.performLoadMyProviderRating()
      this.performLoadImages()
      this.displayLocation(this.serviceProviderState.latitude, this.serviceProviderState.longitude)
    })
  },
  methods: {
    ...mapActions({
      updateId: UPDATE_ID,
      updateDescription: UPDATE_DESCRIPTION,
      updateLocation: UPDATE_LOCATION,
      performLoadServiceProvider: PERFORM_LOAD_SERVICE_PROVIDER,
      performLoadServiceRequests: PERFORM_LOAD_SERVICE_REQUESTS,
      performLoadMyProviderRating: PERFORM_LOAD_PROVIDER_RATING,
      performSaveServiceProvider: PERFORM_SAVE_SERVICE_PROVIDER,
      performRemoveServiceProvider: PERFORM_REMOVE_SERVICE_PROVIDER,
      performLoadImages: PERFORM_LOAD_IMAGES,
      performUploadImage: PERFORM_UPLOAD_IMAGE,
      performRemoveImage: PERFORM_REMOVE_IMAGE,
      clearState: CLEAR_STATE
    }),
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
    uploadImage (file) {
      if (file) {
        const id = this.serviceProviderState.id
        const setup = this
        const reader = new FileReader()
        reader.onloadend = function () {
          setup.performUploadImage({ service_provider_id: id, image: reader.result })
          .catch(e => {
            Toast.create.negative(e.message)
          })
        }
        reader.readAsDataURL(file)
      }
    },
    confirmRemoveImage (id) {
      this.image_id_to_remove = id
      this.openConfirmMsg(2)
    },
    removeImage () {
      this.performRemoveImage(this.image_id_to_remove)
      .then((response) => {
        this.image_id_to_remove = 0
        this.performLoadImages()
        if (response.success) {
          Toast.create.positive({
            html: 'Imagem removida com sucesso.'
          })
        }
        else {
          Toast.create.negative({
            html: response.msg
          })
        }
      })
    },
    openConfirmMsg (operation) {
      this.$refs.confirmModal.open()
      this.operation = operation
      switch (operation) {
        case 1:
          this.confirm_text = 'Deseja remover o serviço de ' + this.serviceProviderState.service_title + '?'
          break
        case 2:
          this.confirm_text = 'Deseja remover a imagem?'
          break
      }
    },
    confirm () {
      this.$refs.confirmModal.close()
      switch (this.operation) {
        case 1:
          this.removeServiceProvider()
          break
        case 2:
          this.removeImage()
          break
      }
    },
    markPosition (position) {
      let lat = position.coords.latitude
      let lng = position.coords.longitude

      this.newMarker(lat, lng)
      this.center.lat = lat
      this.center.lng = lng
      this.location.latitude = lat
      this.location.longitude = lng
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
        draggable: true,
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
      this.$refs.layoutModal.open()
      var position = {
        coords: {
          latitude: 0,
          longitude: 0
        }
      }

      if (this.serviceProviderState.latitude !== 0 && this.serviceProviderState.longitude !== 0) {
        position.coords.latitude = this.serviceProviderState.latitude
        position.coords.longitude = this.serviceProviderState.longitude
        this.markPosition(position)
      }
      else {
        if (navigator.geolocation) {
          position.coords.latitude = -26.907356
          position.coords.longitude = -49.0665687
          navigator.geolocation.getCurrentPosition(this.markPosition, this.markPosition(position))
        }
      }
      this.$gmapDefaultResizeBus.$emit('resize')
    },
    closeMap () {
      this.updateLocation(this.location)
      this.displayLocation(this.location.latitude, this.location.longitude)
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
    goToServiceRequest (id) {
      this.$router.push(`/ServiceRequest/${id}`)
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
