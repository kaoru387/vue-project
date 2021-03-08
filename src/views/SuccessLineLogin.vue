<template>
  <div>
    <v-card 
      :loading="!loading"
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">LINEログイン成功</h4>
        </v-row>
      </v-card-title>
      <v-icon 
        class="mb-2"
        large
        color="#03BFA5"
        :style="{'font-size':'50px'}"
      >mdi-check-circle</v-icon>
      <div class="ml-2 mr-2 pb-5">
        <el-alert
          class="text-left"
          type="success"
          description="LINEログインに成功しました。OKボタンをクリックしてください。"
          show-icon>
        </el-alert>
      </div>
      <div class="p-2 pb-6">
        <v-btn
          block
          elevation="4"
          large
          color="cyan"
          @click="loginUser" 
        ><span :style="{'color':'white'}">OK</span></v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import moment from "moment"
// import firebase from "@firebase/app";
import Firebase from "Firebase";

export default {
  data() {
    return {
    }
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
    // lineLogin() {
    //   return store.state.lineLogin;
    // },
  },
  created: function () {
  },
  mounted() {
  },
  methods: {
    loginUser() {
      store.commit('SET_ISLOADING', true);
      let session_timestamp = moment().format("YYYYMMDDHH");
      console.log(session_timestamp);

      var that = this;
      var docRef = Firebase.db().collection("linelogin").doc(session_timestamp);
      const processA = async function() {
        const docs = await docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log("Document data success.");
            return doc.data();
          } else {
            console.log("No such document!");
            window.location.href = "https://www.fandangos-okinawa.com/reservation/";
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
        const code = await docs.code;
        const state = await docs.state;
        console.log('line mounted.', code, state);
        const url = "https://vue-authentification-b7a7a.firebaseapp.com/?mode=successLineLogin";
        store.dispatch('getLineUserInfo', {
          params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: url,
            client_id: '1655706276',
            client_secret: '7dfe0e67718d9989ba4024a9d1a15eea',
          },
          callback: function(res) {
            // ログイン
            
            // セッションデータ削除
            docRef.delete().then(function() {
              console.log("Document successfully deleted!");
              
              if(res.email==undefined){
                that.$message({
                  type: 'error',
                  message: 'LINEのメールアドレス取得に失敗しました！',
                });
              }else{
                // 一旦保持
                Firebase.db().collection("signIn").doc(session_timestamp)
                .set({
                  email: res.email,
                  name: res.name,
                });
              }
            }).catch(function(error) {
                console.error("Error removing document: ", error);
                that.$message({
                  type: 'error',
                  message: '原因不明エラーが発生しました。キャッシュ履歴を削除後、再度お試しください。',
                });
            });

            setTimeout(function(){
              window.location.href = "https://www.fandangos-okinawa.com/reservation/";
              store.commit('SET_ISLOADING', false);
            },1500);

          }
        });
      };
      const processAll = async function() {
        await processA();
      }
      processAll();
      // store.commit('SET_BACK_URI', '');
      // store.commit('SET_ISLOADING', false)
      // // this.$router.push({path: '/'});
      // window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    }
  }
}
</script>
