<template>
  <div id="calendar">
    <!-- <h1 class="mt-2 mb-2">{{ msg }}</h1> -->
    <!-- <button @click="toggleWeekends">toggle weekends</button> -->
    <FullCalendar
      ref="fullCalendar"
      :style="{'min-height':height-180+'px','height':height+'px'}"
      defaultView="dayGridMonth"
      :options="calendarOptions">
       <!-- <template #eventContent="arg">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>
              <p v-if="!arg.event.extendedProps.isGoogle" class="circle-icon" :style="{'background':arg.event.extendedProps.iconColor}"></p>
              <b :style="{'color':arg.event.extendedProps.fontColor}">{{ arg.timeText }}</b>
              <i class="cal-title p-0 m-0" :style="{'color':arg.event.extendedProps.fontColor}">{{ arg.event.title }}</i>
            </v-list-item-title>
            <v-list-item-subtitle>
              <p v-if="!arg.event.extendedProps.isGoogle" class="sample" :style="{'color':arg.event.extendedProps.fontColor}">{{ arg.event.extendedProps.studioName }}</p>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template> -->
    </FullCalendar>
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
// import { formatDate } from '@fullcalendar/vue'
import store from '../store/app';

// import { mdiCircle } from '@mdi/js'
import { BPopover } from 'bootstrap-vue'

export default {
  components: {
    FullCalendar,
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
      width: window.innerWidth,
      height: window.innerHeight,
      calendarOptions: {
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left:   'title',
          // center: 'myCustomButton',
          right:  'myCustomButton dayGridMonth prev,next',
          // left: 'prev,next today',
          // center: 'title',
          // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable:true,
        // initialEvents: this.events,
        events: this.events,
        dateClick: this.handleDateClick,
        locale:ja,
        // editable: true,
        // eventClick: this.changeEvent,
        // eventChange: this.changeEvent,
        weekends: true,
        eventDidMount: this.eventDidMount,
        customButtons: {
          myCustomButton: {
            text: '今日',
            click: this.todayEvent
          }
        },
        viewDidMount: this.viewDidMount
      },
      elDay: '',
      elToday: '',
    }
  },
  computed: {
    selectDate() {
      return store.state.selectDate;
    },
  },
  created: function () {
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
      
      if(arg.dateStr<this.$moment().format('YYYY-MM-DD')) {
        // alert('選択できません。');
        return;
      }

      var cells = document.getElementsByTagName("td");
      for (var i = 0; i < cells.length; i++) {
        if(cells[i].getAttribute('data-date')==this.$moment().format('YYYY-MM-DD')){
          cells[i].classList.remove('fc-day-today');
        }
      }


      // 選択日付の背景色を変更する ====
      if(this.elDay.style!==undefined) this.elDay.style.backgroundColor = 'white';
      this.elDay = arg.dayEl;
      // arg.dayEl.style.backgroundColor = 'rgba(255,0,0,0.15)';
      arg.dayEl.style.backgroundColor = 'rgba(255, 220, 40, 0.15)';
      // ==================

      store.commit('SET_SELECT_DATE', arg.dateStr);
      
      // 週表示
      // this.$refs.fullCalendar.getApi().gotoDate(arg.dateStr)
      // this.$refs.fullCalendar.getApi().changeView('timeGridDay');
    },
    changeEvent: function(eventInfo) {
      event = eventInfo.event.toJSON()
      if(event.extendedProps.isGoogle) {
        alert('管理者のスケジュールです。')
        return
      }
      if(event.extendedProps.description!=='一般') {
        alert('会員専用ページにてご確認ください。')
        return
      }
      this.$emit('eventChange',event)
    },
    eventDidMount: function(info) {
      // console.log(info.event)
      var tooltip = new BPopover({
        propsData: {
          html: true,
          container: 'body',
          title: info.timeText+' '+info.event.title,
          // content: info.event.extendedProps.studioName+' '+ '\n' +info.event.extendedProps.description,
          content: info.event.extendedProps.description,
          placement: 'auto',
          boundary: 'scrollParent',
          // boundary: 'viewport',
          boundaryPadding: 5,
          delay: 500,
          offset: 0,
          triggers: 'hover',
          target: info.el,
        }
      }).$mount()

      // if (info.event.extendedProps.status === 'done') {
      //   console.log('done')
      // }
    },
    viewDidMount: function(e){
      
      // 今日の日付の背景色をリセット
      let that = this
      var cells = document.getElementsByTagName("td");
      for (var i = 0; i < cells.length; i++) {
        if(cells[i].getAttribute('data-date')==this.$moment().format('YYYY-MM-DD')){
          // cells[i].classList.remove('fc-day-today');
          that.elToday=cells[i];
        }
        // 過去の日付は選択できないため背景色を変更
        if(cells[i].getAttribute('data-date')<this.$moment().format('YYYY-MM-DD')){
          cells[i].style.backgroundColor = 'rgba(128,128,128,0.08)';
        }
      }

    },
    todayEvent: function(){
      // 今日にリセット
      this.elDay.style.backgroundColor = 'white';
      this.elToday.classList.add('fc-day-today');
      store.commit('SET_SELECT_DATE', this.$moment().format('YYYY-MM-DD'));
    },
  }
};
</script>