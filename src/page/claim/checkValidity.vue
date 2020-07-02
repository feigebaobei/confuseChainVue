<template>
  <div class="checkValidity">
    <!-- <h2>查验页面内容</h2> -->
    <!-- 请求到数据 -->
      <!-- 渲染证书 -->
      <!-- <section class="certifyBox" :style="{background: `url(${idCardBg})`}"> -->
      <section class="certifyBox" :style="compIdCardBg">
        <div class="cont">
          <p class="ap name">{{opCertifyDataItem(certifyData.needHashData.name)}}</p>
          <p class="ap gender">{{opCertifyDataItem(certifyData.needHashData.gender)}}</p>
          <p class="ap nation">{{opCertifyDataItem(certifyData.needHashData.nation)}}</p>
          <p class="ap year">{{opCertifyDataBirth(certifyData.needHashData.birthday)}}</p>
          <p class="ap month">{{opCertifyDataBirth(certifyData.needHashData.birthday)}}</p>
          <p class="ap day">{{opCertifyDataBirth(certifyData.needHashData.birthday)}}</p>
          <p class="ap address">{{opCertifyDataItem(certifyData.needHashData.address)}}</p>
          <p class="ap identityNumber">{{opCertifyDataItem(certifyData.needHashData.identityNumber)}}</p>
        </div>
      </section>
      <!-- 附加数据 -->
      <section class="extendData">
        <p>
          <span class="key">签发机关：</span>
          <span class="value">{{opCertifyDataItem(certifyData.needHashData.issueAuthority)}}</span>
        </p>
        <p>
          <span class="key">有效期限：</span>
          <span class="value">{{opTimeRange(certifyData.needHashData.startTime, certifyData.needHashData.endTime)}}</span>
        </p>
      </section>
      <!-- 链上指纹 -->
      <section class="chainFingerPrint">
        <!-- <p>链上指纹：</p> -->
        <img src="" alt="" id="bar">
      </section>
      <!-- 签名列表 -->
      <!-- 拥有者 -->
      <!-- 因为没有udid，所以不渲染。 -->
      <!-- <identity-card v-if="hashCont" :name="opCertifyDataItem(certifyData.needHashData.name)" :originText="hashCont"></identity-card> -->
      <!-- 结果 -->
      <section class="compareRes">
        <section class="chain">
          <p>链上多重指纹</p>
          <p>{{hashCont}}</p>
        </section>
        <section class="local" v-if="hashContLocal">
          <p>计算后的链上多重指纹</p>
          <p>{{hashContLocal}}</p>
        </section>
        <section class="tip" v-if="hashContLocal">
          <!-- <p>OK，按指纹规则重新计算与链上指纹数值完全一致，内容正确！</p> -->
          <p>{{compareRes}}</p>
        </section>
      </section>
      <!-- 查验说明 -->
      <section class="ruleDecribe">
        <p>指纹计算规则说明</p>
        <img :src="arrows" alt="" @click="changeShowRule" :class="{arrows: true, down: !showRule, up: showRule}">
        <section class="rule" v-if="showRule">
          <p>原理: 利用SM3密码散列函数,对于任何一个给定的消息，它都很容易就能运算出散列数值。一个已知的散列数值，难以去推算出原始的消息。对于两个不同的消息，散列数值不同。</p>
          <p>说明:</p>
          <p>证书核验采用对每个值求散列值,然后拼接起来对整体求散列值。声明证书的时候确保了证书的多重散列值准确无误的上链了,核验证书的时候只需计算证书本书的多重散列值和链上作对比即可。</p>
          <p>举例:</p>
          <p>多重散列值 = SM3(SM3(name)+SM3(age)+SM3(…))</p>
        </section>
      </section>
      <!-- button -->
      <button @click="checkCertify" class="checkCertify">查验证书</button>
      <!-- 计算比对 -->
    <!-- 请求不到数据 -->
    <!-- <certifyCheck></certifyCheck> -->
    <button @click="openApp">测试唤醒app</button>
  </div>
</template>

