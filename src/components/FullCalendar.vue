<template>
  <div id="calendar">
    <div class="d-flex bd-highlight mt-2 mb-2">
      <div class="p-0 flex-fill flex-shrink-1 bd-highlight text-right">
        <span class="p-0 bd-highlight">
          <span class="badge" :style="{'background-color': supersass.nagoColor, 'color':'white'}">ナゴスタジオ</span>
        </span>
        <span class="p-0 bd-highlight">
          <span class="badge" :style="{'background-color': supersass.kozaColor, 'color':'white'}">コザスタジオ</span>
        </span>
      </div>
    </div>
    <FullCalendar
      :style="{'min-height':height-adjust+'px'}"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :options="calendarOptions">
      <!-- <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template> -->
       <!-- <template #eventContent="arg">
        <interactive-content ref="interactiveContent" :item=arg.event  :dialog-form-visible="content_visible" :close-content="closeContent" :style="{'x-index': 1060}" /> -->
        <!-- <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-subtitle>
              <p class="circle-icon" :style="{'background':arg.event.extendedProps.iconColor}"></p>
              <p class="sample" :style="{'color':arg.event.extendedProps.fontColor}">{{ arg.event.extendedProps.studioName }}</p>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->
      <!-- </template> -->
    </FullCalendar>
    <!-- <modal-reservation-studio ref="reservationStudio" 
      :dialog-form-visible="search_visible" 
      :close-modal="closeContent" /> -->
    <!-- <interactive-content ref="interactiveContent" 
      :dialog-form-visible="content_visible" 
      :close-content="closeContent" /> -->
    <!-- <FullCalendar :events="events" @eventClick="removeEvent" @eventChange="changeEvent">
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar> -->
    <!-- <input v-model="eventForm.title" type="text" />
    <input v-model="eventForm.start" type="date" />
    <Button @click="addEvent">イベントを追加</Button> -->
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


import store from '../store/app';
import moment from "moment"
import { BPopover } from 'bootstrap-vue'

export default {
  components: {
    FullCalendar,
    InteractiveContent,
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
        // eventDidMount: this.eventDidMount,
        // customButtons: {
        //   myCustomButton: {
        //     text: '今日',
        //     click: this.todayEvent
        //   }
        // },
        viewDidMount: this.viewDidMount,
        businessHours: {
          daysOfWeek: [ 0, 1, 2, 3, 4, 5, 6 ],
          startTime: '7:00',
          endTime: '24:00'
        },
        eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
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
    supersass() {
      return store.state.auth.supersass;
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
      // this.content_visible = true

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
      // if(info.event.extendedProps.studioName=='dummy') return;

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
    }
  }
};
</script>