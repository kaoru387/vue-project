<template>
  <div>
    <v-card 
      max-width="360px"
      :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
      :style="{'margin':'0 auto'}"
      >
      <!-- <v-card-title class="text-left pt-4 pb-5">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">会員新規登録</h4>
        </v-row>
      </v-card-title>  -->
      <div class="text-center pt-5 pb-0 text-primary">
        <h4>会員新規登録</h4>
      </div> 
      <v-card-text class="pt-0">
        <validation-observer ref="observer" v-slot="ObserverProps" tag="form" @submit.prevent="submit()">
          <div class="form-row">
            <!-- <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="email" rules="required|email|emailcheck" v-slot="prop">
                  <v-text-field
                    name="email"
                    label="メールアドレス"
                    type="email"
                    v-model="form.email"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="password" rules="required|min:6" v-slot="prop">
                  <v-text-field
                    label="パスワード"
                    name="password"
                    type="password"
                    v-model="form.password"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div> -->
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="電話番号" rules="phonecheck|required" v-slot="prop">
                  <v-text-field
                    name="電話番号"
                    label="電話番号：必須：ハイフンなし"
                    type="number"
                    v-model="form.phone"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="ユーザー名" rules="required" v-slot="prop">
                  <v-text-field
                    name="ユーザー表示名"
                    label="ユーザー表示名：必須"
                    type="text"
                    v-model="form.full_name"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="住所" v-slot="prop">
                  <v-text-field
                    name="住所"
                    label="住所"
                    type="text"
                    v-model="form.address"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="block">
                <el-button class="m-0" type="success" :style="{'width': '100%'}" @click="submit">
                  新規登録
                </el-button>
                <el-button type="secondary" class="m-0 mt-5 mb-3" :style="{'width': '100%'}" @click="cancel">キャンセル</el-button>
              </div>
            </div>

          </div>
        </validation-observer>
      </v-card-text> 
      <!-- <v-card-actions>
        <v-btn
          class="fill-width caption"
          color="#FFCB00"
          depressed
          height="48px"
          tile
          @click="login" 
        >
          新規登録
        </v-btn>
      </v-card-actions> -->
    </v-card>
    <v-divider></v-divider>
  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '../store/app';
  import axios from "axios"
  import _ from 'lodash';
  import firebase from "../Firebase";
  // import { mdiAccount,mdiKey } from '@mdi/js'

  import { PhoneNumberUtil } from 'google-libphonenumber'
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import { extend } from'vee-validate'
  // エラーメッセージを設定する
  // extend('emailcheck', {
  //   message: 'メールアドレスは既に存在しています。',
  //   validate(value) {
  //     let index = _.findIndex(store.state.result.users, function(o) {
  //         return value==o.name;
  //     });
  //     if(index==-1) return true;
  //     return false;
  //   }
  // });
  extend('phonecheck', {
    message: '電話番号は既に存在しています。',
    validate(value) {
      let index = _.findIndex(store.state.result.users, function(o) {
          return value==o.name;
      });
      if(index==-1) return true;
      return false;
    }
  });
  // extend('phone', {
  //   message: '{_field_}の形式が有効ではありません。',
  //   validate(value) {
  //     const util = PhoneNumberUtil.getInstance()
  //     try {
  //       const phoneNumber = util.parseAndKeepRawInput(value, 'JP')
  //       return util.isValidNumber(phoneNumber)
  //     } catch (err) {
  //       return false
  //     }
  //   }
  // })

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      form: {
        // email: "",
        password: "",
        full_name: "",
        name: "",
        address:"",
        phone:"",
      },
      // person: mdiAccount,
      // lock: mdiKey,
      passwordShow: false,
      Validation:{
        loginReult: "",
      }
    }
  },
  computed: {
    users() {
      return store.state.result.users;
    },
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
  },
  mounted() { 
  },
  methods: {
    async submit() {

      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
        return;
      }
      store.commit('SET_ISLOADING', true) 

      let that = this;
      const save = await store.dispatch('addUser',{
        params: that.form,
        callback: function(res){
          console.log('新規登録に成功しました!!')
          return res;
        }
      });
      // console.log(that.form)

      // const f = await firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password).then(
      //   (user) => {
          
      //     let currentUser = firebase.auth().currentUser;
      //     console.log('OK', currentUser);
      //     currentUser.updateProfile({
      //       displayName: that.form.username,
      //     }).then(function() {
           
      //     }).catch(function(error) {
      //       // An error happened.
      //     });

      //     // 保留
      //     currentUser.sendEmailVerification()
      //     .then(() => {
      //       that.$router.replace('/sendemail')
      //     }).catch((err) => {
      //       alert('EmailVerificationでerrが発生しました。', err)
      //     })
          
      //   },
      //   (err) => {
      //     let errorCode = err.code
      //     let errorMessage = err.message
      //     // console.log(errorCode)
      //     if(errorCode=='auth/email-already-in-use') {
      //       alert('emailは既に存在しています！');
      //     }
      //   }
      // )
      
    },
    cancel() {
      this.$router.push({path: '/'});
    }
  }
}
</script>
