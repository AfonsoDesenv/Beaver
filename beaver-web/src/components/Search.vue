<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.sideMenu.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Busca
      </q-toolbar-title>
    </div>

    <sideMenu ref="sideMenu"></sideMenu>
    <topTab slot="header"></topTab>

    <div slot="navigation" class="toolbar primary">
      <q-search v-model="search" class="primary" placeholder="Pesquisar"  @input="doSearch()" ></q-search>
    </div>
    <div class="layout-view">
      <div class="list">
        <template v-for="service in services">
          <div class="item" style="height: 40px;" @click="goToMap(service.id)">
              <div class="item-content has-secondary">
                  {{service.title}}
              </div>
            </div>
          </router-link>
          <hr>
        </template>
      </div>
    </div>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import topTab from 'src/components/TopTab.vue'
import { LocalStorage } from 'quasar'
import axios from 'axios'

export default {
  data () {
    return {
      services: [],
      search: ''
    }
  },
  components: {
    sideMenu,
    topTab
  },
  created () {
    axios.get('http://localhost:3000/services/' + this.search, {headers: {authorization: LocalStorage.get.item('token')}})
    .then(response => {
      this.services = response.data
    })
    .catch(e => {
      this.$router.push('/signin')
    })
  },
  methods: {
    doSearch () {
      axios.get('http://localhost:3000/services/' + this.search, {headers: {authorization: LocalStorage.get.item('token')}})
      .then(response => {
        this.services = response.data
      })
      .catch(e => {
        this.$router.push('/signin')
      })
    },
    goToMap (id) {
      this.$router.push({
        path: 'Map',
        query: { service_id: id }
      })
    }
  }
}
</script>
