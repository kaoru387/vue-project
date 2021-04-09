<template>
  <div id="free-calendar">
    <div class="pl-3 pr-3 pt-0">
      <el-alert
        class="mb-10 text-left"
        type="success"
        :description="'予約時間を選択してください。'"
        show-icon>
      </el-alert>
    </div>
    <v-row justify="center" align-content="center">
      <h5>{{ initialDate }}</h5>
    </v-row>
    <FullCalendar
      :style="{'min-height':height-adjust+'px'}"
      ref="freeTimeFullCalendar"
      defaultView="dayGridMonth"
      :options="calendarOptions">
       <template #eventContent="arg">
        <interactive-content 
          ref="interactiveContent" 
          :item=arg.event 
          :close-content="closeContent"
          @confirm="confirm" />
      </template>
    </FullCalendar>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from "@fullcalendar/timegrid";
import ja from "@fullcalendar/core/locales/ja";

import InteractiveContent from './InteractiveContent'
// import ModalReservationStudio from './ModalReservationStudio'
import { mdiRecordCircleOutline } from '@mdi/js'


import store from '../store/app';
import moment from "moment"
import _ from 'lodash';
// import { BPopover } from 'bootstrap-vue'

export default {
  components: {
    FullCalendar,
    InteractiveContent,
    // ModalReservationStudio,
    // BPopover
  },
  props: {
    msg: String,
    initialDate: String,
    events: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      mdiRecordCircleOutline,
      search_visible: false,
      content_visible: false,
      item: {},
      calendarOptions: {
        timeZone: 'UTC',
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        initialView: 'timeGridDay',
        initialDate: this.initialDate,
        headerToolbar: {
          left:   '',
          right: '',
          center: '',
        },
        selectable:true,
        // initialEvents: this.events,
        events: this.events,
        dateClick: this.handleDateClick,
        locale:ja,
        // editable: true,
        // eventClick: this.changeEvent,
        weekends: true,
        eventDidMount: this.eventDidMount,
        // customButtons: {
        //   myCustomButton: {
        //     text: '戻る',
        //     click: this.closeContent
        //   }
        // },
        viewDidMount: this.viewDidMount
      },
      elDay: '',
      elToday: '',
      // initialDate: ''
      // viewName: 'timeGridWeek'
    }
  },
  computed: {
    search() {
      return store.state.search;
    },
    height() {
      return window.screen.height;
    },
    selectDate() {
      return store.state.selectDate;
    },
    adjust () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },
    items() {
      return store.state.result.resources;
    },
    datas() {
      return store.state.result.events;
    },
  },
  created: function () {
    // console.log(this.search.date)
    // this.initialDate='2021-02-23';
  },
  watch: {
    // events:  function(newEvents) {
    //   console.log(newEvents)
    // //   const oldEvents = this.calendarApi.getEvents()
    // //   // 新しいイベントをカレンダーに追加する
    // //   this.AddNewEvents(newEvents, oldEvents)
    // //   // 消えたイベントをカレンダーから除去する
    // //   this.removeEvents(newEvents, oldEvents)
    // }
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    handleDateClick(arg) {  // 日付選択

      // this.$refs.reservationStudio.conditions(date, start);
      // this.search_visible=true;

      // if(arg.view.type!=='dayGridMonth'){
      //   let date = this.$moment(arg.dateStr).utc().format('YYYY-MM-DD');
      //   let start = this.$moment(arg.dateStr).utc().format('HH:mm');
      //   let search = {
      //     date: date,
      //     start: start
      //   }
      //   store.commit('SET_SELECT_SEARCH', search)
      //   this.$router.replace('/schedule')
      //   return;
      // }
      
      // // 当日の背景色クリア
      // var cells = document.getElementsByTagName("td");
      // for (var i = 0; i < cells.length; i++) {
      //   if(cells[i].getAttribute('data-date')==this.$moment().utc().format('YYYY-MM-DD')){
      //     cells[i].classList.remove('fc-day-today');
      //   }
      // }

      // // 選択日付の背景色を変更する ====
      // if(this.elDay.style!==undefined) this.elDay.style.backgroundColor = 'white';
      // this.elDay = arg.dayEl;
      // // arg.dayEl.style.backgroundColor = 'rgba(255,0,0,0.15)';
      // arg.dayEl.style.backgroundColor = 'rgba(255, 220, 40, 0.15)';
      // // ==========================

      // // 選択日付更新
      // store.commit('SET_SELECT_DATE', arg.dateStr);
      
      // 表示切り替え
      this.$refs.fullCalendar.getApi().gotoDate(arg.dateStr)
      // this.$refs.fullCalendar.getApi().changeView('timeGridWeek');
      this.$refs.fullCalendar.getApi().changeView('timeGridDay');
      // this.viewName = 'timeGridDay';
      
      // // 詳細表示
      // this.$emit('date-selected',arg.dateStr);
    },
    // changeEvent: function(eventInfo) {
    //   console.log('change event')
    //   //イベント選択
    //   let event = eventInfo.event.toJSON();
    //   // 選択日付更新
    //   let date = moment(event.start).utc().format('YYYY-MM-DD')
    //   let start = moment(event.start).format('HH:mm');
    //   let search = {
    //     date: date,
    //     start: start
    //   }
    //   store.commit('SET_SELECT_SEARCH', search);
      
    //   // //イベント選択
    //   // let event = eventInfo.event.toJSON()
    //   // this.item = event;
    //   // this.content_visible = true

    //   // // this.$emit('eventChange',event)
    //   // // 選択日付更新
    //   // let date = moment(event.start).utc().format('YYYY-MM-DD')

    //   // var result = event.start.indexOf('Z');
    //   // if(result==-1) date = moment(event.start).format('YYYY-MM-DD')  
    //   // store.commit('SET_SELECT_DATE', date);

    //   // // 表示切り替え
    //   // this.$refs.fullCalendar.getApi().gotoDate(date)
    //   // this.$refs.fullCalendar.getApi().changeView('timeGridDay');

    //   // // 背景色
    //   // var cells = document.getElementsByTagName("td");
    //   // for (var i = 0; i < cells.length; i++) {
    //   //   cells[i].classList.remove('fc-day-today');
    //   //   if(cells[i].getAttribute('data-date')==date){
    //   //     cells[i].classList.add('fc-day-today');
    //   //   }
    //   // }
    // },
    eventDidMount: function(info) { // 詳細表示
      // console.log('mount',info)
    //   // if(!info.event.allDay) return;
      // console.log(info.event.extendedProps);
      
    //   let title = '一般利用';
    //   if(info.event.title!=='*') title = info.event.title;
    //   // if(info.event.extendedProps.title=="*") title = '一般利用';
    //   var tooltip = new BPopover({
    //     propsData: {
    //       // placement: 'bottom',
    //       html: true,
    //       container: 'body',
    //       template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
    //       target: info.el,
    //       // title: info.timeText+' '+info.event.title,
    //       title: info.timeText+' '+info.event.extendedProps.studioName,
    //       // content: info.event.title+' '+info.event.extendedProps.description,
    //       content: title,
    //       boundary: 'viewport',
    //       triggers: "hover focus",
    //       placement: "bottomright",
    //       // boundaryPadding: 5,
    //       // delay: 500,
    //       // offset: 0,
    //       // triggers: 'hover',
    //     }
    //   }).$mount()
    },
    viewDidMount: function(e){
      // console.log('vi',e.view.type)
      let that = this
      // 週から月への場合再読み込み
      // if(e.view.type == "dayGridMonth") {
      //   if(that.viewName == 'timeGridDay'){
      //     store.commit('SET_ISLOADING', true)
      //     that.$emit('reLoad');
      //     return;
      //   }
      // }

      // // 今日の日付の背景色をリセット
      // var cells = document.getElementsByTagName("td");
      // for (var i = 0; i < cells.length; i++) {
      //   cells[i].style.backgroundColor = 'rgba(128,128,128,0.08)';
      //   // if(cells[i].getAttribute('data-date')==this.$moment().utc().format('YYYY-MM-DD')){
      //   //   // cells[i].classList.remove('fc-day-today');
      //   //   that.elToday=cells[i];
      //   // }
      //   // // 過去の日付は選択できないため背景色を変更
      //   // if(cells[i].getAttribute('data-date')<this.$moment().utc().format('YYYY-MM-DD')){
      //   //   cells[i].style.backgroundColor = 'rgba(128,128,128,0.08)';
      //   // }
      // }
    },
    todayEvent: function(){
      // 今日にリセット
      this.elDay.style.backgroundColor = 'white';
      this.elToday.classList.add('fc-day-today');
      store.commit('SET_SELECT_DATE', this.$moment().utc().format('YYYY-MM-DD'));
    },
    closeContent: function(){
      this.$emit('cancel');
    },
    confirm(item) {
      this.$emit('confirm', item);
    }
  }
};
</script>