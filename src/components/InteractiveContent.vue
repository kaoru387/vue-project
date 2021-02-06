<template>
  <div :id='"my-container"+item.id'>
    <!-- Our triggering (target) element -->
    <!-- <div class="my-3">
      <b-button id="popover-reactive-1" variant="primary" ref="button">
        Reactive Content Using Slots
      </b-button>
    </div> -->

    <v-list-item three-line>
      <v-list-item-content :id='"popover-reactive-"+item.id' :ref='"item"+item.id'>
        <v-list-item-subtitle>
          <p class="circle-icon" :style="{'background':item.extendedProps.iconColor}"></p>
          <p v-if="item._context.viewApi.type=='dayGridMonth'" class="sample">{{ item.extendedProps.datetime }}</p>

          <p v-if="item._context.viewApi.type!='dayGridMonth'">
            {{ item.extendedProps.datetime }}<span class="pl-2">{{ item.extendedProps.studioName }}</span>
          </p>
        </v-list-item-subtitle>
        <p v-if="item._context.viewApi.type=='timeGridDay'" class="pl-2">{{ item.extendedProps.description }}</p>
      </v-list-item-content>
    </v-list-item>

    <!-- Output from the popover interaction -->
    <!-- <b-card title="Returned values:" v-if="input1Return && input2Return">
      <p class="card-text" :style='{"max-width": "300px", "z-index": item.id}'>
        Name: <strong>{{ input1Return }}</strong><br>
        Color: <strong>{{ input2Return }}</strong>
      </p>
    </b-card> -->

    <!-- Our popover title and content render container -->
    <!-- We use placement 'auto' so popover fits in the best spot on viewport -->
    <!-- We specify the same container as the trigger button, so that popover is close to button -->
    <b-popover
      :target='"popover-reactive-"+item.id'
      triggers="click"
      :show.sync="popoverShow"
      placement="auto"
      :container='"my-container"+item.id'
      ref="popover"
      @show="onShow"
      @shown="onShown"
      @hidden="onHidden"
    >
      <template #title>
        <b-button @click="onClose" class="close" aria-label="Close">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-button>
        <div>
          <span>{{item.title}}</span><span v-if="item.extendedProps.user_id" class="ml-1">さん</span>
        </div>
      </template>

      <div>
        <!-- <b-form-group
          label="Name"
          label-for="popover-input-1"
          label-cols="3"
          :state="input1state"
          class="mb-1"
          description="Enter your name"
          invalid-feedback="This field is required"
        >
          <b-form-input
            ref="input1"
            id="popover-input-1"
            v-model="input1"
            :state="input1state"
            size="sm"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Color"
          label-for="popover-input-2"
          label-cols="3"
          :state="input2state"
          class="mb-1"
          description="Pick a color"
          invalid-feedback="This field is required"
        >
          <b-form-select
            id="popover-input-2"
            v-model="input2"
            :state="input2state"
            :options="options"
            size="sm"
          ></b-form-select>
        </b-form-group> -->

        <b-alert show class="small">
          <strong>{{item.extendedProps.datetime}}</strong><br>
          <span>{{item.extendedProps.studioName}}</span><br>
          <span>{{item.extendedProps.description}}</span>
          <!-- Name: <strong>{{ input1 }}</strong><br>
          Color: <strong>{{ input2 }}</strong> -->
        </b-alert>
        <div v-if="item.extendedProps.user_id" class="d-flex justify-content-end">
          <!-- <b-button @click="onClose" size="sm" variant="danger" class="mr-1">閉じる</b-button> -->
          <b-button :disabled="!isTarget" @click="onOk" size="sm" variant="warning">予約取消</b-button>
        </div>
      </div>
    </b-popover>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"

export default {
  props: {
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      isTarget: false,
      input1: '',
      input1state: null,
      input2: '',
      input2state: null,
      options: [{ text: '- Choose 1 -', value: '' }, 'Red', 'Green', 'Blue'],
      input1Return: '',
      input2Return: '',
      popoverShow: false
    }
  },
  watch: {
    input1(val) {
      if (val) {
        this.input1state = true
      }
    },
    input2(val) {
      if (val) {
        this.input2state = true
      }
    }
  },
  computed: {
    auth() {
      return store.state.auth;
    },
  },
  created: function () {
    // console.log(this.item.title)
    let today = this.$moment().format('YYYY-MM-DD');
    let target_date = moment(this.item.start).utc().format("YYYY-MM-DD");
    if(today<=target_date){
      if(this.item.extendedProps.user_id==this.auth.user_id) this.isTarget=true;
    }

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
              await store.dispatch('getBookings')
              // クラス取得
              await store.dispatch('getClass',{})
            }
            const processAll = async function() {
              await processA()
              store.commit('SET_ISLOADING', false)

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

      // if (!this.input1) {
      //   this.input1state = false
      // }
      // if (!this.input2) {
      //   this.input2state = false
      // }
      // if (this.input1 && this.input2) {
      //   this.onClose()
      //   // Return our popover form results
      //   this.input1Return = this.input1
      //   this.input2Return = this.input2
      // }
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
