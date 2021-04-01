<template>
  <el-dialog
    id="card-element"
    title="商品購入"
    custom-class="dialog_shop"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="95%"
    append-to-body
    @close="closeModal"
    :style = "{'max-width':'375px','margin': '20px auto'}"
    center
  >
  <!-- <div id="card-element"> 
  </div> -->
  <!-- We'll put the error messages in this element -->
  <div id="card-errors" ref="cardErrors" role="alert"></div>

  <!-- <button v-on:click="payment">
    購入する
  </button> -->

  <!-- <div class="text-center mb-1">
    <a class="text-decoration-underline" :style="{'color':'blue !important'}" rel="noreferrer" @click="onLinkClick">
      キャンセル
    </a>
  </div> -->

  <!-- 
  <div v-if="info.browser=='safari' && !isSafariLogin" class="mb-5">
    <el-alert
      class="mt-3 mb-3"
      type="error"
      description="申し訳ありません、ご使用のsafariブラウザでは再ログインが必要です。"
      show-icon>
    </el-alert>
    <a :href='supersass.host+"/login?m=1&account="+supersass.account+"&after=/form/"+supersass.account+"/login_form&user[name]="+auth.email+"&checksum="+auth.checksum' @click="onLinkClick" target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから再ログインお願いいたします。</a>
  </div>
  <div v-else>
    <el-alert
        :closable="false"
        class="text-left mt-1 mb-1"
        type="info"
        description="ご希望の商品をお選びいただき、決済購入お願いいたします。"
        show-icon>
    </el-alert>
    <iframe :src='supersass.host+"/login?account="+supersass.account+"&after=/shop/buy/"+supersass.account+"&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
  </div> -->
  </el-dialog>
</template>

<script>
  import store from '../store/app';
  import firebase from "@firebase/app";
  // import { loadStripe } from '@stripe/stripe-js';

  export default {
    components: {
      // StripeCheckout
    },
    props: {
      dialogFormVisible: {
        type: Boolean,
        default: false,
      },
      closeModal: {
        type: Function,
        default: function () {},
      },
    },
    data () {
      return {
        isSafariLogin: false,
        // stripe: "",
        card: null,
      }
    },
    computed: {
      loading() {
        return store.state.isLoading;
      },
      height() {
        return window.screen.height;
      },
      auth() {
        return store.state.auth;
      },
      info() {
        return store.state.info;
      },
      supersass() {
        return store.state.auth.supersass;
      },
    },
    mounted: function () {
      console.log('wa')

      // window.addEventListener('resize', this.handleResize)
    },
    created: function() {
      // console.log(localStorage.getItem('isSafariLogin'));
      // this.isSafariLogin = localStorage.getItem('isSafariLogin');

    },
    methods: {
      // handleResize: function() {
      //   // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      //   this.width = window.innerWidth;
      //   this.height = window.innerHeight;
      // },
      payment() {
        // let res = await axios.post("https://xxxxxxxxxx.execute-api.xx-xxxx-1.amazonaws.com/env/", {
        //     amount: 1000
        //     description: "なんとか商店オンラインとか",
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       // これはcognitoでサインしていれば、「Amplify.Auth.currentAuthenticatedUser().then((data) => {」から取れるものをstateに入れてるところから取得
        //       'Authorization': store.state.user.signInUserSession.idToken.jwtToken,
        //     }
        //   }
        // )
        // const client_secret = res.data.client_secret;

        // //client_secretを利用して（確認情報をStripeに投げて）決済を完了させる
        // const confirmRes = await this.stripe.confirmCardPayment(client_secret, {
        //   payment_method: {
        //     // card: this.props.elements.getElement('card'),
        //     card: this.card,
        //     billing_details: {
        //       name: res.data.metadata.username,
        //     }
        //   }
        // });
        // if (confirmRes.paymentIntent.status === "succeeded") {
        //   alert("決済完了")
        // }
      },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
      // onLinkClick() {
      //   this.close()
      //   store.commit('SET_SAFARI_LOGIN', true)
      //   localStorage.setItem('isSafariLogin', true);
      //   this.$emit('reload');
      // }
    },
  }
</script>
