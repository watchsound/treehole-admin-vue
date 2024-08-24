<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="用户微信名" />
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="用户手机号" />
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
      <el-button v-permission="['GET /admin/anchor/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="用户Id" prop="userId" />
      <el-table-column align="center" min-width="100px" label="微信名" prop="username" />

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag>{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="学历" prop="education">
        <template slot-scope="scope">
          <el-tag>{{ educationDic[scope.row.education] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="专业" prop="major">
        <template slot-scope="scope">
          <el-tag>{{ majorDic[scope.row.major] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="有无证书" prop="certificate">
        <template slot-scope="scope">
          <el-tag>{{ certificateDic[scope.row.certificate] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="学校" prop="school" />
      <el-table-column align="center" min-width="100px" label="手机" prop="mobile" />
      <el-table-column align="center" label="身份证正面" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/anchor/manage']" type="primary" size="mini" @click="showImage(scope.row.imagelink1)">图片</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证反面" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/anchor/manage']" type="primary" size="mini" @click="showImage(scope.row.imagelink2)">图片</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="毕业证书/学生证" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/anchor/manage']" type="primary" size="mini" @click="showImage(scope.row.imagelink3)">图片</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="资格证书" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/anchor/manage']" type="primary" size="mini" @click="showImage(scope.row.imagelink4)">图片</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="微信OpenID" prop="weixinOpenid" />
      <el-table-column align="center" min-width="100px" label="测试分数" prop="quizScore" />
      <el-table-column align="center" min-width="100px" label="测试时间" prop="quizTime" />
      <el-table-column align="center" label="审批状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="创建时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/anchor/manage']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" width="90%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" size="medium" width="90%" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="id" class="itemwidth">
          <el-input v-model="dataForm.id" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- image popup -->
    <el-dialog :close-on-click-modal="false" width="90%" :title="图片" :visible.sync="imageDialogFormVisible">
      <el-form ref="dataForm" size="medium" width="90%" :model="imageForm" style="width: 100%;">
        <el-form-item label="图片">
          <img v-if="imageForm.imageurl" :src="imageForm.imageurl" class="avatar">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="imageDialogFormVisible = false">取消</el-button>
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

import { listAnchorApplicant, updateAnchorApplicantStatus } from '@/api/anchor'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'

export default {
  name: 'AnchorApplicant',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        mobile: undefined,
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      imageForm: {
        imageurl: undefined
      },
      dataForm: {
        id: undefined,
        userId: undefined,
        gender: 0,
        education: 0,
        major: 0,
        certificate: 0,
        school: '',
        mobile: '',
        imaeglink1: undefined,
        imaeglink2: undefined,
        imaeglink3: undefined,
        imaeglink4: undefined,
        quizScore: undefined,
        quizTime: undefined,
        status: 0,
        addTime: undefined,
        updateTime: undefined
      },
      statusDic: ['材料收集', '材料不合', '材料不足', '在线培训', '考核通过', '考核未通过', '签约成功', '拒签'],
      genderDic: ['未知', '男生', '女生'],
      educationDic: ['在校本科生', '本科生', '在读研究生', '硕士', '在读博士生', '博士'],
      majorDic: ['心理学', '社会科学', '理工科', '其他'],
      certificateDic: ['无', '有心理职业证书'],
      dialogFormVisible: false,
      imageDialogFormVisible: false,
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
    // this.getList()
  },

  methods: {
    getList() {
      if (!this.listQuery.start || !this.listQuery.end) { return }
      this.listLoading = true
      listAnchorApplicant(this.listQuery).then(response => {
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
        status: ''
      }
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showImage(imageUrl) {
      this.imageForm = {
        imageurl: imageUrl
      }
      this.imaegDialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateAnchorApplicantStatus({ id: this.dataForm.id, status: this.dataForm.status }).then(() => {
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
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户ID', '微信名', '性别', '学历', '专业', '证书', '学校',
          '手机', '测评分数', '测评时间', '状态', '创建时间']
        const filterVal = ['id', 'userId', 'username', 'gender', 'education', 'major', 'certificate',
          'school', 'mobile', 'quizScore', 'quizTime', 'status', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '主持人申请列表信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
