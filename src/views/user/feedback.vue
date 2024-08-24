<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID" />
      <el-select v-model="listQuery.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
      <span class="demonstration">选择开始时间</span>
      <el-date-picker
        v-model="listQuery.start"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        placeholder="选择日期"
      />
      <span class="demonstration">选择结束时间</span>
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

      <el-table-column align="center" label="反馈ID" prop="id" />
      <el-table-column align="center" label="用户ID" prop="userId" />
      <el-table-column align="center" label="问题类别" prop="feedType">
        <template slot-scope="scope">
          <el-tag>{{ categoryDic[scope.row.feedType] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈内容" prop="content" />
      <el-table-column align="center" label="时间" prop="addTime" />
      <el-table-column align="center" label="回复内容" prop="reply" />
      <el-table-column align="center" label="时间" prop="replyTime" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog width="90%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" size="medium" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-form-item label="类别" prop="feedType">
          <el-select v-model="dataForm.feedType" placeholder="请选择"><el-option v-for="(item, index) in categoryDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
        <el-form-item label="反馈" prop="content">
          <el-input v-model="dataForm.content" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="回复" prop="reply">
          <el-input v-model="dataForm.reply" type="textarea" :rows="10" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { listFeedback, updateFeedback } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Feedback',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        status: undefined,
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        userId: undefined,
        adminId: undefined,
        feedType: undefined,
        content: undefined,
        reply: undefined,
        addTime: 0,
        status: 0
      },
      statusDic: ['未回复', '已经回复'],
      categoryDic: ['账号', '主持人投诉', '禁言投诉', '服务建议', '其他'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
      },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listFeedback(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.getArticleDetail(row.id)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateFeedback(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        reply: ''
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['反馈ID', '用户ID', '反馈类型', '反馈内容', '反馈时间', '回复内容', '回复时间']
        const filterVal = ['id', 'userId', 'feedType', 'content', 'addTime', 'reply', 'replyTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '意见反馈信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
