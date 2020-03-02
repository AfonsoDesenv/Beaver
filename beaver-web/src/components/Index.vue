<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.sideMenu.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Beaver
      </q-toolbar-title>
    </div>

    <sideMenu ref="sideMenu"></sideMenu>

    <topTab slot="navigation"></topTab>
    <div class="layout-view" style="padding: 15px;">
      <div v-if="indexState.myRating > 0" class="row gutter" style="position: absolute; right: 10px; font-size: 2rem; margin-bottom: 0px; padding-left: 10px;">
        <div style="padding: 5px;">
          <div>{{indexState.myRating}}</div>
        </div>
        <div style="padding: 0px;">
          <div><q-rating :value="1" :max="1" readonly></q-rating></div>
        </div>
      </div>
      <div v-if="indexState.myRating > 0" style="padding-top: 25px;"></div>
      <div class="card" v-if="indexState.latestServices[0]">
        <q-slider autoplay dots infinite class="text-white" style="height: 220px; padding: 0px;">
          <div v-for="(service, index) in indexState.latestServices" slot="slide" class="bg-blue-6 full-width full-height" style="padding: 0px;" @click="goToProviderPerfil(service.id)">
            <div class="item three-lines" style="height: auto;">
              <img class="item-primary thumbnail" v-if="service.User.picture" :src="service.User.picture">
              <img class="item-primary thumbnail" v-if="!service.User.picture" src="../resources/pictures/user.jpg">
              <div class="item-content">
                <div>{{service.User.name}}</div>
                <div style="height: auto;">{{service.Service.title}}</div>
                <div class="item-content " style="height: 120px;">
                  <textarea readonly class="full-width" style="border: none; outline: none; resize: none; height: 120px;" :value="service.description"></textarea>
                </div>
              </div>
              <div class="timestamp" style="position: absolute; bottom: 0px; right: 10px; font-size: 13px;">
                 {{ showDate(service.created_at) }}
              </div>
            </div>
          </div>
        </q-slider>
      </div>
      <label v-if="indexState.requestByUser[0]" style="font-size: 12px;">Minhas Solicitações</label>
      <div class="card bg-grey-2" style="height: 130px;" @click="goToSearch()">
        <template v-if="!indexState.requestByUser[0]">
          <div class="item">
            <div class="item-content">
              <center>
                Procure por um serviço agora!
              </center>
            </div>
          </div>
        </template>
        <template v-if="indexState.requestByUser[0]" v-for="(request, index) in indexState.requestByUser">
          <div class="item" :class="color[request.status - 1]">
            <div class="item-content" @click="goToServiceRequest(request.id)">
              <i v-if="request.status == 1">priority_high</i>
              <i v-if="request.status == 2">done</i>
              {{request.ServiceProvider.Service.title}}
            </div>
            <div class="timestamp" style="position: absolute; bottom: 0px; right: 10px; font-size: 13px;">
               {{ showDate(request.created_at) }}
            </div>
          </div>
        </template>
      </div>
      <label v-if="indexState.requestByProvider[0]" style="font-size: 12px;">Meus Serviços</label>
      <div v-if="indexState.requestByProvider[0]" class="card bg-grey-3" style="height: 130px;">
        <template v-for="(request, index) in indexState.requestByProvider">
          <div class="item" :class="color[request.status - 1]">
            <div class="item-content " @click="goToServiceRequest(request.id)">
              <i v-if="request.status == 1">priority_high</i>
              <i v-if="request.status == 2">done</i>
              {{request.ServiceProvider.Service.title}}
            </div>
            <div class="timestamp" style="position: absolute; bottom: 0px; right: 10px; font-size: 13px;">
               {{ showDate(request.created_at) }}
            </div>
          </div>
        </template>
      </div>
      <div v-for="(request, index) in indexState.requestForRating" class="card">
        <div class="item-list">
          <div class="item" style="height: auto;">
            <div class="item-content" style="margin: 0px; padding: 5px; font-size: 13px;">
              <center>
                Por favor, avalie {{ request.ServiceProvider.User.name }} pelo serviço de {{ request.ServiceProvider.Service.title }}
              </center>
            </div>
          </div>
          <div class="item three-lines">
            <img class="item-primary thumbnail" v-if="request.ServiceProvider.User.picture" :src="request.ServiceProvider.User.picture">
            <img class="item-primary thumbnail" v-if="!request.ServiceProvider.User.picture" src="../resources/pictures/user.jpg">
            <div class="item-content" style="font-size: 2rem; padding-top: 20px;">
              <q-rating v-model="rating[index]" :max="5" @input="openComment(index)"></q-rating>
            </div>
            <div style="bottom: 0px; font-size: 13px;">
              <center>
                Concluído em {{ showDate(request.created_at) }}
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-modal ref="commentModal" class="minimized" :content-css="{padding: '15px'}">
      <h5>Deseja escrever algum comentário?</h5>
      <textarea class="full-width" v-model="comment"> </textarea>
      <div class="full-width" style="padding-top: 10px;">
        <center>
          <button class="red" style="margin: 10px;" @click="$refs.commentModal.close()">Cancelar</button>
          <button class="primary" style="margin: 10px;" @click="rateRequest">Confirmar</button>
        </center>
      </div>
    </q-modal>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import topTab from 'src/components/TopTab.vue'
