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
        width="100"
        header-align="center"
        align="center">
        <template slot-scope="scope">{{ scope.row.startTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        width="100"
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
        prop="reviewReason"
        label="审核意见"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        width="100"
        label="当前状态"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 2">{{ statusList[scope.row.status - 1] }}</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="success">{{ statusList[scope.row.status - 1] }}</el-tag>
          <el-tag v-else-if="scope.row.status === 4" type="danger">{{ statusList[scope.row.status - 1] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="dialogShow(scope.row)"><i class="el-icon-question"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
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
      title="申请详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">

      <div v-if="dialog_data && dialog_data.status === 2">
        <el-steps direction="vertical" :active="1" :space="70">
          <el-step title="创建时间" status="success" :description='dialog_data.applyTime | dateTimeFormat'></el-step>
          <el-step title="已提交审核" status="success" ></el-step>
          <el-step title="请等待主管审核" status="wait"></el-step>
        </el-steps>
      </div>
      <div v-if="dialog_data && dialog_data.status === 3">
        <el-steps direction="vertical" :space="70">
          <el-step title="创建时间" status="success" :description='dialog_data.applyTime | dateTimeFormat'></el-step>
          <el-step title="已提交审核" status="success"></el-step>
          <el-step title="审核时间" status="success" :description="dialog_data.reviewTime | dateTimeFormat"></el-step>
          <el-step title="审核通过" status="success"></el-step>
        </el-steps>
      </div>
      <div v-if="dialog_data && dialog_data.status === 4">
        <el-steps direction="vertical"  :space="70" >
          <el-step title="创建时间" status="success" :description='dialog_data.applyTime | dateTimeFormat'></el-step>
          <el-step title="已提交审核" status="success"></el-step>
          <el-step title="审核时间" status="success" :description="dialog_data.reviewTime | dateTimeFormat"></el-step>
          <el-step title="审核未通过" status="error"></el-step>
        </el-steps>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import { LEAVE_LIST } from '../common/leavelist'
import { STATUS_LIST } from '../common/statuslist'

export default {
  data () {
    return {
      msg: 'hello world',
      currentPage: 1,
      tableData3: [],
      multipleSelection: [],
      leaveList: LEAVE_LIST,
      statusList: STATUS_LIST,
      totalData: 100,
      pageSize: 10,
      loading: true,
      dialogVisible: false,
      dialog_data: null
    }
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
  methods: {
    dialogShow (data) {
      this.dialogVisible = true
      this.dialog_data = data
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.loading = true
      this.currentPage = 1
      this.getDraftData(this.currentPage, this.pageSize)
    },
    handleCurrentChange (val) {
      this.currentPage = val
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
      axios.post('http://localhost:8080/leave/apply/publishList', params, {
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
    }
  }
}
</script>
