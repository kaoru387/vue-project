<template>
  <el-dialog
    title="コザスタジオを予約する"
    custom-class="dialog_koza"
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
            <iframe class="if-koza" src="https://www.supersaas.jp/schedule/susture/StudioKoza" :height=height width="100%"></iframe>
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
        // dialogFormVisible: false,
    //     addTreesModal: false,
    //     visible: false,
    //     loading: false,
    //     form: {
    //       id: '',
    //       price: 0,
    //       cost_price: 0,
    //       official_price: 0,
    //       official_price_rate: 70,
    //       customer_price: 0,
    //       mtb_tree_id: 0,
    //       mtb_tree_size_id: 0,
    //       mtb_tree_name: '',
    //       mtb_tree_size_name: '',
    //       checked: false,
    //     },
    //     items: [],
    //     delete_item: [],
    //     name: '',
    //     sub_name: '',
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.handleResize)
    },
    // beforeDestroy: function () {
    //   window.removeEventListener('resize', this.handleResize)
    // }
    // computed: {
    // },
    // watch: {
    // },
    // created() {
    //   // console.log(this.projectId,store.state.page);
    // },
    methods: {
      handleResize: function() {
        // resizeのたびにこいつが発火するので、ここでやりたいことをやる
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      },

    //   calculation: function(){
    //     var that = this;
    //     if(0<that.form.official_price) that.form.price = that.form.official_price*that.form.official_price_rate/100;
    //   },
    //   submitForm() {
    //     var that = this;
    //     // TODO: バリデーション
    //     //this.$validator.validateAll().then((result) => {
    //     //  if (!result) {
    //     //    return
    //     //  }
    //     //  alert('Hello, ' + this.register.email)
    //     //})
    //     //if(_.find(this.items, { 'deleted': false })) return true;

    //     //変更されたデータのみ取得
    //     //let component = _.filter(this.$refs.modal_add_trees_item, function(o) { return o.editFlg; });

    //     that.loading = true;
    //     store.dispatch('savePriceJisha', {
    //       params: {
    //         data: that.form,
    //         hash_id: store.state.page,
    //       },
    //       successed: function(res){
    //         console.log(res)
    //         that.close()
    //         that.$emit('refresh',res.data.data)
    //         that.$message({
    //           message: '登録しました。',
    //           type: 'success',
    //         });
    //       },
    //       always: function(){
    //         that.loading = false;
    //       },
    //     })
    //   },
    //   openModal (data) {
    //     this.initModal(data)
    //     this.dialogFormVisible = true;
    //   },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
    //   initModal (data) {
    //     console.log('ini',data);
    //     var that = this;
    //     that.form.mtb_tree_name=data.mtb_tree_name;
    //     that.form.mtb_tree_size_name=data.mtb_tree_size_name;
    //     that.form.mtb_tree_id=data.mtb_tree_id;
    //     that.form.mtb_tree_size_id=data.mtb_tree_size_id;
    //     that.form.official_price=data.official_price;
    //     that.form.price=data.product.price;
    //     that.form.cost_price=data.product.cost_price;
    //     that.form.mtb_product_id=data.mtb_product_id;
    //     that.form.official_price_rate=data.product.price*100;
    //     that.form.unit=data.unit;
    //     that.form.name=data.name;
    //     that.form.mtb_category_id=data.mtb_category_id;

    //     if(!data.product) return;
    //     that.form.id=data.product.id;

    //     // if(0<data.official_price) that.form.price = data.official_price*that.form.official_price_rate/100;
    //     //
    //     // //デリートアイテムを削除
    //     // that.$set(that, 'delete_item',[]);
    //     // that.$set(that, 'items',[]);

    //     // _.forEach(data, function(value) {
    //     //   that.items.push({
    //     //     row_index: that.row_index++,
    //     //     id: value.id,
    //     //     mtb_tree_name: value.mtb_tree_name,
    //     //     mtb_tree_id: value.mtb_tree_id,
    //     //     mtb_tree_size_id: value.mtb_tree_size_id,
    //     //     quantity: value.quantity,
    //     //     shipping_desired_date: value.shipping_desired_date,
    //     //     unit: value.unit,
    //     //     kumiai_yoyaku: value.kumiai_yoyaku,
    //     //     // add
    //     //     shipped_flag: value.shipped_flag,
    //     //   });
    //     // });

    //   },
    },
  }
</script>
