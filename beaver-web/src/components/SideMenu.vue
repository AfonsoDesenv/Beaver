<template lang="html">
  <q-drawer ref="leftDrawer" swipe-only>
    <div class="toolbar light">
      <q-toolbar-title :padding="1">
          Opções
      </q-toolbar-title>
    </div>
    <div class="list no-border platform-delimiter">
      <q-drawer-link icon="search" to="/Search" exact>
        Buscar
      </q-drawer-link>
      <hr>
      <q-drawer-link icon="home" to="/">
        Príncipal
      </q-drawer-link>
      <q-drawer-link icon="assignment" to="/Services">
        Serviços
      </q-drawer-link>
      <q-drawer-link icon="assignment" to="/MyRequests">
        Minhas Solicitações
      </q-drawer-link>
      <q-drawer-link icon="send" to="/Messages">
        Mensagens
      </q-drawer-link>
      <q-drawer-link icon="message" to="/Comments">
        Comentarios
      </q-drawer-link>
      <q-drawer-link icon="build" to="/Setup">
        Configurações
      </q-drawer-link>
      <button class="item full-width" @click="onLogout">
          <i class="item-primary">exit_to_app</i>
          <div class="item-content">
              Sair
          </div>
      </button>
    </div>
  </q-drawer>
</template>
<script>
import { logout } from 'src/resources/token.js'

export default {
  methods: {
    onLogout () {
      logout()
      this.$router.push('/signin')
    },
    open () {
      this.$refs.leftDrawer.open()
    }
  }
}

</script>
