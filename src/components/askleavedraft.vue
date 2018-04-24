<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData3"
      v-loading="loading"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        label="申请时间"
        width="180"
        header-align="center"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.applyTime | dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column
        label="假期类型"
        width="100"
        header-align="center"
        align="center">
        <template slot-scope="scope">{{ leaveList[scope.row.type - 1].name }}</template>
      </el-table-column>
      <el-table-column
        prop="applyUserName"
        label="申请人"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="department"
        label="部门"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="开始时间"
        width="120"
        header-align="center"
        align="center">
        <template slot-scope="scope">{{ scope.row.startTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        width="120"
        header-align="center"
        align="center">
        <template slot-scope="scope">{{ scope.row.endTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="reviewer"
        label="审核人"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="reason"
        label="原因"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="当前状态"
        header-align="center"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope"><el-tag type="info">{{ statusList[scope.row.status - 1] }}</el-tag></template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateForm(scope.row)">编辑</el-button>
          <el-button style="color:#f56c6c;" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button type="danger" size="small" > 确认删除</el-button>
      <el-button size="small" @click="toggleSelection()">取消选择</el-button>
      <el-button type="primary" @click="dialogVisible = true" size="small" style=""> <i class="el-icon-plus"> 添加请假申请</i> </el-button>
      <div style="float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalData">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="添加假期申请"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="100px" class="demo-ruleForm" size="small">

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
          <el-button style="float: right" type="primary" @click="submitForm('ruleForm')"> 提交 </el-button>
          <el-button style="float: right;margin-right: 20px" @click="resetForm('ruleForm')"> 取消 </el-button>
        </el-form-item>
      </el-form>
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
    <el-dialog
      title="编辑请假申请"
      :visible.sync="dialogVisible2"
      width="40%"
      :before-close="handleClose2">
        <askleaveupdateform :current-data="updatedata" ref="askleaveupdateformid"></askleaveupdateform>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import { LEAVE_LIST } from '../common/leavelist'
import { STATUS_LIST } from '../common/statuslist'
import askleaveupdateform from '../components/askleaveupdateform.vue'
import { bus } from '../common/bus'

export default {
  data () {
    return {
      currentPage: 1,
      tableData3: [],
      multipleSelection: [],
      leaveList: LEAVE_LIST,
      statusList: STATUS_LIST,
      totalData: 100,
      pageSize: 10,
      loading: true,
      dialogVisible: false,
      dialogVisible2: false,
      updatedata: {},
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
  components: {
    askleaveupdateform
  },
  filters: {
    dateFormat (time) {
      var date = new Date(time * 1000)
      return moment(date).format('YYYY-MM-DD')
    },
    dateTimeFormat (time) {
      var date = new Date(time * 1000)
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    bus.$on('result', (text) => {
      this.dialogVisible2 = false
      if (text === '1') {
        this.getDraftData(this.currentPage, this.pageSize)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else {
        this.$message.error('修改失败')
      }
    })
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.resetForm('ruleForm')
        })
        .catch(_ => {})
    },
    handleClose2 (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.dialogVisible2 = false
        })
        .catch(_ => {})
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      console.log('pageSize = ' + this.pageSize)
      this.pageSize = val
      this.loading = true
      console.log('currentPage :' + this.currentPage)
      this.currentPage = 1
      this.getDraftData(this.currentPage, this.pageSize)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // this.login()
      // console.log(`当前页: ${val}`)
      // console.log('currentPage :' + this.currentPage)
      this.loading = true
      this.getDraftData(this.currentPage, this.pageSize)
    },
    getDraftData (page = 1, pageSize = 10) {
      let $this = this
      let params = new URLSearchParams()
      params.append('username', 'Jack')
      params.append('page', page)
      params.append('pageSize', pageSize)
      // 不用URLSearchParams不能以表单的方式提交
      axios.post('http://localhost:8080/leave/apply/draftList', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        withCredentials: true
      }).then(function (response) {
        console.log(response)
        $this.totalData = response['data']['data']['total']
        $this.tableData3 = response['data']['data']['list']
        setTimeout(function () {
          $this.loading = false
        }, 1000)
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let $this = this
          let params = new URLSearchParams()
          params.append('username', 'Jack')
          params.append('startTime', Date.parse(this.ruleForm.date[0]) / 1000)
          params.append('endTime', Date.parse(this.ruleForm.date[1]) / 1000)
          params.append('type', this.ruleForm.type)
          params.append('reason', this.ruleForm.reason)
          if (this.ruleForm.draftdone === '草稿箱') {
            params.append('submitStatus', 1)
          } else {
            params.append('submitStatus', 2)
          }

          axios.post('http://localhost:8080/leave/apply/add', params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            withCredentials: true
          }).then(function (response) {
            $this.resetForm(formName)
            if (response['data']['errno'] === 0) {
              $this.getDraftData($this.currentPage, $this.pageSize)
              $this.$message({
                message: '请假申请成功',
                type: 'success'
              })
            } else {
              $this.$message.error('请假申请失败')
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
      this.dialogVisible = false
    },
    updateForm (data) {
      this.dialogVisible2 = true
      this.updatedata = data
    }
  }
}
</script>
