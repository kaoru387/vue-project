<template>
  <v-app>
    <v-card flat>
      <v-card-text class="p-0 m-0">
        <div class="layout column align-center">
          <h4 class="flex my-4">スタジオ予約</h4>
        </div>
      </v-card-text>
    </v-card>
    <v-main>
      <!-- <v-container fluid> -->
        <router-view v-loading="loading"/>  
      <!-- </v-container> -->
    </v-main>
  </v-app>
  <!-- <v-app>
    <v-toolbar flat>
      <v-card-text>
        <div class="layout column align-center">
          <h4 class="flex mt-5">スタジオ予約</h4>
        </div>
      </v-card-text>
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
  </v-app> -->
</template>

<script>
  import store from './store/app';
  // import { VCard, VCardText, VCardMedia } from 'vuetify/lib'

export default {
  name: 'App',
  components: {
    // VCard,
    // VCardText,
    // VCardMedia
  },
  data() {
    return {
      activeIndex: 'Home',
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
    },
  }
};
</script>