<script>
import instance from '@/lib/axiosInstance'
import idCardBg from '@/assets/front_image.jpg'
import arrows from '@/assets/arrows.png'
import JsBarcode from 'jsbarcode'
// import identityCard from '@/components/identityCard.vue'
import tokenSDKClient from 'token-sdk-client'
export default {
  props: {},
  data () {
    return {
      templateId: '0xd74c92c0fe1f03b7b34a1ee2256bb48df13c44accaf0a02330f4b08e46ddb315',
      temporaryId: this.$route.query.temporaryId, // || '0x700aa5b0bf33da121b885be22d26266a4b90b7eb774bfcf7d5962dbcb3d7e078',
      claim_sn: '',
      certifyData: {
        needHashData: {
          address: '',
          birthday: '',
          endTime: '',
          gender: '',
          identityNumber: '',
          issueAuthority: '',
          name: '',
          nation: '',
          startTime: ''
        }
      },
      template: {},
      hashCont: '', // 证书哈希值
      // idCardBg: idCardBg
      arrows: arrows,
      showRule: false, // 是否显示规则
      hashContLocal: '',
      compareRes: ''
    }
  },
  computed: {
    compIdCardBg () {
      return {
        'background': `url(${idCardBg})`,
        'background-repeat': 'no-repeat',
        'background-size': 'contain',
        'background-position': '50% 50%'
      }
    }
  },
  components: {
    // identityCard
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      if (!this.temporaryId) {
        return false
      }
      instance({
        url: 'claim/getTemporaryCertifyData',
        method: 'post',
        data: {
          temporaryId: this.temporaryId
        }
      }).then(response => {
        // console.log(response)
        if (!response.data.result) {
          return Promise.reject(new Error(response.data.message || '出错了'))
        }
        this.claim_sn = response.data.data.claim_sn
        this.certifyData = response.data.data.certify_data || '{}'
        this.certifyData = JSON.parse(this.certifyData)
        // 请求证书模板
        // this.getTemplate()
        this.renderBarCode(this.claim_sn)
      }).catch(error => {
        console.log(error)
        alert(error.message)
        // this.getTemplate()
        this.renderBarCode(this.claim_sn)
      })
    },
    // getTemplate (templateId = '0xd74c92c0fe1f03b7b34a1ee2256bb48df13c44accaf0a02330f4b08e46ddb315') {
    //   // 向链节点云服务请求证书模板
    //   // tokenSDKClient.getTemplate(templateId)
    //   // 使用confuseChainServer代理请求证书模板
    //   instance({
    //     url: 'proxyChain/getTemplate',
    //     method: 'post',
    //     data: {
    //       templateId: templateId
    //     }
    //   })
    //   .then(response => {
    //     console.log(response.data)
    //     let templateStr = response.data.result.meta_cont || '{}'
    //     this.template = JSON.parse(templateStr)
    //     // this.renderBarCode("0x700aa5b0bf33da121b885be22d26266a4b90b7eb774bfcf7d5962dbcb3d7e078")
    //   }).catch(() => {
    //     let templateStr = '{"title":"身份证","id":"t008","type":"identity","label":"身份证","background":"https://raw.githubusercontent.com/lqxue/picture_list/master/image/20200624102307.png","example":"https://raw.githubusercontent.com/lqxue/picture_list/master/image/20200625161633.png","keys":{"name":{"type":"text","label":"姓名","name":"name","value":""},"gender":{"type":"text","label":"性别","name":"gender","value":""},"nation":{"type":"text","label":"民族","name":"nation","value":""},"birthday":{"type":"text","label":"出生","name":"birthday","value":""},"address":{"type":"text","label":"住址","name":"address","value":""},"identityNumber":{"type":"text","label":"公民身份号码","name":"identityNumber","value":""},"issueAuthority":{"type":"text","label":"签发机关","name":"issueAuthority","value":""},"startTime":{"type":"text","label":"开始时间","name":"startTime","value":""},"endTime":{"type":"text","label":"结束时间","name":"endTime","value":""},"faceFeature":{"type":"img","label":"人脸特征值","name":"faceFeature","value":""},"front":{"type":"img","label":"身份证正面","name":"front","value":""},"back":{"type":"img","label":"身份证反面","name":"back","value":""}},"desc":"姓名$name$性别$gender$民族$nation$出生$birthday$住址$address$公民身份号码$identityNumber$签发机关$issueAuthority$开始时间$startTime$结束时间$endTime$"}'
    //     this.template = JSON.parse(templateStr)
    //     // this.renderBarCode("0x700aa5b0bf33da121b885be22d26266a4b90b7eb774bfcf7d5962dbcb3d7e078")
    //   })
    // },
    openApp () {
      window.location = 'tokentm://open_app'
      setTimeout(function () {
        alert('2s后会进入应用市场')
      }, 2000);
    },
    // 根据是否被hash过显示对应数据
    opCertifyDataItem (val) {
      if (val.indexOf('0x') !== 0 && val.length !== 38) {
        return val
      } else {
        return '**不公开**'
      }
    },
    // 根据是否被hash过显示对应数据
    opCertifyDataBirth (val) {
      if (val.indexOf('0x') === 0 && val.length === 38) {
        return val
      } else {
        return '****'
      }
    },
    // 处理证书的有效期限
    opTimeRange (startTime, endTime) {
      let [start, end] = [new Date(Number(startTime)), new Date(Number(endTime))]
      let [sy, sm, sd, ey, em, ed] = [start.getFullYear(), start.getMonth() + 1, start.getDate(), end.getFullYear(), start.getMonth() + 1, start.getDate()]
      return `${sy}年${sm}月${sd}日-${ey}年${em}月${ed}日`
    },
    // 渲染链上指纹为条形码
    renderBarCode (claim_sn) {
      instance({
        url: 'proxyChain/getClaim',
        method: 'post',
        data: {
          claim_sn: claim_sn
        }
      }).then(response => {
        // console.log(response)
        this.hashCont = response.data.data.result.hash_cont
        JsBarcode('#bar', this.hashCont)
      }).catch(error => {
        console.log(error)
      })
    },
    changeShowRule () {
      this.showRule = !this.showRule
    },
    // 本地证书hash值后比对。同时告诉后端查验次数-1
    checkCertify () {
      if (this.compareRes) {
        alert('已经查验过该证书，请不要多次查验。')
        return
      }
      let p = new Promise(resolve => {
        if (this.template.desc) {
          resolve(this.template.desc)
        } else {
          instance({
            url: 'proxyChain/getTemplate',
            method: 'post',
            data: {
              templateId: this.templateId
            }
          }).then(response => {
            this.template = JSON.parse(response.data.data.result.meta_cont)
            resolve(this.template.desc)
          })
        }
      })
      p.then(desc => {
        let hash = new tokenSDKClient.Keccak(256)
        for (let [key, value] of Object.entries(this.certifyData.needHashData)) {
          let hashStr = ''
          let reg = new RegExp(`\\$${key}\\$`, 'ig')
          if (value.indexOf('0x') === 0 && value.length === 66) { // 已经被hash了
            hashStr = value
          } else {
            hash.update(value)
            hashStr = hash.digest()
            hashStr = '0x' + tokenSDKClient.utils.bytesToStrHex(hashStr)
            hash.reset()
          }
          desc = desc.replace(reg, hashStr)
        }
        hash.update(desc)
        this.hashContLocal = hash.digest()
        this.hashContLocal = '0x' + tokenSDKClient.utils.bytesToStrHex(this.hashContLocal)
        hash.reset()
        if (this.hashContLocal === this.hashCont) {
          this.compareRes = 'OK，按指纹规则重新计算与链上指纹数值完全一致，内容正确！'
        } else {
          this.compareRes = 'NO，按指纹规则重新计算与链上指纹数值不一致，内容错误！'
        }
        return
      }).then(() => {
        // 调用后端接口，可查验次数减一
        instance({
          url: 'claim/checkValidity',
          method: 'post',
          data: {temporaryId: this.temporaryId}
        })
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {},
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>

  .checkValidity
    width: 700px
    margin: 0 auto

    .certifyBox
      display: flex

      .cont
        position: relative
        // width: 700px
        height: 445px
        // margin: 0 auto

        .ap
          position: absolute

        .name
          left: 120px
          top: 50px
          width: 120px

        .gender
          left: 120px
          top: 106px
          width: 120px

        .nation
          left: 280px
          top: 106px
          width: 120px

        .year
          left: 160px
          top: 160px
          width: 120px

        .month
          left: 240px
          top: 160px
          width: 120px

        .day
          left: 306px
          top: 160px
          width: 120px

        .address
          left: 120px
          top: 220px
          width: 360px

        .identityNumber
          left: 210px
          top: 362px
          width: 400px

    .extendData
      margin-bottom: 30px

      p
        // margin: 10px 0

      .value
        font-weight: 600

    .chainFingerPrint
      margin-bottom: 20px
      img
        width: 100%

    .ruleDecribe
      display: flex
      justify-content: space-between
      align-items: center
      flex-wrap: wrap

      .arrows
        width: 30px
        height: 30px

      .down
        transform: rotate(90deg)

      .up
        transform: rotate(-90deg)

      .rule
        width: 100%
        flex-basis: 100%
        flex-shrink: 0

    .checkCertify
      width: 70%
      background: #57ba9e
      margin: 0 auto
      display: block
      border: none
      border-radius: 40px
      padding: 10px
      color: #fff
      font-size: 18px

    .compareRes
      .tip
        width: 70%
        margin: 0 auto
        padding: 10px 15px
        color: #fff
        background: #57ba9e
        border-radius: 80px
        text-align: center
</style>
