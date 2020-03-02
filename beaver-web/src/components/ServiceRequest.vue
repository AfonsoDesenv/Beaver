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
        Solicitação de Serviço
      </q-toolbar-title>
    </div>

    <sideMenu></sideMenu>

    <div id="setupForm" class="layout-view">
      <form class="full-width">
        <div class="full-width">
          <div class="layout-padding">
            <label>Serviço</label>
            <input readonly class="full-width" :value="serviceRequestState.service_title">
            <br>
            <label v-if="serviceRequestState.user_id != setupState.id">Solicitante</label>
            <input v-if="serviceRequestState.user_id != setupState.id" readonly class="full-width" :value="serviceRequestState.user_name">
            <label v-if="serviceRequestState.user_id == setupState.id">Prestador do Serviço</label>
            <input v-if="serviceRequestState.user_id == setupState.id" readonly class="full-width" :value="serviceRequestState.provider_user_name">
            <br>
            <button class="primary full-width" @click="viewPerfil">
              {{view_perfil}}
            </button>
            <br>
            <div v-if="service_request_info != ''" class="full-width" :class="service_request_color" style="padding: 10px;">
              <center>
                <i>info</i> {{service_request_info}}
              </center>
            </div>
            <div v-if="serviceRequestState.user_id != setupState.id" align="right" style="padding-top: 10px;">
              <button class="red" v-if="serviceRequestState.status == 1" @click="openConfirmMsg(2)">
                <i>cancel</i>
              </button>
              <button class="green" v-if="serviceRequestState.status == 1" @click="openConfirmMsg(1)">
                <i>done</i>
              </button>
              <button class="primary" v-if="serviceRequestState.status == 2" @click="openConfirmMsg(3)">
                Concluír Solicitação
              </button>
            </div>
            <div v-if="serviceRequestState.user_id == setupState.id" align="right" style="padding-top: 10px;">
              <button class="red" v-if="serviceRequestState.status == 2" @click="openConfirmMsg(4)">
                Cancelar Solicitação
              </button>
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
    <q-modal ref="confirmModal" class="minimized" :content-css="{padding: '10px'}">
      <h5>{{confirm_text}}</h5>
      <div class="full-width" style="padding-top: 10px;">
        <center>
          <button class="red" style="margin: 10px;" @click="$refs.confirmModal.close()">Cancelar</button>
          <button class="primary" style="margin: 10px;" @click="confirm">Confirmar</button>
        </center>
      </div>
    </q-modal>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_SERVICE_REQUEST, PERFORM_ACCEPT_SERVICE_REQUEST, PERFORM_REFUSE_SERVICE_REQUEST, PERFORM_CONCLUDE_SERVICE_REQUEST, PERFORM_CANCEL_SERVICE_REQUEST, CLEAR_STATE } from 'src/store/serviceRequest/serviceRequestActions.js'
import { PERFORM_LOAD_USER } from 'src/store/setup/setupActions.js'
import { Toast } from 'quasar'

export default {
  components: {
    sideMenu
  },
  computed: mapState({
    serviceRequestState: state => state.serviceRequestModule,
    setupState: state => state.setupModule
  }),
  data () {
    return {
      service_request_info: '',
      service_request_color: 'grey',
      confirm_text: '',
      operation: 0,
      view_perfil: ''
    }
  },
  created () {
    this.loadServiceRequest()
  },
  methods: {
    ...mapActions({
      performLoadServiceRequest: PERFORM_LOAD_SERVICE_REQUEST,
      performAcceptServiceRequest: PERFORM_ACCEPT_SERVICE_REQUEST,
      performRefuseServiceRequest: PERFORM_REFUSE_SERVICE_REQUEST,
      performConcludeServiceRequest: PERFORM_CONCLUDE_SERVICE_REQUEST,
      performCancelServiceRequest: PERFORM_CANCEL_SERVICE_REQUEST,
      performLoadUser: PERFORM_LOAD_USER,
      clearState: CLEAR_STATE
    }),
    loadServiceRequest () {
      this.clearState()
      this.performLoadServiceRequest()
      .then((response) => {
        this.loadServiceRequestStatus()
        this.performLoadUser()
        .then((response) => {
          if (this.serviceRequestState.user_id !== this.setupState.id) {
            this.view_perfil = 'Visualizar perfil do solicitante'
          }
          else {
            this.view_perfil = 'Visualizar perfil do prestador de serviço'
          }
        })
      })
    },
    viewPerfil () {
      if (this.serviceRequestState.user_id === this.setupState.id) {
        this.$router.push(`/ProviderPerfil/${this.serviceRequestState.service_provider_id}`)
      }
      else {
        this.$router.push(`/UserPerfil/${this.serviceRequestState.service_provider_id}/${this.serviceRequestState.user_id}`)
      }
    },
    openConfirmMsg (operation) {
      this.$refs.confirmModal.open()
      this.operation = operation
      switch (operation) {
        case 1:
          this.confirm_text = 'Deseja aceitar a solicitação de ' + this.serviceRequestState.user_name + '?'
          break
        case 2:
          this.confirm_text = 'Deseja recusar a solicitação de ' + this.serviceRequestState.user_name + '?'
          break
        case 3:
          this.confirm_text = 'Deseja concluir a solicitação de ' + this.serviceRequestState.user_name + '?'
          break
        case 4:
          this.confirm_text = 'Deseja cancelar a solicitação de ' + this.serviceRequestState.user_name + '?'
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
          this.concludeServiceRequest()
          break
        case 4:
          this.cancelServiceRequest()
          break
      }
    },
    loadServiceRequestStatus () {
      switch (this.serviceRequestState.status) {
        // 1 - open / 2 - accepted / 3 - closed / 4 - canceled
        case 1:
          this.service_request_info = 'Solicitação aberta em ' + this.showDate(this.serviceRequestState.updated_at)
          this.service_request_color = 'bg-secondary'
          break
        case 2:
          this.service_request_info = 'Solicitação aceita em ' + this.showDate(this.serviceRequestState.updated_at)
          this.service_request_color = 'bg-green-3'
          break
        case 3:
          this.service_request_info = 'Solicitação recusada em ' + this.showDate(this.serviceRequestState.updated_at)
          this.service_request_color = 'bg-red-3'
          break
        case 4:
          this.service_request_info = 'Solicitação concluída em ' + this.showDate(this.serviceRequestState.updated_at)
          this.service_request_color = 'bg-grey-3'
          break
        case 5:
          this.service_request_info = 'Solicitação cancelada em ' + this.showDate(this.serviceRequestState.updated_at)
          this.service_request_color = 'bg-red-3'
          break
      }
    },
    acceptServiceRequest () {
      this.performAcceptServiceRequest()
      .then((response) => {
        if (response.success) {
          this.loadServiceRequest()
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
          this.loadServiceRequest()
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
    concludeServiceRequest () {
      this.performConcludeServiceRequest()
      .then((response) => {
        if (response.success) {
          this.loadServiceRequest()
          Toast.create.positive({
            html: 'Solicitação concluída com sucesso.'
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
          this.loadServiceRequest()
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
      if (this.serviceRequestState.user_id === this.setupState.id) {
        this.$router.push(`/Message/${this.serviceRequestState.provider_user_id}`)
      }
      else {
        this.$router.push(`/Message/${this.serviceRequestState.user_id}`)
      }
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
