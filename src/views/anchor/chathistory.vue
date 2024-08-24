<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.anchorId" clearable class="filter-item" style="width: 200px;" placeholder="请输入主持人ID"/>
     <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable/>

      <el-table-column align="center" min-width="100px" label="主持人ID" prop="anchorId"/> 
      <el-table-column align="center" min-width="100px" label="主持人名" prop="anchorName"/>
      <el-table-column align="center" min-width="100px" label="标签" prop="tag"/>
      <el-table-column align="center" min-width="100px" label="时间规划ID" prop="scheduleId"/>
      <el-table-column align="center" min-width="100px" label="年" prop="year"/>
      <el-table-column align="center" min-width="100px" label="月" prop="month"/>
      <el-table-column align="center" min-width="100px" label="日" prop="dayOfMonth"/>
      <el-table-column align="center" min-width="100px" label="开始" prop="start"/>
      <el-table-column align="center" min-width="100px" label="结束" prop="end"/>
    
      <el-table-column align="center" min-width="100px" label="平均评分" prop="avgRating"/>
      <el-table-column align="center" min-width="100px" label="平均停留时间（秒）" prop="avgStayTime"/> 
      <el-table-column align="center" min-width="100px" label="开始时间" :formatter="timeFormat" prop="startTime"/>
      <el-table-column align="center" min-width="100px" label="结束时间" :formatter="timeFormat" prop="endTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listAnchorChatHistory } from '@/api/anchor'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'

export default {
  name: 'FootPrint',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        anchorId: undefined,
        sort: 'id',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    timeFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) { return '' }
      return date[0] + ':' + date[1] + ':' + date[2]
    },
    getList() {
      if (!this.listQuery.anchorId) {
        this.listLoading = false
        return
      }
      this.listLoading = true
      listAnchorChatHistory(this.listQuery)
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
        const tHeader = ['主持人ID', '主持人名', '名称','标签','总评分','评分次数','开始时间','结束时间']
        const filterVal = ['anchorId', 'anchorName', 'name', 'tag','totalRating', 'numRating', 'startTime','endTime']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '主持人主持历史信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
