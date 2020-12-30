<template>
  <!-- <div class="login">
    <form method="post" action="https://www.supersaas.com/api/users">
      <input type="hidden" name="account" value="susture"/>
      <input type="hidden" name="id" value="1234fk"/> 
      <input type="hidden" name="user[name]" value="A@susture.com"/>
      <input type="hidden" name="user[full_name]" value="生徒A"/>
      <input type="hidden" name="user[email]" value="A@susture.com"/>
      <input type="hidden" name="user[mobile]" value=""/>
      <input type="hidden" name="user[address]" value=""/>
      <input type="hidden" name="checksum" value="1e5dcff50bb5f9a5273602b25a2f0d41"/>
      <input type="hidden" name="after" value="experience"/>
      <input type="submit" value="Book now"/>
    </form>
  </div> -->
  <div>
    <v-card 
      :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
      class="mx-auto fill-width"
      flat
      >
      <v-card-title class="text-center pt-4 pb-5">
        <h4 class="fill-width">ログイン</h4>
      </v-card-title> 
      <v-card-text class="pt-0">
        <!-- <div class="layout column align-center">
          <h2 class="flex my-4 primary--text font-weight-bold">ログイン</h2>
        </div> -->
        <v-form ref="loginForm">
          <v-text-field
            :append-icon=person
            name="login"
            label="メールアドレス"
            type="text"
            v-model="model.email"
            :counter="128"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            :append-icon="lock"
            name="password"
            label="パスワード"
            id="password"
            type="password"
            v-model="model.password"
            :counter="32"
            :rules="passwordRules"
            required
          ></v-text-field>
        </v-form>
      </v-card-text> 
      <v-card-actions>
        <!-- <v-btn primary large block>Login</v-btn> -->
        <!-- <v-btn primary large block color="primary white--text" @click="login" :loading="loading">ログイン</v-btn> -->
        <v-btn
          class="fill-width caption"
          color="#FFCB00"
          depressed
          height="48px"
          tile
          @click="login" 
        >
          ログイン
        </v-btn>
      </v-card-actions>

      <div class="pt-4 pb-1">
        <router-link to="/">キャンセル</router-link>
      </div>
      <!-- <v-divider></v-divider>
      <div class="pt-5 pb-3">
        <span>アカウントはお持ちですか？</span>
        <router-link to="/account" class="primary--text">新規アカウントを作成する。</router-link>
      </div> -->
      <!-- <div class="separator separator_login_page">
        <div class="middle_separator">または</div>
      </div>
      <div class="pt-6 pb-4">
        <v-btn
          elevation="2"
          large
          medium
          small
          x-large
          x-small
        >アカウントなしで予約する</v-btn>
      </div> -->
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import { mdiAccount,mdiKey } from '@mdi/js'
export default {
  data() {
    return {
      loading: false,
      emailRules: [
        v => !!v || "メールアドレスは必須項目です。",
        v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
      ],
      passwordRules: [
        v => !!v || "パスワードは必須項目です。",
        v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
      ],
      model: {
        email: "",
        password: ""
      },
      person: mdiAccount,
      lock: mdiKey,
      passwordShow: false
    }
  },
  // data: () => ({
  //   loading: false,
  //   emailRules: [
  //     v => !!v || "メールアドレスは必須項目です。",
  //     v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
  //     v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
  //   ],
  //   passwordRules: [
  //     v => !!v || "パスワードは必須項目です。",
  //     v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
  //   ],
  //   model: {
  //     email: "",
  //     password: ""
  //   },
  //   person: mdiAccount,
  //   lock: mdiKey,
  // }),
  created: function () {
    store.commit('SET_ISLOADING', false)
  },
  methods: {
    login() {
      // バリデーションが通った場合
      if (this.$refs.loginForm.validate()) {

        // ぐるぐる表示にしてボタンを二度押しできなくする
        // store.commit('SET_ISLOADING', true);
        store.dispatch('getUsers');
        console.log(store.state.result.users);



        // APIでログイン認証を行う
        // axios.post("/api/auth/login", this.model).then(res => {
        //   // 成功した場合
        //   if (res.data.result) {
        //     // ログイン情報を store に保存
        //     this.$store.dispatch("setLoginInfo", res.data)
        //     // 元の画面に戻る
        //     this.$router.push({path: "backuri" in this.$route.query && this.$route.query.backuri.match(/^\//) ? this.$route.query.backuri : '/'})
        //   // メールアドレスとパスワードが正しくない組み合わせだった場合
        //   } else {
        //     this.loading = false
        //     alert(Object.values(res.data.errors).join("\n"))
        //   }
        // }).catch(error => {
        //   alert("処理が正しく行えませんでした。時間をおいてやり直してください。")
        //   this.loading = false
        // })

      }
    }
  }
}
</script>
