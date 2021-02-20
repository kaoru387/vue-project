<template>
  <v-menu ref="menu" v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn icon color="primary" dark elevation="0" v-on="on">
        <v-icon>mdi-calendar-clock</v-icon>
      </v-btn>
    </template>
    <v-time-picker 
      v-model="picker"
      format="24hr"
      :allowed-minutes="allowedStep"
      @click:minute="$refs.menu.save(time)"/>
  </v-menu>
</template>
<script>
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
      time: '',
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
  },
  methods: {
    allowedHours: v => v % 2,
    allowedMinutes: v => v >= 10 && v <= 50,
    allowedStep: m => m % 15 === 0,
  },
};
</script>