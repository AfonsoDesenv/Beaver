<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.sideMenu.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Conversas
      </q-toolbar-title>
    </div>

    <sideMenu ref="sideMenu"></sideMenu>
    <topTab slot="header"></topTab>
    <div class="layout-view">
      <template v-for="(message, index) in messages">
          <div class="item one-line" @click="goToMessage(message.id)">
            <img class="item-primary thumbnail" v-if="message.picture" :src="message.picture"></img>
            <img class="item-primary thumbnail" v-if="!message.picture" src="../resources/pictures/user.jpg">
            <div class="item-content">
              {{message.name}}
            </div>
            <div class="timestamp" style="position: absolute; bottom: -5px; right: 10px; font-size: 13px;">
               {{ showDate(message.created_at) }}
            </div>
          </div>
          <hr>
      </template>
    </div>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import topTab from 'src/components/TopTab.vue'
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import { PERFORM_LOAD_MESSAGES, CLEAR_STATE } from 'src/store/messages/messagesActions.js'

export default {
  components: {
    sideMenu,
    topTab
  },
  computed: mapState({
    messagesState: state => state.messagesModule
  }),
  data () {
    return {
      messages: [],
      input_search: ''
    }
  },
  created () {
    this.clearState()
    this.performLoadMessages()
    .then((response) => {
      this.messages = response
    })
  },
  methods: {
    ...mapActions({
      performLoadMessages: PERFORM_LOAD_MESSAGES,
      clearState: CLEAR_STATE
    }),
    showDate (date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    goToMessage (id) {
      this.$router.push(`/Message/${id}`)
    }
  }
}
</script>
