<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="goBack()">
        <i>navigate_before</i>
      </button>
      <q-toolbar-title :padding="1">
        Buscando Servidores
      </q-toolbar-title>
    </div>
    <sideMenu></sideMenu>
    <div class=" full-width">
      <google-map
        :center="center"
        :zoom="13"
        :options="{
          disableDefaultUI: true,
          panControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          resetBoundsOnResize:true
        }"
        style=" height: 100%">
         <map-marker
           :position="m.position"
           :opacity="m.opacity"
           :draggable="m.draggable"
           :clickable="m.clickable"
           @position_changed="updMarker(m, $event)"
           @dragend="logMarker(m)"
           v-for="(m, index) in markers"
           :key="index"
           @click="openSpecialPosition(index)"
           >
       </map-marker>
      </google-map>
    </div>
    <q-modal ref="positionModal" :position="position" :content-css="{padding: '20px'}">
      <center>
        <img v-if="picture" :src="picture"class="avatar" style="height:100px; width:100px;">
        <img v-if="!picture" src="../resources/pictures/user.jpg" class="avatar" style="height: 30%; width: 30%;">
      </center>
      <h4>{{name}}</h4>
      <p>
        <div class="row gutter" style="font-size: 2rem; margin-bottom: 0px; padding-left: 10px;">
          <div v-if="rating > 0" style="padding: 5px;">
            <div>{{rating}}</div>
          </div>
          <div v-if="rating > 0" style="padding: 0px;">
            <div><q-rating :value="1" :max="1" readonly></q-rating></div>
          </div>
          <div style="padding-top: 20px; font-size: 1rem;">
            a {{distance}} Km
          </div>
        </div>
      </p>
      <center>
        <button class="red" style="margin: 2px;" @click="$refs.positionModal.close()">Fechar</button>
        <button class="primary" style="margin: 2px;" @click="goToProviderPerfil()">Acessar perfil</button>
      </center>
    </q-modal>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import { LocalStorage } from 'quasar'
import { mapState } from 'vuex'
import axios from 'axios'
import * as VueGoogleMaps from 'vue2-google-maps'

export default {
  components: {
    'googleMap': VueGoogleMaps.Map,
    'MapMarker': VueGoogleMaps.Marker,
    sideMenu
  },
  computed: mapState({
    setupState: state => state.setupModule
  }),
  data () {
    return {
      markers: [],
      center: { lat: -26.907356, lng: -49.0665687 },
      rating: 0,
      distance: 0,
      id: 0,
      name: '',
      picture: '',
      position: 'bottom'
    }
  },
  created () {
    if (navigator.geolocation) {
      var position = {
        coords: {
          latitude: this.center.lat,
          longitude: this.center.lng
        }
      }
      navigator.geolocation.getCurrentPosition(this.markCenter, this.markCenter(position))
    }
  },
  methods: {
    markCenter (position) {
      let lat = position.coords.latitude
      let lng = position.coords.longitude
      this.center.lat = lat
      this.center.lng = lng
      axios.get(`http://localhost:3000/serviceProviders/${this.$route.query.service_id}`, {headers: {authorization: LocalStorage.get.item('token')}})
      .then(response => {
        var serviceProviders = response.data
        for (var n in serviceProviders) {
          this.markers.push({
            position: { lat: serviceProviders[n].latitude, lng: serviceProviders[n].longitude },
            draggable: true,
            enabled: true,
            clickable: true,
            id: serviceProviders[n].id,
            label: serviceProviders[n].User.name,
            title: serviceProviders[n].User.name,
            picture: serviceProviders[n].User.picture,
            rating: serviceProviders[n].rating,
            distance: (Math.round((((Math.acos(Math.sin(this.center.lat * 3.14 / 180) *
                                     Math.sin(serviceProviders[n].latitude * 3.14 / 180) +
                                     Math.cos(this.center.lat * 3.14 / 180) *
                                     Math.cos(serviceProviders[n].latitude * 3.14 / 180) *
                                     Math.cos((serviceProviders[n].longitude - (this.center.lng)) * 3.14 / 180)) * 180 / 3.14) * 60 *
                                     1.1515) * 1.6093),
                                     2))
          })
        }
      })
      .catch(e => {
        this.$router.push('/signin')
      })
    },
    newMarker (lat, lng) {
      const createdMarker = this.addMarker()
      createdMarker.position.lat = lat
      createdMarker.position.lng = lng
      console.log(createdMarker.position.lat, createdMarker.position.lng)
    },
    addMarker () {
      this.markers.push({
        position: { lat: 48.8538302, lng: 2.2982161 },
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
    logMarker (m) {
      console.log(m.position.lat, m.position.lng)
    },
    openSpecialPosition (index) {
      this.$nextTick(() => {
        this.id = this.markers[index].id
        this.name = this.markers[index].title
        this.picture = this.markers[index].picture
        this.rating = this.markers[index].rating
        this.distance = this.markers[index].distance
        this.$refs.positionModal.open()
      })
    },
    goToProviderPerfil () {
      this.$router.push('/ProviderPerfil/' + this.id)
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>

<style></style>
