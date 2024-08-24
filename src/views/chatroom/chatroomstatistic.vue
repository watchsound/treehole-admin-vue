<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <span class="demonstration">选择时间</span>
      <el-date-picker
        v-model="listQuery.day"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        placeholder="选择日期"
      />

      <el-button v-permission="['GET /admin/chatroom/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border style="width: 100%" highlight-current-row>
      <el-table-column align="center" width="50px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="主题" prop="tag" />
      <el-table-column align="center" min-width="100px" label="主持人ID" prop="anchorId" />
      <el-table-column align="center" min-width="100px" label="排课ID" prop="scheduleId" />
      <el-table-column align="center" min-width="100px" label="开始时间" prop="startTime" />
      <el-table-column align="center" min-width="100px" label="结束时间" prop="endTime" />
      <el-table-column align="center" min-width="100px" label="平均得分" prop="avgRating" />
      <el-table-column align="center" min-width="100px" label="平均停留时间" prop="avgStayTime" />
    </el-table>

  </div>
</template>

 <style>
  .red span{
    border:1px solid red;
    border-radius:50%;
  }
</style>

<script>
import { getChatroomStatisticByDate } from '@/api/chatroom'

import moment from 'moment'

export default {
  name: 'ChatroomStatistic',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        day: undefined
      },
      paylevelDic: ['基本', '一级', '二级'],
      rules: {
      },
      downloadLoading: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (!this.listQuery.day) {
        this.listLoading = false
        return
      }
      const day = this.listQuery.day
      const tdate = moment(day)
      getChatroomStatisticByDate({ 'day': tdate.format('YYYY-MM-DD') }).then(response => {
        this.list = response.data.data.list
        this.listLoading = false
      }).catch(() => {
        console.log('getUnfinished return error')
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
