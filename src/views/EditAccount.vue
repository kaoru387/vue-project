<template>
  <div>
    <!-- <div id="firebaseui-auth-container"></div> -->
    <!-- <div id="loader">Loading...</div> -->
    <v-card 
      max-width="360px"
      :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
      :style="{'margin':'0 auto'}"
      >
      <div class="text-center pt-5 pb-0 text-primary">
        <h4>会員情報!</h4>
      </div> 
      <v-card-text class="pt-0">
        <validation-observer ref="observer" v-slot="ObserverProps" tag="form">
          <div class="form-row">
            <div class="col-12 p-2 pt-5 pb-3 text-left">
              <h5>{{ form.email }}</h5>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="ユーザー名" rules="required" v-slot="prop">
                  <v-text-field
                    name="ユーザー名"
                    type="text"
                    label="ユーザー名：必須"
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
                    label="住所：任意"
                    type="text"
                    v-model="form.address"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="電話番号" rules="phone" v-slot="prop">
                  <v-text-field
                    name="電話番号"
                    label="電話番号：任意"
                    type="text"
                    v-model="form.phone"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="block">
                {{form.full_name}}
                <!-- <el-button :disabled="false" class="m-0" type="success" :style="{'width': '100%'}" @click="submit">
                  更新
                </el-button> -->
                <v-btn
                  class="ma-2"
                  :loading="loading"
                  :disabled="loading"
                  color="info"
                  @click="submit = 'loading4'"
                >
                  Icon Loader
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                </v-btn>

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
  extend('emailcheck', {
    message: 'メールアドレスは既に存在しています。',
    validate(value) {
      let index = _.findIndex(store.state.result.users, function(o) {
          return value==o.name;
      });
      if(index==-1) return true;
      return false;
    }
  });
  extend('phone', {
    message: '{_field_}の形式が有効ではありません。',
    validate(value) {
      const util = PhoneNumberUtil.getInstance()
      try {
        const phoneNumber = util.parseAndKeepRawInput(value, 'JP')
        return util.isValidNumber(phoneNumber)
      } catch (err) {
        return false
      }
    }
  })

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      form: {
        providerId: "",
        uid: "",
        email: "",
        full_name: "",
        address:"",
        phone:"",
        name: "",
      },
    }
  },
  computed: {
    users() {
      return store.state.result.users;
    },
  },
  created: function () {
    
    let that = this;
    let auth = store.state.auth;
    console.log(auth);
    that.form.email = auth.email;
    that.form.full_name = auth.username;
    that.form.address = auth.address;
    that.form.phone = auth.phone;
    that.form.name = auth.email;

  },
  mounted() { 
  },
  methods: {
    async submit() {

      const isValid = await this.$refs.observer.validate();
      console.log('q', isValid)
      if (!isValid) {
        // ABORT!!
        return;
      }
      store.commit('SET_ISLOADING', true) 
      const user = await firebase.auth().currentUser;

      let that = this;
      const save = await store.dispatch('updateUser',{
        params: that.form,
        callback: function(res){
          // console.log('ユーザー更新に成功しました!!',res)
          user.updateProfile({
            displayName: that.form.full_name,
          }).then(function() {
            setTimeout(function(){
              store.dispatch('getUsers',
                function(e){
                  // console.log('ユーザー再取得OK');
                  store.commit('SET_AUTH', user);
                  that.$message({
                    type: 'success',
                    message: '会員情報を更新しました。',
                  });
                  that.$router.replace('/')
                  store.commit('SET_ISLOADING', false)
              });
           },1000);
          }).catch(function(error) {
            // An error happened.
            console.log('error.')
          });
          return res;
        }
      });

      // const f = await firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password).then(
      //   (user) => {
          
      //     let currentUser = firebase.auth().currentUser;
      //     console.log('OK', currentUser);
      //     currentUser.updateProfile({
      //           displayName: that.form.username,
      //     }).then(function() {
           
      //     }).catch(function(error) {
      //       // An error happened.
      //     });
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
