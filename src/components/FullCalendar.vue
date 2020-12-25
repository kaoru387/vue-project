<template>
  <div id="calendar">
    <!-- <h1 class="mt-2 mb-2">{{ msg }}</h1> -->
    <!-- <button @click="toggleWeekends">toggle weekends</button> -->
    <FullCalendar
      ref="fullCalendar"
      :style="{'min-height':'600px','height':height}"
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
import { formatDate } from '@fullcalendar/vue'
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
      // mdiIcon: mdiCircle,
      calendarOptions: {
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left:   'title',
          center: 'myCustomButton',
          right:  'today prev,next'
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
            text: '予約',
            click: this.reservationEvent
          }
        },
      },
      selectDate: '',
    }
  },
  computed: {
    // events() {
    //   return store.state.result.events;
    // },
  },
  created: function () {
    this.selectDates=this.$moment().format('YYYY-MM-DD');
    this.handleClickSignIn();
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
    async handleClickSignIn() {
      try {
        
        let that = this
        let checkGauthLoad = setInterval(function () {
          // console.log('home',store.state.result.events)
          // that.isInit = that.$gAuth.isInit;
          // that.isSignIn = that.$gAuth.isAuthorized;
          // if (that.isInit) clearInterval(checkGauthLoad);
          let CALENDAR_ID = 'onkltar6879bqv4616fa28i048@group.calendar.google.com'
          that.$gapi.getGapiClient().then((gapi) => {
              gapi.client.request({
              'path': 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(CALENDAR_ID) + '/events?singleEvents=true'
              }).then(function(response) {
                // console.log(response.result)
                // store.state.result.events =  response.result.items;
                _.forEach(response.result.items, function(v, key) {
                  // console.log(v, key)
                  store.state.result.events.push({
                    id: v.id,
                    title: v.summary,
                    start: v.start.dateTime,
                    end: v.end.dateTime,
                    // rendering: 'background',
                  // color: '#D6E7E0',
                  display: true,
                  backgroundColor: '#AD1457',
                  borderColor: '#AD1457',
                  studioName: 'コザスタジオ',
                  description: '',
                  fontColor: 'white',
                  isGoogle: true,
                  })  
                })
                clearInterval(checkGauthLoad);
              });
            store.commit('SET_ISLOADING', false);
          })


        }, 1000);

      } catch (error) {
        //on fail do something
        console.error(error);
        return null;
      }
    },
    handleDateClick(arg) {  // 日付選択
      // alert('date click! ' + arg.dateStr)
      this.selectDates = arg.dateStr;
      // console.log(arg)
      // this.$refs.fullCalendar.getApi().gotoDate(arg.dateStr)
      // this.$refs.fullCalendar.getApi().changeView('timeGridDay');
      // this.$emit('dayEvent',arg)
    },
    reservationEvent() {
      this.$emit('reservationEvent',this.selectDates)
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
          content: info.event.extendedProps.studioName+' '+ '\n' +info.event.extendedProps.description,
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
    },
  }
};
</script>