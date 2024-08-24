<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="名称" prop="title" />
      <el-table-column align="center" min-width="300px" label="文章内容" prop="content" />
      <el-table-column align="center" label="使用" prop="enabled">
        <template slot-scope="scope">
          <el-tag>{{ stateDic[scope.row.enabled?1:0] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="图片" prop="image" />
      <el-table-column align="center" min-width="100px" label="创建时间" :formatter="dateFormat" prop="addTime" />
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-form-item label="名称" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item> 
        <el-form-item label="内容" prop="content" class="itemwidth">
          <vue-editor id="editor1" v-model="dataForm.content" class="itemwidth" />
        </el-form-item>

        <el-form-item label="状态" prop="enabled">
          <el-select v-model="dataForm.enabled" placeholder="请选择"><el-option v-for="(item, index) in stateDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
        <el-form-item label="背景色" prop="bgcolor">
          <el-color-picker v-model="dataForm.bgcolor" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadImage"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.image" :src="dataForm.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
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
  color: #8c939d;
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
import { listTips, createTip, updateTip } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import { VueEditor } from 'vue2-editor'
import moment from 'moment'

export default {
  name: 'TipOfTheDay',
  components: { Pagination ,VueEditor },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        title: undefined,
        subtitle: undefined,
        bgcolor: undefined,
        content: undefined,
        image: undefined,
        enabled: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      stateDic: ['不使用', '使用'],
      rules: {
        title: [{ required: true, message: 'title不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
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
    // this.getList()
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) { return '' }
      return moment(date).format('YYYY-MM-DD')
      // return moment(date).subtract(1, 'months').format("YYYY-MM-DD")
      // return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    getList() {
      this.listLoading = true
      listTips(this.listQuery).then(response => {
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
      this.dataForm = {
        id: undefined,
        name: undefined,
        content: undefined
      }
    },
    uploadImage: function(response) {
      this.dataForm.image = response.data.url
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
          createTip(this.dataForm).then(response => {
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
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTip(this.dataForm).then(() => {
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
    }
  }
}
</script>
