<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn icon color="primary" dark elevation="0" v-on="on">
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
    </template>
    <v-date-picker v-model="picker"
      locale="ja-jp"
      :day-format="date => new Date(date).getDate()"
      :month-format="date => (new Date(date).getMonth() + 1) + ' /'"
       @click="menu = false"/>
  </v-menu>
</template>
<script>
  import { mdiCalendar } from '@mdi/js'
export default {
  props: {
    value: {
      type: String,
      default: new Date().toISOString().substr(0, 10)
    }
  },
  data() {
    return {
      menu: false,
      // mdiCalendar
    };
  },
  computed: {
    picker: {
      get() {
        return this.value;
      },
      set(val) {
        this.menu = false;
        this.$emit("input", val);
      }
    }
  }
};
</script>