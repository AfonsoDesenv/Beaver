<style>

#message {
    height: 80px;
    border-top: 1px solid #ddd;
}

#message textarea {
    height: 100%;
    width: 100%;
    padding: 10px;
    padding-right: 80px;
    outline: none;
    border: none;
    resize: none;
}

#message-textarea {
    height: 80px;
    border-top: 1px solid #ddd;
}

#message-textarea textarea {
    height: 100%;
    width: 100%;
    padding: 10px;
    padding-right: 80px;
    outline: none;
    border: none;
    resize: none;
}

</style>
<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="goBack()">
        <i>navigate_before</i>
      </button>
      <q-toolbar-title :padding="1">
        {{messageState.other_user ? messageState.other_user.name : '' }}
      </q-toolbar-title>
    </div>

    <sideMenu></sideMenu>
    <div id="messages" class="layout-view" style="padding: 5px; width: 100%; overflow: auto;">
      <div style="padding-bottom: 80px">
        <template v-for="(message, index) in messageState.messages">
          <div v-if="setupState.id === message.from_id" class="chat-you" style="padding-bottom: 6px; margin: 10px;">
            <div class="chat-date">
              {{ showDate(message.created_at) }}
            </div>
            <div class="chat-message" style="margin:15px;">
              <p>
                {{message.text}}
              </p>
            </div>
          </div>
          <div v-if="setupState.id !== message.from_id" class="chat-other" style="margin: 10px;">
            <div class="chat-date">
              {{ showDate(message.created_at) }}
            </div>
            <div class="chat-message" style="margin:15px;">
              <p>
                {{message.text}}
              </p>
            </div>
          </div>
        </template>
      </div>
      <div id="message-textarea" class="full-width fixed-bottom bg-grey-4">
          <textarea @keydown="preventEnterNewLine" @keyup="validateKey" placeholder="Escreva uma mensagem" v-model="message"></textarea>
          <button @click="validateMessage" class="circular primary fixed-bottom-right small" style="z-index: 10;right: 20px; bottom: 20px;"><i style="font-size:18px;">send</i></button>
      </div>
    </div>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import authMixin from 'src/authMixin.js'
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_USER } from 'src/store/setup/setupActions.js'
import { PERFORM_LOAD_MESSAGE, PERFORM_LOAD_OTHER_USER, PERFORM_SAVE_MESSAGE } from 'src/store/message/messageActions.js'

export default {
  mixins: [authMixin],
  data () {
    return {
      message: ''
    }
  },
  created () {
    this.loadUser()
    .then((response) => {
      this.loadOtherUser()
      .then((response) => {
        this.loadMessages()
      })
    })
  },
  updated () {
    var el = document.getElementById('messages')
    el.scrollTop = el.scrollHeight
  },
  components: {
    sideMenu
  },
  computed: {
    ...mapState({
      setupState: state => state.setupModule,
      messageState: state => state.messageModule
    })
  },
  methods: {
    ...mapActions({
      loadUser: PERFORM_LOAD_USER,
      loadOtherUser: PERFORM_LOAD_OTHER_USER,
      loadMessages: PERFORM_LOAD_MESSAGE,
      saveMessages: PERFORM_SAVE_MESSAGE
    }),
    goToLast () {
      this.$nextTick(() => {
        this.$el.parentNode.scrollTop = this.$el.parentNode.scrollHeight
      })
    },
    sendMessage (message) {
      this.message = ''
      this.$socket.emit('direct-message', {
        to: this.messageState.other_user.id,
        content: message
      })
    },
    showDate (date) {
      return moment(date).format('HH:mm')
    },
    validateKey (e) {
      if (e.shiftKey) {
        return
      }
      if (e.keyCode === 13) {
        this.validateMessage()
      }
    },
    preventEnterNewLine (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        return false
      }
    },
    validateMessage () {
      if (this.message) {
        this.sendMessage(this.message)
        this.message = ''
      }
    },
    goBack () {
      window.history.back()
    }
  },
  watch: {
    messages: function () {
      this.goToLast()
    }
  }
}
</script>
