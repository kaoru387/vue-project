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
      <v-card-title class="text-center pt-4 pb-0">
        <h4 class="fill-width">新規アカウント作成</h4>
        <v-card-text>詳細情報を入力してください。</v-card-text>
      </v-card-title> 
      <v-divider> </v-divider>
      <v-card-text>
        <v-form ref="loginForm">
          <v-text-field
            v-model="model.email"
            :rules="emailRules"
            autofocus
            dense
            height="45px"
            outlined
            placeholder="ログイン名"
          ></v-text-field>
          <v-text-field
            v-model="model.password"
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="passwordShow ? 'text' : 'password'"
            dense
            height="45px"
            name="input-password"
            outlined
            placeholder="パスワード"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>
          <v-text-field
            v-model="model.email"
            :rules="emailRules"
            dense
            height="45px"
            outlined
            placeholder="氏名"
          ></v-text-field>
          <v-text-field
            v-model="model.email"
            :rules="emailRules"
            dense
            height="45px"
            outlined
            placeholder="メールアドレス"
          ></v-text-field>
          <v-text-field
            v-model="model.email"
            :rules="emailRules"
            dense
            height="45px"
            outlined
            placeholder="携帯"
          ></v-text-field>
          <v-text-field
            v-model="model.email"
            :rules="emailRules"
            dense
            height="45px"
            outlined
            placeholder="住所"
          ></v-text-field>
        </v-form>
      </v-card-text> 
      <!-- <div class="login-btn">
        <v-btn block color="primary white--text" @click="login" :loading="loading">ログイン</v-btn>
      </div> -->
      <v-card-actions>
        <!-- <v-btn primary large block>Login</v-btn> -->
        <!-- <v-btn primary large block color="primary white--text" @click="login" :loading="loading">ログイン</v-btn> -->
        <v-btn
          class="fill-width caption"
          color="#FFCB00"
          depressed
          height="48px"
          tile
        >
          新規アカウント作成
        </v-btn>
      </v-card-actions>
      
      <v-divider></v-divider>
      <div class="pt-4 pb-2">
        <router-link to="/login">戻る</router-link>
        <!-- <router-link to="/login" class="primary--text">新規登録</router-link> -->
      </div>
    </v-card>
  </div>
  <!-- <div>
    <v-card
      :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
      class="mx-auto fill-width"
      flat
      max-width="640"
    >
      <v-card-title class="text-center pa-8">
        <h4 class="fill-width">会員情報入力</h4>
      </v-card-title>
      <v-divider> </v-divider>
      <div class="px-6 py-8">
        <div style="max-width:344px" class="mx-auto">
          
          <div class="separator separator_login_page">
            <div class="middle_separator">または</div>
          </div>
          <div class="pt-6">
            <div>
              <v-text-field
                v-model="model.email"
                :rules="[emailRules.required, emailRules.regex]"
                autofocus
                dense
                height="48px"
                outlined
                placeholder="メールアドレス"
              ></v-text-field>

              <v-text-field
                v-model="model.password"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[passwordRules.required, passwordRules.regex]"
                :type="passwordShow ? 'text' : 'password'"
                dense
                height="48px"
                name="input-password"
                outlined
                placeholder="パスワード"
                @click:append="passwordShow = !passwordShow"
              ></v-text-field>
            </div>
            <div class="login-btn pb-8">
              <v-btn
                class="fill-width caption"
                color="#FFCB00"
                depressed
                height="48px"
                tile
              >
                会員登録
              </v-btn>
            </div>
            <v-divider></v-divider>
            <div class="pt-8 pb-4">
              <span>すでにアカウントをお持ちですか？</span>
              <nuxt-link to="/login">ログインに移動</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div> -->

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
        // this.loading = true
        // APIでログイン認証を行う
        axios.post("/api/auth/login", this.model).then(res => {
          // 成功した場合
          if (res.data.result) {
            // ログイン情報を store に保存
            this.$store.dispatch("setLoginInfo", res.data)
            // 元の画面に戻る
            this.$router.push({path: "backuri" in this.$route.query && this.$route.query.backuri.match(/^\//) ? this.$route.query.backuri : '/'})
          // メールアドレスとパスワードが正しくない組み合わせだった場合
          } else {
            this.loading = false
            alert(Object.values(res.data.errors).join("\n"))
          }
        }).catch(error => {
          alert("処理が正しく行えませんでした。時間をおいてやり直してください。")
          this.loading = false
        })
      }
    }
  }
}
</script>
