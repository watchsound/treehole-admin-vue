<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.rawArticleId" clearable class="filter-item" style="width: 200px;" placeholder="请投稿ID" />
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
      <el-button v-permission="['POST /admin/article/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>

      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="提交稿件ID" prop="rawArticleId" />
      <el-table-column align="center" min-width="100px" label="笔名" prop="penname" />
      <el-table-column align="center" min-width="100px" label="审稿人ID" prop="adminId" />
      <el-table-column align="center" label="类别" prop="category">
        <template slot-scope="scope">
          <el-tag>{{ categoryDic[scope.row.category] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="200px" label="标题" prop="title" />
      <el-table-column align="center" min-width="200px" label="付标题" prop="subtitle" />
      <el-table-column align="center" min-width="100px" label="图标" prop="thumbView" />
      <el-table-column align="center" min-width="400px" label="阅读人数" prop="numViewed" />
      <el-table-column align="center" min-width="200px" label="收藏人数" prop="numCollected" />

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="400px" label="创建时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/article/manage']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/article/manage']" type="danger" size="mini" @click="handleStatusChange(scope.row, 1)">发表</el-button>
          <el-button v-permission="['POST /admin/article/manage']" type="danger" size="mini" @click="handleStatusChange(scope.row, 2)">撤稿</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" width="90%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-form-item label="类别" prop="category">
          <el-select v-model="dataForm.category" placeholder="请选择"><el-option v-for="(item, index) in categoryDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title" class="itemwidth">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item label="付标题" prop="subtitle" class="itemwidth">
          <el-input v-model="dataForm.subtitle" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary" class="itemwidth">
          <el-input v-model="dataForm.summary" />
        </el-form-item>
        <el-form-item label="笔名" prop="penname">
          <el-input v-model="dataForm.penname" />
        </el-form-item>
        <el-form-item label="图片" prop="thumbView">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadImage"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.thumbView" :src="dataForm.thumbView" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
        <el-form-item label="内容" prop="textBody" class="itemwidth">
          <vue-editor id="editor1" v-model="dataForm.textBody" class="itemwidth" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
#editor1 {
  height: 450px;
}
.itemwidth {
  width: 650px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #4a37b3;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>

import { listArticle, getArticleById, createArticle, updateArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { VueEditor } from 'vue2-editor'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'

export default {
  name: 'Article',
  components: { Pagination, VueEditor },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        rawArticleId: undefined,
        status: '',
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        userId: undefined,
        adminId: undefined,
        category: 0,
        status: 0,
        title: '',
        subtitle: '',
        summary: '',
        textBody: undefined,
        thumbView: undefined,
        penname: undefined,
        numViewed: 0,
        numCollected: 0
      },
      statusDic: ['草稿', '发布', '撤稿'],
      categoryDic: ['家庭', '工作', '学业', '情感', '其他'],
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
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      listArticle(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getArticleDetail(articleId) {
      getArticleById({ articleId: articleId }).then(response => {
        this.dataForm.textBody = response.data.data.textBody
      }).catch(() => {
        this.dataForm.textBody = ''
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        status: ''
      }
    },
    uploadImage: function(response) {
      this.dataForm.thumbView = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.dataForm).then(response => {
            this.list.unshift(response.data.data)
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '创建成功'
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
          updateArticle(this.dataForm).then(() => {
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
    handleStatusChange(row, state) {
      updateArticle({ id: row.id, status: state }).then(response => {
        this.$notify.success({
          title: '成功',
          message: '修改成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户ID', '笔名', '审稿人ID', '分类', '标题', '付标题', '摘要', '状态', '阅读人数', '收藏人数', '创建时间']
        const filterVal = ['id', 'userId', 'penname', 'adminId', 'category', 'title', 'subtitle', 'summary', 'status', 'numViewed', 'numCollected', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '文章列表信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
