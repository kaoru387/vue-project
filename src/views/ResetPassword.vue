<template>
  <div>
    <div id="firebaseui-auth-container"></div>
    <v-card 
      max-width="360px"
      :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
      :style="{'margin':'0 auto'}"
      >
      <div class="text-center pt-5 pb-0 text-primary">
        <h4>パスワード変更</h4>
      </div>
      <v-card-text class="pt-3">
        <el-alert
          :closable="false"
          type="warning"
          class="text-left ml-1 mr-2"
          description="新しいパスワードを入力して更新してください。">
        </el-alert>
        <validation-observer ref="observer" v-slot="ObserverProps" tag="form" @submit.prevent="submit()">
          <div class="form-row">
            <div class="col-12 p-2 pb-3">
              <div class="filed">
                <validation-provider name="新しいパスワード" rules="required|min:6" v-slot="prop">
                  <v-text-field
                    label="新しいパスワード"
                    name="新しいパスワード"
                    type="password"
                    v-model="form.password"
                    :error-messages="prop.errors[0]"
                  ></v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="block">
                <el-button class="m-0" type="primary" :style="{'width': '100%'}" @click="submit">
                  更新
                </el-button>
                <el-button type="secondary" class="m-0 mt-5 mb-3" :style="{'width': '100%'}" @click="cancel">キャンセル</el-button>
              </div>
            </div>
          </div>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import firebase from "../Firebase";
import firebaseapp from "@firebase/app";
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      form: {
        password: ""
      },
    }
  },
  computed: {
    
  },
  created: function () {
    
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
      const actionCode = store.state.info.actionCode;
      const accountEmail = store.state.info.accountEmail;

      // Save the new password.
      firebase.auth().confirmPasswordReset(actionCode, that.form.password).then(function(resp) {
        // Password reset has been confirmed and new password updated.
        // if the page belongs to the same domain as the app:
        firebase.auth().signInWithEmailAndPassword(accountEmail, that.form.password);
          that.$message({
            type: 'success',
            message: 'パスワード更新に成功しました。',
          });
        }).catch(function(error) {
          console.log(error)
          that.$message({
            type: 'error',
            message: 'パスワード更新に失敗しました。',
          });
          // window.location.href = "https://www.fandangos-okinawa.com/reservation/"
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
        });

      setTimeout(function(){
        store.commit('SET_BACK_URI', '');
        window.location.href = "https://www.fandangos-okinawa.com/reservation/"
        store.commit('SET_ISLOADING', false) 
      },2000);

    },
    cancel: function () {
      // this.$router.replace('/')
      store.commit('SET_BACK_URI', '');
      window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    },
  }
}
</script>
