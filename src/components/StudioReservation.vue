<template>
  <div>
    <v-container>
      <v-row class="d-flex pr-3 pl-3">
        <h4 class="my-box flex-grow-1 mt-2 text-left">スタジオ予約（会員専用）</h4>
        <el-button
          type="primary"
          icon="fas fa-edit"
          class="my-box mb-1"
          @click="handleClick"
        >予約回数チケット購入</el-button>
      </v-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="個人レッスン" name="first" selected>
          <iframe src="https://www.supersaas.jp/schedule/susture/StudioReservation" width="100%" :height=height></iframe>
        </el-tab-pane>
        <el-tab-pane label="グループレッスン" name="second">
          <iframe src="https://www.supersaas.jp/schedule/susture/GroupLessons" width="100%" :height=height></iframe>
        </el-tab-pane>
      </el-tabs>

      <!-- <v-row class="text-center">
      </v-row> -->
    </v-container>
    <modal-shop-ticket ref="dialogShopTicket" :dialog-form-visible="modal_shop_visible" :close-modal="close_shop_modal" />
  </div>
</template>

<script>
  import ModalShopTicket from './ModalShopTicket'

  export default {
    components: {
      ModalShopTicket
    },
    data: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
      modal_shop_visible: false,
      activeName: 'first'
    }),
    methods: {
      handleClick: function() {
        // console.log('ok')
        this.modal_shop_visible = true;
      },
      close_shop_modal: function() {
        this.modal_shop_visible = false;
      },
    }
  }
</script>
