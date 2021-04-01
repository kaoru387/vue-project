<template>
  <el-dialog
    title="会員情報"
    custom-class="dialog_edit_account"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="95%"
    append-to-body
    @close="closeModal"
    :style = "{'max-width':'375px','margin': '20px auto'}"
    center
  >
    <v-card-text class="pt-0">
      <validation-observer ref="observer" v-slot="ObserverProps" tag="form" @submit.prevent="submit()">
        <div class="form-row">
          <div class="col-12 p-2 pt-3 text-left">
            ID: <h4>{{ form.email }}</h4>
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
              <el-button class="m-0" type="success" :style="{'width': '100%'}" @click="submit" :loading="loading" :disabled="form.full_name==''">
                更新
              </el-button>
              <el-button type="secondary" class="m-0 mt-3 mb-3" :style="{'width': '100%'}" @click="closeModal">キャンセル</el-button>
            </div>
          </div>
        </div>
      </validation-observer>
    </v-card-text> 
  </el-dialog>
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
  data() {
    return {
      // loading: true,
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
    // users() {
    //   return store.state.result.users;
    // },
    loading() {
      return store.state.isLoading;
    },
  },
  created: function () {
    
    let that = this;
    let auth = store.state.auth;
    that.form.email = auth.email;
    if(!auth.isNeedName){
      that.form.full_name = auth.username;  
    }
    that.form.address = auth.address;
    that.form.phone = auth.phone;
    that.form.name = auth.email;

  },
  mounted() { 
  },
  methods: {
    submit() {
      store.commit('SET_ISLOADING', true);
      const isValid = this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
        store.commit('SET_ISLOADING', false);
        return;
      }
      const user = firebase.auth().currentUser;

      let that = this;
      const save = store.dispatch('updateUser',{
        params: that.form,
        callback: function(res){
          // console.log('ユーザー更新に成功しました!!',res)
          user.updateProfile({
            displayName: that.form.full_name,
          }).then(function() {
            setTimeout(function(){
              store.dispatch('getUsers',
                function(e){
                  that.$message({
                    type: 'success',
                    message: '会員情報を更新しました。',
                  });
                  that.closeModal();
              });
           },500);
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
    // cancel() {
    //   this.$router.push({path: '/'});
    // }
  }
}
</script>
