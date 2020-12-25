<template>
  <v-container fluid>
    <h4 class="pl-3">ナゴスタジオ予約（会員専用）</h4>
    <v-row class="text-center">
      <iframe src="https://www.supersaas.jp/schedule/susture/StudioNago" width="100%" :height=height></iframe>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'StudioNago',
    data: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  }
</script>
