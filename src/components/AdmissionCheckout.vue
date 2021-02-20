<template>
  <div>
    <div id="card-element">
    </div>
    <div id="card-errors" ref="cardErrors" role="alert"></div>
  </div>
</template>

<script>
  import store from '../store/app';
  import firebase from "@firebase/app";
  import axios from 'axios';
  import { loadStripe } from '@stripe/stripe-js';
  const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');
  // import { StripeElementCard, StripeCheckout } from '@vue-stripe/vue-stripe';
  // import VueStripeCheckout from "vue-stripe-checkout";

  export default {
    components: {
    },
    data() {
      return {
        // publishableKey: 'pk_test_51HU17xEL8vDvw6C3KK8sAW82ZkUnlLo7pRjQWkoiMNjjJiiaHOsL6uEpaO7URE55CGJAu3KIxOIy06azOtFVxp8J006cwjspAu',
        // loading: false,
        // lineItems: [
        //   {
        //     price: 'price_1IIV7AEL8vDvw6C3dpvPvESZ', // The id of the one-time price you created in your Stripe dashboard
        //     quantity: 1,
        //   },
        // ],
        // successURL: 'https://localhost:4006/success',
        // cancelURL: 'https://localhost:4006',
      };
    },
    mounted: function () {
      let that = this;

      const processA = async function() {
        const stripe = await stripePromise;
        const response = await firebase.functions().httpsCallable('postStripe');
        await response({
          path: '/create-checkout-session-ticket',
          method: 'POST',
          params: {
            price: "price_1IJeKsAXJN6gcxR42W81FB4f",
            quantity: 1,
          },
          success_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeSuccessAdmission",
          cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log('user',res);
          // callback(res)

          const session = res.data;
          console.log(session.id)
          const sessionId = session.id;

          // When the customer clicks on the button, redirect them to Checkout.
          const result = stripe.redirectToCheckout({
            sessionId: sessionId,
          });
          if (result.error) {
            console.log(result.error.message);
          }

        });

        

      }
      const processAll = async function() {
        await processA()
      }
      processAll()

      
    },
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
      submit() {
        console.log('wa')

      },
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
      // submit () {
      //   console.log(document.getElementById('root'))
      //   // You will be redirected to Stripe's secure checkout page
      //   // this.$refs.VueStripeCheckout.redirectToCheckout();
      // },
    }
  }
</script>
