<template>
  <el-container style="height: 100%; width: 100%;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <!--flex布局做居中-->
      <div style="height:60px;display: flex;align-items: center;justify-content: center;">
        <img src="../assets/logo.png" style="width: 30px;height: 30px;">
      </div>
      <el-menu :default-openeds="['1']">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>申请管理</template>
          <el-menu-item-group>
            <template slot="title">请假申请</template>
            <el-menu-item index="1-1"><router-link to="/main/askleave" tag="div" replace>请假信息</router-link></el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="加班申请">
            <el-menu-item index="1-2"><router-link to="/main/askovertime" tag="div" replace>加班信息</router-link></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>审核管理</template>
          <el-menu-item index="2-1">审核信息</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-setting"></i>帮助信息</template>
          <el-menu-item index="3-1">帮助信息</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>

      <el-main>
        <el-card class="box-card" style="min-height: 500px">
          <router-view/>
        </el-card>
        <!--<el-table :data="tableData">-->
          <!--<el-table-column prop="date" label="日期" width="140">-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="name" label="姓名" width="120">-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="address" label="地址">-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

</style>

<script>
export default {
  name: 'dashboard',
  data () {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item)
    }
  }
}
</script>
