<template>
  <div class="checkValidity">
    <h2>查验页面内容</h2>
    <!-- <certifyCheck></certifyCheck> -->
    <button @click="openApp">测试唤醒app</button>
  </div>
</template>

<script>
// import { certifyCheck } from './certifyCheck.vue'
import instance from '@/lib/axiosInstance'
export default {
  props: {},
  data () {
    return {
      temporaryId: this.$route.query.temporaryId || '0x700aa5b0bf33da121b885be22d26266a4b90b7eb774bfcf7d5962dbcb3d7e078',
      certifyData: {}
    }
  },
  computed: {
  },
  components: {
    // certifyCheck
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      instance({
        url: 'claim/checkValidity',
        method: 'post',
        data: {
          temporaryId: this.temporaryId
        }
      }).then(response => {
        this.certifyData = response.data.data.certify_data || '{}'
        this.certifyData = JSON.parse(this.certifyData)
      }).catch(error => {
        alert(error.message)
      })
    },
    openApp () {
      console.log('openApp')
      window.location = 'tokentm://open_app'
      setTimeout(function () {
        alert('2s后会进入应用市场')
      }, 2000);
    }
  },
  created () {},
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>

  // .checkValidity

</style>
