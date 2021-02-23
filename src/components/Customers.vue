<template>
  <v-card>
    <v-card-title>
      予約状況
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="ユーザ検索"
        single-line
        hide-details
        >
      </v-text-field>
    </v-card-title>
    <v-data-table
      dense
      :headers="dessertHeaders"
      :items="desserts"
      :search="search"
      :expanded.sync="expanded"
      show-expand
      class="elevation-1"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pt-3">
          <customer :item="item" />
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import store from '../store/app';
import moment from "moment"
import _ from 'lodash';
import Customer from "./Customer";

export default {
  components: {
    Customer
  },
  props: {
    // item: { 
    //   type: Object, 
    //   default: () => {} 
    // },
  },
  data() {
    return {
      search: '',
      expanded: [],
      singleExpand: false,
      dessertHeaders: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'ユーザ名', align: 'start', value: 'full_name' },
        { text: '', value: 'data-table-expand' },
      ],
    }
  },
  watch: {
  },
  mounted: function () {
    
  },
  computed: {
    auth() {
      return store.state.auth;
    },
    desserts() {
      return store.state.result.users;
    }
  },
  created: function () {
    console.log('charges')
    store.dispatch('getCharges',{
      limit: 20
    });
    // console.log(this.item.title)
    // let today = this.$moment().format('YYYY-MM-DD');
    // let target_date = moment(this.item.start).utc().format("YYYY-MM-DD");
    // if(today<=target_date){
    //   if(this.item.extendedProps.user_id==this.auth.user_id) this.isTarget=true;
    // }
  },
  methods: {
    onClose() {
      this.popoverShow = false
    },
    onOk() {
      let that = this;
      this.$confirm('<strong class="text-left">本当に取消してもよろしいですか？</strong>', '予約取消', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'OK',
        type: 'warning',
        center: true,
      }).then(() => {
        // store.commit('SET_ISLOADING', true)
        store.dispatch('deleteAppointment',{
          params: {
            id: that.item.id,
            created: moment(that.item.created).format("YYYY-MM-DD"),
            start: that.item.start,
            user_id: that.item.user_id,
            // resource_id: that.item.resource_id,
          },
          callback: function(res){

            // 完了メッセージ
            that.$message({
              type: 'success',
              message: '予約を取消しました。',
            });

            store.commit('SET_ISLOADING', true)
            const processA = async function() {
              await store.commit('SET_EVENTS', []);
              // 予約取得
              await store.dispatch('getBookings',{
                callback: function(res){
                  console.log(res)
                  store.commit('SET_ISLOADING', false)
                }
              });
              // クラス取得
              await store.dispatch('getClass',{})
            }
            const processAll = async function() {
              await processA()

            }
            processAll()

          }
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '予約取消キャンセルしました。'
        });          
      });
    },
    onShow() {
      // This is called just before the popover is shown
      // Reset our popover form variables
      this.input1 = ''
      this.input2 = ''
      this.input1state = null
      this.input2state = null
      this.input1Return = ''
      this.input2Return = ''
    },
    onShown() {
      // Called just after the popover has been shown
      // Transfer focus to the first input
      // this.focusRef(this.$refs.input1)
    },
    onHidden() {
      // Called just after the popover has finished hiding
      // Bring focus back to the button
      // this.focusRef(this.$refs.button)
    },
    focusRef(ref) {
      // console.log(ref)
      // Some references may be a component, functional component, or plain element
      // This handles that check before focusing, assuming a `focus()` method exists
      // We do this in a double `$nextTick()` to ensure components have
      // updated & popover positioned first
      
      // this.$nextTick(() => {
      //   this.$nextTick(() => {
      //     ;(ref.$el || ref).focus()
      //   })
      // })
    }
  }
}
</script>
