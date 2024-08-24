<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID" />
      <span class="demonstration">开始时间</span>
      <el-date-picker
        v-model="listQuery.start"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd HH:mm:ss"
        clearable
        type="datetime"
        placeholder="选择日期"
      />
      <span class="demonstration">结束时间</span>
      <el-date-picker
        v-model="listQuery.end"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd HH:mm:ss"
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

      <el-table-column align="center" min-width="100px" label="金额" prop="amount" />

      <el-table-column align="center" min-width="100px" label="点数" prop="points" />

      <el-table-column align="center" min-width="100px" label="类型" prop="reason" />

      <el-table-column align="center" min-width="100px" label="订单号" prop="orderSn" />

      <el-table-column align="center" min-width="100px" label="订单状态" prop="orderStatus" />

      <el-table-column align="center" min-width="100px" label="微信付款ID" prop="payId" />
      <el-table-column align="center" min-width="100px" label="促销活动ID" prop="promotionId" />

      <el-table-column align="center" min-width="100px" label="添加时间" prop="addTime" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listUserOrderHistory } from '@/api/user'
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
        userId: undefined,
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      if (this.listQuery.userId || (this.listQuery.start && this.listQuery.end)) {
        this.listLoading = true
        listUserOrderHistory(this.listQuery)
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
        const tHeader = ['用户ID', '金额', '兑换积分', '类型', '定单号', '状态', '微信付款ID', '促销ID', '添加时间']
        const filterVal = ['userId', 'amount', 'points', 'reason', 'orderSn', 'orderStatus', 'payId', 'promotionId',
          'addTime']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '用户订单历史信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
