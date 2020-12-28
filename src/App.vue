<template>
  <v-app>
    <v-toolbar flat>
      <v-spacer>スタジオ予約</v-spacer>
      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
          fixed-tabs
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab
            href="#mobile-tabs-5-1"
            class="primary--text"
            to="/"
          >
            スケジュール
          </v-tab>

          <v-tab
            href="#mobile-tabs-5-2"
            class="primary--text"
            to="/reservation"
          >
            会員専用
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-main>
      <v-container fluid>
        <router-view v-loading="loading"/>  
      </v-container>
    </v-main>
    <modal-login ref="dialogLogin" :dialog-form-visible="modal_login_visible" :close-modal="close_login_modal" />
  </v-app>
</template>

<script>
  import store from './store/app';


export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      activeIndex: 'Home',
      // height: window.innerHeight,
      // width: window.innerWidth,
      tabs: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      modal_login_visible: false,
    }
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
  },
  created: function () {
    // store.dispatch('getUsers')
    // let that = this
    // store.dispatch('getNonMembers')
    // store.dispatch('getServiceResources')
    // store.dispatch('getDatas', function(e){
    //   console.log('success',e);
    //   that.bookLoaded(e.data)
    // });
  },
  methods: {
    close_login_modal: function() {
        this.modal_login_visible = false;
    },
    handleSelect(key, keyPath) {
      // this.activeIndex = this.$route.name;
      this.activeIndex = key;
    }
  }
};
</script>
