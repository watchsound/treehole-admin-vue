<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.referUserId" clearable class="filter-item" style="width: 200px;" placeholder="推荐人ID" />
      <span class="demonstration">开始时间</span>
      <el-date-picker
        v-model="listQuery.start"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        placeholder="选择日期"
      />
      <span class="demonstration">结束时间</span>
      <el-date-picker
        v-model="listQuery.end"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        placeholder="选择日期"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />

      <el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />

      <el-table-column align="center" min-width="100px" label="推荐人ID" prop="refereeId" />

      <el-table-column align="center" min-width="100px" label="用户第一次购买" prop="amount" />

      <el-table-column align="center" min-width="100px" label="积分记录ID" prop="pointHistoryId" />

      <el-table-column align="center" min-width="100px" label="添加时间" prop="addTime" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listRefereeHistory, listRefereeHistoryById } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'History',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        referUserId: undefined,
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
  //  this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.referUserId) {
        listRefereeHistoryById(this.listQuery)
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
      listRefereeHistory(this.listQuery)
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
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '推荐人ID', '用户ID', '用户第一次购买', '积分记录ID', '添加时间']
        const filterVal = ['id', 'refereeId', 'userId', 'amount', 'pointHistoryId', 'addTime']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '推荐有礼历史信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
