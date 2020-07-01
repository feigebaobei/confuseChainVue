<template>
  <div class="identityCard">
    <div class="header">
      <img :src="ic_key" alt="">
      <span class="name">{{name}}</span>
    </div>
    <img src="" alt="" id="bar">
    <p>{{}}</p>
    <!-- <h2>基本样式</h2> -->
    <!-- <basicvue></basicvue> -->
  </div>
</template>

<script>
// import { basicvue } from '@/components/oasiscare'
import ic_key from '@/assets/ic_key.png'
import JsBarcode from 'jsbarcode'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    originText: {
      tepe: String,
      default: ''
    }
  },
  data () {
    return {
      ic_key: ic_key
    }
  },
  computed: {
  },
  components: {
    // basicvue
  },
  methods: {
    init () {
      JsBarcode('#bar', this.originText)
      // this.getData()
    },
    // getData () {}
  },
  created () {},
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>

  .identityCard
    .header
      display: flex
      align-items: center
      justify-content: center

      img
        width: 26px

      .name
        font-weight: 600

    #bar
      width: 100%
</style>
