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
      <el-button v-permission="['GET /admin/article/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
       <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />

      <el-table-column align="center" min-width="100px" label="用户ID" prop="userId" /> 
      <el-table-column align="center" min-width="100px" label="笔名" prop="penname" />
      <el-table-column align="center" min-width="300px" label="标题" prop="title" />  
      <el-table-column align="center" label="类别" prop="category">
        <template slot-scope="scope">
          <el-tag>{{ categoryDic[scope.row.category] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="创建时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/article/manage']" type="primary" size="mini" @click="handleStateUpdate(scope.row)">修改状态</el-button>
       </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="stateDialogFormVisible">
      <el-form ref="dataStateForm" :rules="rules" :model="dataStateForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="内容" prop="uploadText">
            <el-input v-model="dataStateForm.uploadText" type="textarea" :rows="20" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dataStateForm.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="stateDialogFormVisible = false">取消</el-button>
         <el-button type="primary" @click="updateState">确定</el-button>
      </div>
    </el-dialog>
 

  </div>
</template>

<script>
import { listRawArticle, updateRawArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RawArticle',
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
        status: 0,
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataStateForm: {
        id: undefined,
        status: '',
        uploadText: undefined
      },
      statusDic: ['提交', '接受', '拒稿', '发表'],
      categoryDic: ['家庭', '工作', '学业', '情感', '其他'],
      stateDialogFormVisible: false,
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
    //this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listRawArticle(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataStateForm = {
        id: undefined,
        status: '',
        uploadText: undefined
      }
    }, 
    handleStateUpdate(row) {
      this.dataStateForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.stateDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataStateForm'].clearValidate()
      })
    },
    updateState() {
      this.$refs['dataStateForm'].validate((valid) => {
        if (valid) {
         // this.dataStateForm.uploadText = null
          updateRawArticle(this.dataStateForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataStateForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataStateForm)
                break
              }
            }
            this.stateDialogFormVisible = false
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
    
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户ID', '笔名','文章标题','审批状态','创建时间']
        const filterVal = ['id', 'userId', 'penname', 'title', 'status', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '投稿情况')
        this.downloadLoading = false
      })
    }
  }
}
</script>
