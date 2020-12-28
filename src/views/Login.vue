<template>
  <v-container class="about">
    <h1>ログイン</h1>
    <v-card class="elevation-1 pa-3 login-card">
	    <v-card-text>
	      <div class="layout column align-center">
	        <h1 class="flex my-4 primary--text font-weight-bold">ログイン</h1>
	      </div>
	      <v-form ref="loginForm">
	        <v-text-field
	          append-icon="person"
	          name="login"
	          label="メールアドレス"
	          type="text"
	          v-model="model.email"
	          :counter="128"
	          :rules="emailRules"
	          required
	        ></v-text-field>
	        <v-text-field
	          append-icon="lock"
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
	    <div class="login-btn">
	      <v-btn block color="primary" @click="login" :loading="loading">ログイン</v-btn>
	    </div>
	  </v-card>
  </v-container>
</template>

<script>
import store from '../store/app';
// import calendar from '../components/Calendar'
import HelloWorld from '../components/HelloWorld'
import axios from 'axios';
import _ from 'lodash';

export default {
	components: {
		// calendar
		// HelloWorld
  	},
	data: function () {
	    return {
	    	loading: false,
		    post: null,
		    isActive: '1',
		    eventForm: {
		        title: "新しいイベント",
		        start: "2020-08-14"
		    },
		    info: [],
		    model: {
		      email: "",
		      password: ""
		    }
	    }
	},
	// props: {
	//     events: { 
	//     	type: Array,
	//     	default: () => {} 
	//     },
	// },
	computed: {
	    events() {
	      return store.state.result.events;
	    },
	},
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
	    console.log('bru',to)
	    next();
	},
	beforeRouteEnter (to, from, next) { // eslint-disable-line
	    console.log('beforeRouteEnter!')
	    next()
	},
	created () {
	},
	methods: {
	    login() {

	      // // バリデーションが通った場合
	      // if (this.$refs.loginForm.validate()) {
	      //   // ぐるぐる表示にしてボタンを二度押しできなくする
	      //   this.loading = true

	      //   // APIでログイン認証を行う
	      //   axios.post("/api/auth/login", this.model).then(res => {
	      //     // 成功した場合
	      //     if (res.data.result) {
	      //       // ログイン情報を store に保存
	      //       this.$store.dispatch("setLoginInfo", res.data)
	      //       // 元の画面に戻る
	      //       this.$router.push({path: "backuri" in this.$route.query && this.$route.query.backuri.match(/^\//) ? this.$route.query.backuri : '/'})
	      //     // メールアドレスとパスワードが正しくない組み合わせだった場合
	      //     } else {
	      //       this.loading = false
	      //       alert(Object.values(res.data.errors).join("\n"))
	      //     }
	      //   }).catch(error => {
	      //     alert("処理が正しく行えませんでした。時間をおいてやり直してください。")
	      //     this.loading = false
	      //   })
	      // }
	      
	    }
	}
}
</script>