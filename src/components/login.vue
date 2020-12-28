<template>
  <div class="login">
  	<form method="post" action="https://www.supersaas.com/api/users">
	  <input type="hidden" name="account" value="susture"/>
	  <input type="hidden" name="id" value="1234fk"/> <!-- The user has ID 1234 on your server's database -->
	  <input type="hidden" name="user[name]" value="A@susture.com"/>
	  <input type="hidden" name="user[full_name]" value="生徒A"/>
	  <input type="hidden" name="user[email]" value="A@susture.com"/>
	  <input type="hidden" name="user[mobile]" value=""/>
	  <input type="hidden" name="user[address]" value=""/>
	  <!-- you can add and remove fields on the "Access Control" screen -->
	  <input type="hidden" name="checksum" value="1e5dcff50bb5f9a5273602b25a2f0d41"/>
	  <input type="hidden" name="after" value="experience"/>
	  <input type="submit" value="Book now"/>
	</form>
	<a href="https://www.supersaas.com/api/login?account=susture&after=experience&user[name]=A%40susture.com&checksum=1e5dcff50bb5f9a5273602b25a2f0d41">Log in</a>
  </div>
</template>

<script>
  import { Dialog } from 'element-ui'

  export default {
    components: {
      'el-dialog': Dialog,
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

