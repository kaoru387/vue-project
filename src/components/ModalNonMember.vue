<template>
  <el-dialog
    title="スタジオ予約"
    custom-class="dialog_non_member"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="90%"
    append-to-body
    @close="close"
  >
    <form class="needs-validation" novalidate>
      <div class="form-group">
        <div class="form-row justify-content-start align-items-end">
          <div class="col-12 mb-1">
            <iframe class="if-koza" :src='"https://www.supersaas.jp/schedule/susture/General?service_id=233195&year="+year+"&month="+month+"&day="+day' width="100%" :height=height></iframe>
            <!-- <iframe class="if-koza" :src='"https://m.supersaas.jp/schedule/susture/General?service_id=233195"' width="100%" :height=height></iframe> -->
            <!-- <iframe class="if-koza" :src='"https://www.supersaas.jp/schedule/susture/General?service_id=233195"' width="100%" :height=height></iframe> -->
          </div>
        </div>
      </div>
    </form>
  </el-dialog>
</template>

<script>

  import { Dialog } from 'element-ui'
  import moment from "moment";

  export default {
    components: {
      'el-dialog': Dialog,
      // 'el-checkbox': Checkbox,
    },
    props: {
      dialogFormVisible: {
        type: Boolean,
        default: false,
      },
      closeModal: {
        type: Function,
        default: function () {},
      },
    },
    data () {
      return {
        row_index: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        year: '2020',
        month: '12',
        day: '10',
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize: function() {
        // resizeのたびにこいつが発火するので、ここでやりたいことをやる
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      },
      setDate: function(date){
        // 選択日付
        this.year = moment(date).format('yyyy');
        this.month = moment(date).format('MM');
        this.day = moment(date).format('DD');
      },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
    },
  }
</script>
