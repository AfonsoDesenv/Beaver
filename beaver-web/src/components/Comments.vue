<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="goBack()">
        <i>navigate_before</i>
      </button>
      <q-toolbar-title :padding="1">
        Comentarios sobre você
      </q-toolbar-title>
    </div>
    <sideMenu></sideMenu>
    <div class="layout-view full-width">
      <div class="list">
        <template v-for="(comment, index) in commentsState.comments">
            <div class="item" style="height: auto;">
                <div class="item-content has-secondary">
                    {{comment.comment}}
                </div>
            </div>
            <hr>
        </template>
      </div>
    </div>
  </q-layout>
</template>

<script>
import sideMenu from 'src/components/SideMenu.vue'
import { mapActions, mapState } from 'vuex'
import { PERFORM_LOAD_COMMENTS, CLEAR_STATE } from 'src/store/comments/commentsActions.js'

export default {
  components: {
    sideMenu
  },
  computed: mapState({
    commentsState: state => state.commentsModule
  }),
  created () {
    this.clearState()
    this.performLoadComments()
  },
  methods: {
    ...mapActions({
      performLoadComments: PERFORM_LOAD_COMMENTS,
      clearState: CLEAR_STATE
    }),
    goBack () {
      window.history.back()
    }
  }
}
</script>
