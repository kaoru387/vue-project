<template>
  <div :id='"my-container"+item.id' :style="{'border-color':'black !important'}" @click="confirm(item.extendedProps)">
      <v-list-item three-line>
        <v-list-item-content :id='"popover-reactive-"+item.id' :ref='"item"+item.id'>
          <v-list-item-subtitle class="d-flex justify-content-start">
            <v-icon 
              class="pt-1"
              color="#03BFA5"
              :style="{'font-size':'10px !important'}"
            >{{ mdiRecordCircleOutline }}</v-icon>
            <p class="sample">{{ item.extendedProps.datetime+' '+item.title }}</p>
            <!--<p v-if="item._context.viewApi.type!='dayGridMonth'">
              {{ item.extendedProps.datetime }}<span class="pl-2">{{ item.extendedProps.studioName }}</span>
            </p> -->
            <!-- <i v-if="item._context.viewApi.type=='timeGridDay'" class="el-icon-circle-plus-outline ml-2" :style="{'color':'#F56C6C','font-weight': 800}" @click="payment(item.extendedProps)"></i> -->
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
  </div>
</template>

<script>
import store from '../store/app';
import moment from "moment"
import _ from 'lodash';
import { mdiRecordCircleOutline } from '@mdi/js'

export default {
  props: {
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      mdiRecordCircleOutline
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
    search() {
      return store.state.search;
    }
  },
  created: function () {
    // console.log(this.item)
    // let today = this.$moment().format('YYYY-MM-DD');
    // let target_date = moment(this.item.start).utc().format("YYYY-MM-DD");
    // if(today<=target_date){
    //   if(this.item.extendedProps.user_id==this.auth.user_id) this.isTarget=true;
    // }
  },
  methods: {
    confirm(item){
      this.$emit('confirm', item)
    }
  }
}
</script>
