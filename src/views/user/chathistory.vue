<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable/>

      <el-table-column align="center" min-width="100px" label="用户ID" prop="userId"/>

      <el-table-column align="center" min-width="100px" label="聊天群ID" prop="chatroomId"/>

      <el-table-column align="center" min-width="100px" label="主题" prop="topic"/>
     
      <el-table-column align="center" min-width="100px" label="备注" prop="comment"/>

      <el-table-column align="center" min-width="100px" label="开始时间" prop="startTime"/>

      <el-table-column align="center" min-width="100px" label="结束时间" prop="endTime"/>

      <el-table-column align="center" min-width="100px" label="打分" prop="rate"/> 
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listUserChatHistory } from '@/api/user'
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
        sort: 'start_time',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listUserChatHistory(this.listQuery)
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
        const tHeader = ['用户ID', '聊天群ID', '主题', '备注','开始时间','结束时间','打分']
        const filterVal = ['userId', 'chatroomId','topic','comment','startTime','endTime','rate' ]
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '用户聊天历史信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
