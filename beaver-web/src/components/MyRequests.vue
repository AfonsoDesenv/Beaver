<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="goBack()">
        <i>navigate_before</i>
      </button>
      <q-toolbar-title :padding="1">
        Histórico de Solicitações
      </q-toolbar-title>
    </div>

    <sideMenu></sideMenu>
    <div class="layout-view">
      <center>
        <label v-if="!myRequestsState.myRequests[0]" >Não há solicitações no momento.</label>
      </center>
      <div v-if="myRequestsState.myRequests[0]" class="card bg-grey-3">
        <template v-for="(request, index) in myRequestsState.myRequests">
          <div class="item" :class="color[request.status - 1]">
            <div class="item-content" @click="goToServiceRequest(request.id)">
              <i v-if="request.status == 1">priority_high</i>
              <i v-if="request.status == 2">done</i>
              <i v-if="request.status == 3">close</i>
              <i v-if="request.status == 4">done</i>
              <i v-if="request.status == 5">close</i>
              {{request.ServiceProvider.Service.title}}
            </div>
            <div class="timestamp" style="position: absolute; bottom: 0px; right: 10px; font-size: 13px;">
               {{ showDate(request.created_at) }}
            </div>
          </div>
        </template>
      </div>
    </div>

  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_MY_REQUESTS, CLEAR_STATE } from 'src/store/myRequests/myRequestsActions.js'

export default {
  computed: mapState({
    myRequestsState: state => state.myRequestsModule
  }),
  data () {
    return {
      color: ['bg-secondary', 'bg-green-3', 'bg-red-3', 'bg-blue-5', 'bg-red-3']
    }
  },
  created () {
    this.clearState()
    this.performLoadmyRequests()
  },
  methods: {
    ...mapActions({
      performLoadmyRequests: PERFORM_LOAD_MY_REQUESTS,
      clearState: CLEAR_STATE
    }),
    showDate (date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    goToSearch () {
      this.$router.push('/Search')
    },
    goToServiceRequest (id) {
      this.$router.push(`/ServiceRequest/${id}`)
    },
    goBack () {
      window.history.back()
    }
  },
  components: {
    sideMenu
  }
}
</script>
