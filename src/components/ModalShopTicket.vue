<template>
  <el-dialog
    title="予約回数チケット購入"
    custom-class="dialog_shop"
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
            <!-- <label class="mr-5">組合単価</label> -->
            <iframe src="https://www.supersaas.jp/shop/buy/susture" :height=height width="100%"></iframe>
          </div>
        </div>
       
      </div>
    </form>
  </el-dialog>
</template>

<script>
  export default {
    components: {
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
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
    },
  }
</script>
