<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID" />
      <span class="demonstration">选择时间</span>
      <el-date-picker
        v-model="listQuery.time"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd HH:mm:ss"
        clearable
        type="datetime"
        placeholder="选择日期"
      /> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />

      <el-table-column align="center" min-width="100px" label="用户ID" prop="userId" /> 
      <el-table-column align="center" min-width="100px" label="主持人ID" prop="anchorId" /> 

      <el-table-column align="center" min-width="100px" label="严重程度" prop="severeLevel" />

      <el-table-column align="center" label="类型" prop="reason">
        <template slot-scope="scope">
          <el-tag>{{ reasonDic[scope.row.reason] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="添加时间" prop="addTime" />
      <el-table-column align="center" min-width="100px" label="结束时间" prop="endTime" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listProhibtUsers, listProhibtUserId } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Prohibit',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        time: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      reasonDic: ['发广告', '不当言论', '伤风败俗'],
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      if (this.listQuery.userId) {
        this.listLoading = true
        listProhibtUserId(this.listQuery)
          .then(response => {
            this.list = response.data.data.list
            this.total = response.data.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.list = []
            this.total = 0
            this.listLoading = false
          })
        return
      }
      if (this.listQuery.time) {
        this.listLoading = true
        listProhibtUsers(this.listQuery)
          .then(response => {
            this.list = response.data.data.list
            this.total = response.data.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.list = []
            this.total = 0
            this.listLoading = false
          })
        return
      }     
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [ 'ID', '用户ID', '主持人ID', '类型', '开始时间', '结束时间']
        const filterVal = ['id', 'userId', 'anchorId', 'reason', 'addTime', 'endTime']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '禁言用户信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
