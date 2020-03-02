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
      <button class="hide-on-drawer-visible" @click="$refs.sideMenu.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Configurações
      </q-toolbar-title>
    </div>

    <sideMenu ref="sideMenu"></sideMenu>
    <topTab slot="navigation"></topTab>

    <div id="setupForm" class="layout-view">
      <form class="full-width">
        <div class="full-width">
          <div class="layout-padding">
            <div class="profile-picture">
              <div class="row justify-center items-center">
                <div class="picture-wrapper">
                  <div class="column justify-center items-center centered" style="height: 100%;margin:0px; overflow: hidden;">
                    <img v-if="setupState.picture" :src="setupState.picture" class="responsive"></img>
                    <p v-if="!setupState.picture"> Selecione uma foto <br/> <i>camera_alt</i> </p>
                    <i v-if="setupState.picture" class="change-picture">camera_alt</i>
                    <input type="file" accept="image/*" class="input-file" @change="fileChange($event.target.files[0])">
                  </div>
                </div>
              </div>
            </div>
            <br>
            <div class="floating-label">
              <input required class="full-width" :value="setupState.name" @change="updateName">
              <label>Nome</label>
            </div>
            <div class="floating-label">
              <input required class="full-width" :value="setupState.email" @change="updateEmail">
              <label>E-mail</label>
            </div>
            <div class="stacked-label" @click="openMap">
              <textarea readonly class="full-width" v-model="address"></textarea>
              <label>Localização</label>
            </div>
          </div>
          <center>
            <div class="full-width" style=" padding-top: 10px;">
              <button type="submit" class="primary small outline" @click="saveUser">Alterar Dados</button>
            </div>
          </center>
        </div>
      </form>
      <button class="primary circular" style="position: absolute; bottom: 10px; right: 10px;">
        <i slot="target">
          more_vert
          <q-popover ref="popover">
            <div class="list">
              <div class="item item-link" @click="$refs.popover.close(), $refs.minimizedModal.open()">
                <div class="item-content">Alterar Senha</div>
              </div>
              <div class="item item-link" @click="$refs.popover.close(), $refs.confirmModal.open()">
                <div class="item-content">Remover Cadastro</div>
              </div>
            </div>
          </q-popover>
        </i>
      </button>
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
    <q-modal ref="minimizedModal" class="minimized" :content-css="{padding: '15px'}">
      <div class="layout-padding">
        <div class="floating-label">
          <input type="password" required class="full-width" v-model="passwords.oldPassword">
          <label>Senha Antiga</label>
        </div>
        <div class="floating-label">
          <input type="password" required class="full-width" v-model="passwords.newPassword">
          <label>Senha Nova</label>
        </div>
      </div>
      <div class="full-width" style=" padding-top: 10px;">
        <center>
          <button class="red" style="margin: 2px;" @click="$refs.minimizedModal.close()">Cancelar</button>
          <button class="primary" style="margin: 2px;" @click="changePassword">Alterar Senha</button>
        </center>
      </div>
    </q-modal>
    <q-modal ref="confirmModal" class="minimized" :content-css="{padding: '15px'}">
      <h5>Deseja remover o cadastro?</h5>
      <div class="floating-label">
          <input type="password" class="full-width" v-model="passwordRemove"/>
          <label>Senha</label>
      </div>
      <div class="full-width" style="padding-top: 10px;">
        <center>
          <button class="red" style="margin: 10px;" @click="$refs.confirmModal.close()">Cancelar</button>
          <button class="primary" style="margin: 10px;" @click="removeUser">Confirmar</button>
        </center>
      </div>
    </q-modal>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import topTab from 'src/components/TopTab.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import { mapActions, mapState } from 'vuex'
import { UPDATE_NAME, UPDATE_EMAIL, UPDATE_LOCATION, UPLOAD_PICTURE, PERFORM_LOAD_USER, PERFORM_SAVE_USER, PERFORM_REMOVE_USER, PERFORM_CHANGE_PASSWORD, CLEAR_STATE } from 'src/store/setup/setupActions.js'
import { Toast } from 'quasar'
import axios from 'axios'

export default {
  components: {
    'googleMap': VueGoogleMaps.Map,
    'MapMarker': VueGoogleMaps.Marker,
    sideMenu,
    topTab
  },
  computed: mapState({
    setupState: state => state.setupModule
  }),
  data () {
    return {
      passwords: {
        oldPassword: '',
        newPassword: ''
      },
      passwordRemove: '',
      location: {
        latitude: 0,
        longitude: 0
      },
      address: '',
      markers: [],
      center: { lat: 0, lng: 0 }
    }
  },
  created () {
    this.clearState()
    this.performLoadUser()
    .then(response => {
      this.displayLocation(this.setupState.latitude, this.setupState.longitude)
    })
  },
  methods: {
    ...mapActions({
      updateName: UPDATE_NAME,
      updateEmail: UPDATE_EMAIL,
      updateLocation: UPDATE_LOCATION,
      uploadPicture: UPLOAD_PICTURE,
      performLoadUser: PERFORM_LOAD_USER,
      performSaveUser: PERFORM_SAVE_USER,
      performRemoveUser: PERFORM_REMOVE_USER,
      performChangePassword: PERFORM_CHANGE_PASSWORD,
      clearState: CLEAR_STATE
    }),
    changePassword: function (e) {
      this.performChangePassword(this.passwords)
      .then(response => {
        this.$refs.minimizedModal.close()
        this.passwords.oldPassword = ''
        this.passwords.newPassword = ''
        if (response.success) {
          Toast.create.positive({
            html: 'Senha alterada com sucesso!'
          })
        }
        else {
          Toast.create.negative(`Falha ao alterar senha, ${response.msg}`)
        }
      })
      .catch(e => {
        Toast.create.negative(`Falha ao alterar senha, ${e.msg}`)
      })
    },
    saveUser: function (e) {
      this.performSaveUser()
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
    removeUser: function (e) {
      this.performRemoveUser({ password: this.passwordRemove })
        .then((response) => {
          this.$refs.confirmModal.close()
          this.passwordRemove = ''
          if (response.success) {
            this.$router.push('/SignIn')
            Toast.create.positive({
              html: 'Usuário removido com sucesso.'
            })
          }
          else {
            Toast.create.negative({
              html: response.msg
            })
          }
        })
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
    locationError (error) {
      let msg = ''
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = 'Usuário negou o uso da localização.'
          break
        case error.POSITION_UNAVAILABLE:
          msg = 'Localização inválida.'
          break
        case error.TIMEOUT:
          msg = 'Tempo limite da requisição esgotada.'
          break
        case error.UNKNOWN_ERROR:
          msg = 'Erro inesperado.'
          break
      }
      Toast.create.negative(msg)
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
      if (this.setupState.latitude !== 0 && this.setupState.longitude !== 0) {
        position.coords.latitude = this.setupState.latitude
        position.coords.longitude = this.setupState.longitude
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
    fileChange (file) {
      if (file) {
        const setup = this
        const reader = new FileReader()
        reader.onloadend = function () {
          setup.uploadPicture({ picture: reader.result })
          .catch(e => {
            Toast.create.negative(e.message)
          })
        }
        reader.readAsDataURL(file)
      }
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
