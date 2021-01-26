<template>
  <div id="calendar">
    <!-- <h1 class="mt-2 mb-2">{{ msg }}</h1> -->
    <!-- <button @click="toggleWeekends">toggle weekends</button> -->
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer></v-spacer>
            <v-btn
              icon
              class="ma-2"
              @click="$refs.calendar.next()"
            >
              <!-- <v-icon>mdi-chevron-right</v-icon> -->
              <v-icon>{{ mdiChevronRight }}</v-icon>
            </v-btn>

          </v-toolbar>
        </v-sheet>
        <v-sheet :height="height">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title class="float-left" v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  
  </div>
</template>

<script>
import store from '../store/app';
import { mdiChevronRight } from '@mdi/js';
import { mdiChevronLeft } from '@mdi/js';

export default {
  components: {
    // FullCalendar,
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
      // events: [],
      mdiChevronRight: mdiChevronRight,
      mdiChevronLeft: mdiChevronLeft,
      // height: window.innerHeight-300,
      // width: window.innerWidth,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      // events: [],
      // colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      // calendarOptions: {
      //   plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
      //   initialView: 'dayGridMonth',
      //   headerToolbar: {
      //     left: 'prev,next today',
      //     center: 'title',
      //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
      //   },
      //   // initialEvents: this.events,
      //   events: this.events,
      //   dateClick: this.handleDateClick,
      //   locale:ja,
      //   // editable: true,
      //   eventClick: this.changeEvent,
      //   // eventChange: this.changeEvent,
      //   weekends: true,
      // },
    }
  },
  computed: {
    height() {
      return window.screen.height;
    }
    // events() {
    //   return store.state.result.events;
    // },
  },
  // created: function () {
  //   console.log('c',store.state.result.events)
  // },
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
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        const events = []
        // const min = new Date(`${start.date}T00:00:00`)
        // const max = new Date(`${end.date}T23:59:59`)
        // const days = (max.getTime() - min.getTime()) / 86400000
        // const eventCount = this.rnd(days, days + 20)

        // for (let i = 0; i < eventCount; i++) {
        //   const allDay = this.rnd(0, 3) === 0
        //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        //   const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        //   const second = new Date(first.getTime() + secondTimestamp)

        //   events.push({
        //     name: this.names[this.rnd(0, this.names.length - 1)],
        //     start: first,
        //     end: second,
        //     color: this.colors[this.rnd(0, this.colors.length - 1)],
        //     timed: !allDay,
        //   })
        // }
        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    handleDateClick(selectInfo) {
      console.log('modal?')
      // let title = prompt('Please enter a new title for your event')
      // let calendarApi = selectInfo.view.calendar

      // calendarApi.unselect() // clear date selection

      // if (title) {
      //   calendarApi.addEvent({
      //     id: '',
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay
      //   })
      // }
      // selectInfo.dayEl.style.backgroundColor = 'red';
      console.log(selectInfo)
    },
    // handleEventClick(clickInfo) {
    //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //     clickInfo.event.remove()
    //   }
    // },
    // handleEvents(events) {
    //   console.log('event!!')
    //   // this.currentEvents = events
    // },
    // addEvent: function() {
    //   this.events.push({
    //     id: String(this.events.length + 1),
    //     ...this.eventForm
    //   })
    // },
    // removeEvent: function(eventInfo) {
    //   this.events = this.events.filter(event => {
    //     return event.id != eventInfo.event.id
    //   })
    // },
    changeEvent: function(item, jsEvent, view) {
      // event = eventInfo.event.toJSON()
      this.modal_koza_visible = true;
      console.log('event',item)
    },
    // toggleWeekends: function() {
    //   this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
    // },
    // AddNewEvents: function(newEvents, oldEvents) {
    //   const oldEventIds =  oldEvents.map(oldEvent => { return oldEvent.id})
    //   newEvents.forEach((newEvent) => {
    //     if(!oldEventIds.includes(newEvent.id)) this.calendarApi.addEvent(newEvent)
    //   })
    // },
    // handleEventClick: function(eventInfo) {
    //   this.$emit("eventClick", eventInfo)
    // },
    // handleEventChange: function(eventInfo) {
    //   this.$emit("eventChange", eventInfo)
    // },
  }
};
</script>