import moment from 'moment'
import { Toast } from 'quasar'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_LATEST_SERVICES, PERFORM_LOAD_REQUESTS_BY_USER, PERFORM_LOAD_REQUESTS_BY_PROVIDER, PERFORM_LOAD_REQUESTS_FOR_RATING, PERFORM_LOAD_MY_RATING, PERFORM_RATE_REQUEST, CLEAR_STATE } from 'src/store/index/indexActions.js'

export default {
  computed: mapState({
    indexState: state => state.indexModule
  }),
  data () {
    return {
      color: ['bg-secondary', 'bg-green-3', 'bg-red-3', 'bg-blue-5', 'bg-red-3'],
      position: 'bottom',
      rateIndex: 0,
      comment: '',
      rating: []
    }
  },
  created () {
    this.clearState()
    this.performLoadLatestServices()
    this.performLoadServiceRequestsByUser()
    this.performLoadServiceRequestsByProvider()
    this.performLoadRequestsForRating()
    this.performLoadMyRating()
  },
  methods: {
    ...mapActions({
      performLoadLatestServices: PERFORM_LOAD_LATEST_SERVICES,
      performLoadServiceRequestsByUser: PERFORM_LOAD_REQUESTS_BY_USER,
      performLoadServiceRequestsByProvider: PERFORM_LOAD_REQUESTS_BY_PROVIDER,
      performLoadRequestsForRating: PERFORM_LOAD_REQUESTS_FOR_RATING,
      performLoadMyRating: PERFORM_LOAD_MY_RATING,
      performRateRequest: PERFORM_RATE_REQUEST,
      clearState: CLEAR_STATE
    }),
    showDate (date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    openComment (index) {
      this.comment = ''
      this.rateIndex = index
      this.$refs.commentModal.open()
    },
    rateRequest () {
      let payload = {
        rate: this.rating[this.rateIndex],
        comment: this.comment,
        service_request_id: this.indexState.requestForRating[this.rateIndex].id
      }
      this.performRateRequest(payload)
      .then((response) => {
        this.$refs.commentModal.close()
        this.comment = ''
        this.rateIndex = 0
        if (response.success) {
          this.performLoadRequestsForRating()
          this.rating = []
          Toast.create.positive({
            html: 'Avaliação efetuada com sucesso.'
          })
        }
        else {
          Toast.create.negative({
            html: response.msg
          })
        }
      })
    },
    goToSearch () {
      if (!this.indexState.requestByUser[0]) {
        this.$router.push('/Search')
      }
    },
    goToServiceRequest (id) {
      this.$router.push(`/ServiceRequest/${id}`)
    },
    goToProviderPerfil (id) {
      this.$router.push('/ProviderPerfil/' + id)
    }
  },
  components: {
    sideMenu,
    topTab
  }
}
</script>
