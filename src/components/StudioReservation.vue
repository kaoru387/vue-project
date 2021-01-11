<template>
  <div>
    <v-container fluid>
      <div class="text-right mr-2 mb-2">
        <router-link to="/">カレンダーへ戻る</router-link>
      </div>
      <v-row class="d-flex pr-3 pl-3 pb-3">
        <h4 class="my-box flex-grow-1 mt-2 text-left">会員専用</h4>
        <el-button
          type="primary"
          icon="fas fa-edit"
          class="my-box mb-1"
          @click="handleClick"
        >予約回数チケット購入</el-button>
      </v-row>
      <el-tabs v-model="activeName">
        <!-- <div v-if="info.browser=='safari'">
          <el-alert
            class="mb-3"
            type="error"
            description="申し訳ありません、ログインできないブラウザです。"
            show-icon>
          </el-alert>
          <a :href='"https://schedule.kdev.page/api/login?account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' target="_blank" rel="noreferrer">こちらからログインできます</a>
        </div> -->

        <el-tab-pane label="個人利用" name="first" selected>
          <!-- <iframe src="https://www.supersaas.com/api/login?account=susture&after=GroupLessons&user[name]=C@susture.com&checksum=1e5dcff50bb5f9a5273602b25a2f0d41" width="100%" :height=height></iframe> -->
          <!-- <iframe :src='"https://www.supersaas.com/api/login?account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' width="100%" :height=height></iframe> -->

          <v-card 
            tile
            max-width="360px"
            :style="{'margin':'0 auto'}"
            :height=height
            >
            <!-- <iframe v-if="info.browser!='safari'" src="https://schedule.kdev.page/schedule/susture/StudioReservation?m=1" frameborder="0" width="100%" :height=height @load="onLoad"></iframe> -->
            <iframe src="https://schedule.kdev.page/schedule/susture/StudioReservation?m=1" frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
          </v-card>

          
          <!-- <iframe :src='"https://schedule.kdev.page/schedule/susture/StudioReservation?m=1&name="+auth.email+"&password=kaoru1225"' frameborder="0" width="360px" :height=height> </iframe> -->

          <!-- <iframe :src='"https://www.supersaas.com/api/login?account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' srcdoc="&lt;img src&equals;x:x onerror&equals;alert&lpar;1&rpar;&gt;" /> -->
          
          <!-- <vue-friendly-iframe src="https://schedule.kdev.page/schedule/susture/StudioReservation" frameborder="0" allow="encrypted-media" width="100%" :height=height :style="{'width':'100%'}">
          </vue-friendly-iframe> -->

          <!-- <iframe :src='"https://schedule.kdev.page/api/login?account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' width="100%" :height=height></iframe> -->

        </el-tab-pane>
        <el-tab-pane label="グループ利用" name="second">
          <!-- <iframe :src='"https://www.supersaas.com/api/login?account=susture&after=GroupLessons&user[name]="+auth.email+"&checksum="+auth.checksum' width="100%" :height=height></iframe> -->
          <v-card 
            tile
            max-width="360px"
            :style="{'margin':'0 auto'}"
            :height=height
            >
            <iframe v-if="info.browser!='safari'" src="https://schedule.kdev.page/schedule/susture/GroupLessons?m=1" frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
          </v-card>
        </el-tab-pane>
      </el-tabs>
    </v-container>
    <modal-shop-ticket ref="dialogShopTicket" :dialog-form-visible="modal_shop_visible" :close-modal="close_shop_modal" />
  </div>
</template>

<script>
  import store from '../store/app';
  import ModalShopTicket from './ModalShopTicket'

  export default {
    components: {
      ModalShopTicket
    },
    data: () => ({
      width: window.innerWidth,
      height: window.innerHeight-100,
      modal_shop_visible: false,
      activeName: 'first',
      userProvidedHtml: 'https://schedule.kdev.page/schedule/susture/StudioReservation'
    }),
    computed: {
      selectDate() {
        return store.state.selectDate;
      },
      auth() {
        return store.state.auth;
      },
      info() {
        return store.state.info;
      },
    },
    methods: {
      handleClick: function() {
        // console.log('ok')
        this.modal_shop_visible = true;
      },
      close_shop_modal: function() {
        this.modal_shop_visible = false;
      },
      onLoad() {

      },
    }
  }
</script>
