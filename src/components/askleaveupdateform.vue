<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="updateForm" label-position="top" label-width="100px" class="demo-ruleForm" size="small">

      <el-form-item label="假期类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择假期类型">
          <el-option v-for="item in leaveList" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="ruleForm.type && (ruleForm.type >= 1 || ruleForm.type <= 7)" style="margin:10px 0">
        {{ leaveList[ruleForm.type-1].content }}
      </div>
      <el-form-item label="假期范围" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="请假原因" prop="reason">
        <el-input v-model="ruleForm.reason" placeholder="请输入请假原因"></el-input>
      </el-form-item>

      <el-form-item label="提交至" prop="draftdone">
        <el-radio-group v-model="ruleForm.draftdone">
          <el-radio label="草稿箱"></el-radio>
          <el-radio label="提交审核"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button style="float: right" type="primary" @click="submitForm('updateForm')"> 提交 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import { LEAVE_LIST } from '../common/leavelist'
import { bus } from '../common/bus'

export default {
  data () {
    return {
      leaveList: LEAVE_LIST,
      ruleForm: {
        date: [],
        type: '',
        reason: '',
        draftdone: ''
      },
      rules: {
        date: [
          { required: true, message: '请填写时间范围', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择假期类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入请假原因', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        draftdone: [
          { required: true, message: '请选择提交方式', trigger: 'change' }
        ]
      }
    }
  },
  props: ['currentData'],
  created: function () {
    this.ruleForm.date = [this.currentData.startTime * 1000, this.currentData.endTime * 1000]
    this.ruleForm.type = this.currentData.type
    this.ruleForm.reason = this.currentData.reason
    if (this.currentData.status === 1) {
      this.ruleForm.draftdone = '草稿箱'
    } else {
      this.ruleForm.draftdone = '提交审核'
    }
  },
  // 侦听器
  watch: {
    currentData: function () {
      this.ruleForm.date = [this.currentData.startTime * 1000, this.currentData.endTime * 1000]
      this.ruleForm.type = this.currentData.type
      this.ruleForm.reason = this.currentData.reason
      if (this.currentData.status === 1) {
        this.ruleForm.draftdone = '草稿箱'
      } else {
        this.ruleForm.draftdone = '提交审核'
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let $this = this
          let params = new URLSearchParams()
          params.append('username', 'Jack')
          params.append('startTime', this.ruleForm.date[0] / 1000)
          params.append('endTime', this.ruleForm.date[1] / 1000)
          params.append('type', this.ruleForm.type)
          params.append('reason', this.ruleForm.reason)
          if (this.ruleForm.draftdone === '草稿箱') {
            params.append('submitStatus', 1)
          } else {
            params.append('submitStatus', 2)
          }
          params.append('id', this.currentData.id)

          axios.post('http://localhost:8080/leave/apply/modify', params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            withCredentials: true
          }).then(function (response) {
            $this.resetForm(formName)
            if (response['data']['errno'] === 0) {
              bus.$emit('result', '1')
            } else {
              bus.$emit('result', '2')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
