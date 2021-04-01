<template>
  <div>
    <FullCalendar
      :style="{'min-height':height-adjust+'px'}"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :options="calendarOptions">
      <template #eventContent="arg">
        <my-interactive-content 
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

import { mdiRecordCircleOutline } from '@mdi/js'

import MyInteractiveContent from './MyInteractiveContent'
// import ModalReservationStudio from './ModalReservationStudio'


import store from '../store/app';
import moment from "moment"
import { BPopover } from 'bootstrap-vue'

export default {
  components: {
    FullCalendar,
    MyInteractiveContent,
    // ModalReservationStudio,
    BPopover
  },
  props: {
    msg: String,
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
        initialView: 'timeGridWeek',
        // initialDate: this.iniDate,
        headerToolbar: {
          left:   'title',
          // center: 'myCustomButton',
          right:  'today dayGridMonth,timeGridWeek,timeGridDay prev,next',
          // left: 'prev,next today',
          // center: 'title',
          // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable:true,
        // initialEvents: this.iniEvents,
        events: this.events,
        dateClick: this.handleDateClick,
        locale:ja,
        // editable: true,
        eventClick: this.changeEvent,
        weekends: true,
        eventDidMount: this.eventDidMount,
        // customButtons: {
        //   myCustomButton: {
        //     text: '今日',
        //     click: this.todayEvent
        //   }
        // },
        viewDidMount: this.viewDidMount
      },
      elDay: '',
      elToday: '',
      // iniEvents: {
      //   id: 6,
      //   title: '追加の予定',
      //   start: "2021-02-14T15:15:00",
      //   end: "2021-02-14T17:00:00"
      // },
    }
  },
  computed: {
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
    auth() {
      return store.state.auth;
    },
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
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

      // console.log(arg)

      // if(arg.view.type!=='dayGridMonth'){
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

      // 選択日付更新
      store.commit('SET_SELECT_DATE', arg.dateStr);
      
      // 表示切り替え
      this.$refs.fullCalendar.getApi().gotoDate(arg.dateStr)
      // this.$refs.fullCalendar.getApi().changeView('timeGridWeek');
      this.$refs.fullCalendar.getApi().changeView('timeGridDay');
      // this.viewName = 'timeGridDay';
      
      // // 詳細表示
      // this.$emit('date-selected',arg.dateStr);
    },
    changeEvent: function(eventInfo) {
      // this.item = event;
      this.content_visible = true

      // // this.$emit('eventChange',event)
      // // 選択日付更新
      // let date = moment(event.start).utc().format('YYYY-MM-DD')

      // var result = event.start.indexOf('Z');
      // if(result==-1) date = moment(event.start).format('YYYY-MM-DD')  
      // store.commit('SET_SELECT_DATE', date);

      // // 表示切り替え
      // this.$refs.fullCalendar.getApi().gotoDate(date)
      // this.$refs.fullCalendar.getApi().changeView('timeGridDay');


      // // 背景色
      // var cells = document.getElementsByTagName("td");
      // for (var i = 0; i < cells.length; i++) {
      //   cells[i].classList.remove('fc-day-today');
      //   if(cells[i].getAttribute('data-date')==date){
      //     cells[i].classList.add('fc-day-today');
      //   }
      // }
    },
    eventDidMount: function(info) { // 詳細表示
      // console.log(info.event.extendedProps)
      if(info.event.extendedProps.studioName=='dummy') return;

      let title = '一般利用';
      if(info.event.title!=='*') title = info.event.title;
      // if(info.event.extendedProps.title=="*") title = '一般利用';
      var tooltip = new BPopover({
        propsData: {
          // placement: 'bottom',
          html: true,
          container: 'body',
          template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
          target: info.el,
          // title: info.timeText+' '+info.event.title,
          title: info.timeText,
          // content: info.event.title+' '+info.event.extendedProps.description,
          content: title,
          boundary: 'viewport',
          triggers: "hover focus",
          placement: "bottomright",
          // boundaryPadding: 5,
          // delay: 500,
          // offset: 0,
          // triggers: 'hover',
        }
      }).$mount()
    },
    viewDidMount: function(e){
      // console.log('vi',e.view.type)
      // let that = this
      // // 今日の日付の背景色をリセット
      // let today = this.$moment().utc().format('YYYY-MM-DD');
      // var cells = document.getElementsByTagName("td");
      // for (var i = 0; i < cells.length; i++) {
      //   // if(today<=cells[i].getAttribute('data-date')){
      //   //   // cells[i].classList.remove('fc-day-today');
      //   //   // that.elToday=cells[i];
      //   //   cells[i].style.backgroundColor = 'rgba(255,153,106,0.08)';
      //   // }
      //   // 過去の日付は選択できないため背景色を変更
      //   if(cells[i].getAttribute('data-date')<today){
      //     cells[i].style.backgroundColor = 'rgba(128,128,128,0.08)';
      //   }
      // }
    },
    todayEvent: function(){
      // 今日にリセット
      this.elDay.style.backgroundColor = 'white';
      this.elToday.classList.add('fc-day-today');
      store.commit('SET_SELECT_DATE', this.$moment().utc().format('YYYY-MM-DD'));
    },
    closeContent: function(){
      // console.log('close')
      this.search_visible=false;
    },
    confirm(item) {
      this.$emit('confirm', item);
    }
  }
};
</script>