<template>
  <v-container fluid>
    <h4 class="pl-3">会員専用</h4>
    <v-row class="text-center">
      <iframe class="if-koza" src="https://www.supersaas.jp/schedule/susture/StudioKoza" width="100%" :height=height></iframe>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  }
</script>
