<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">メール認証失敗</h4>
        </v-row>
      </v-card-title>
      <v-icon 
        class="mb-2"
        large
        color="orange"
        :style="{'font-size':'50px'}"
        >mdi-alert-circle</v-icon>
      <v-card-text class="pt-0 mt-3 mb-3 text-left" :style="{'color':'tomato'}">
        メール認証に失敗しました。有効期限を過ぎていないかご確認ください。
      </v-card-text> 
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
  },
  mounted() {
  },
  methods: {
  }
}
</script>
