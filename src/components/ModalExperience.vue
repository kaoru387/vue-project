<template>
  <el-dialog
    title="体験レッスンの予約"
    custom-class="dialog_experience"
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
            <iframe class="if-koza" src="https://www.supersaas.jp/schedule/susture/experience" :height=height width="100%"></iframe>
          </div>
        </div>
       
      </div>
    </form>
  </el-dialog>
</template>

<script>

  // import Vue from 'vue'
  // import store from '../store/ProjectsIndexStore';
  import { Dialog } from 'element-ui'
  // import { Dialog } from 'element-ui'
  // import VeeValidate, { Validator } from'vee-validate'
  // import ja from 'vee-validate/dist/locale/ja'
  // Validator.localize('ja', ja);
  // Vue.use(VeeValidate, { locale: ja });

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
