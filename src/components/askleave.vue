<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane  name="first">
      <span slot="label"><i class="el-icon-delete"></i> 草稿箱</span>
      <askleavedraft ref="askleavedraftid"></askleavedraft>
    </el-tab-pane>
    <el-tab-pane  name="second">
      <span slot="label"><i class="el-icon-tickets"></i> 已提交</span>
      <askleavedone ref="askleavedoneid"></askleavedone>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import axios from 'axios'
import askleavedone from './askleavedone.vue'
import askleavedraft from './askleavedraft.vue'

// axios.defaults.withCredentials = true

export default {
  data () {
    return {
      activeName: 'second'
    }
  },
  components: {
    askleavedone,
    askleavedraft
  },
  created: function () {
    this.login()
  },
  mounted: function () {
    this.$refs.askleavedoneid.getDraftData()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab.name, event)
      if (tab.name === 'first') {
        this.$refs.askleavedraftid.getDraftData(this.$refs.askleavedraftid.currentPage, this.$refs.askleavedraftid.pageSize)
      } else {
        this.$refs.askleavedoneid.getDraftData(this.$refs.askleavedoneid.currentPage, this.$refs.askleavedoneid.pageSize)
      }
    },
    login () {
      let params = new URLSearchParams()
      params.append('username', 'Jack')
      params.append('password', '123456')
      axios.post('http://localhost:8080/leave/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        withCredentials: true
      }).then(function (response) {
      })
    }
  }
}
</script>
<style>

</style>
