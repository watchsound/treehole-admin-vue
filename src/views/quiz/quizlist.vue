<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
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

      <el-button v-permission="['GET /admin/quiz/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/quiz/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="标题" prop="title" />
      <el-table-column align="center" min-width="100px" label="图标Link" prop="iconLink" />
      <el-table-column align="center" min-width="100px" label="图片Link" prop="imageLink" />
      <el-table-column align="center" min-width="100px" label="标签" prop="tags" />
      <el-table-column align="center" min-width="100px" label="使用次数" prop="viewed" />

      <el-table-column align="center" label="状态" prop="deleted">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.deleted? 1:0] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="创建时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/quiz/manage']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/quiz/manage']" type="danger" size="mini" @click="showEditQuizGradeDialog(scope.row )">编辑评分标准</el-button>
          <el-button v-permission="['POST /admin/quiz/manage']" type="danger" size="mini" @click="showEditQuizProblemDialog(scope.row )">编辑测试题集</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改Quiz对话框 -->
    <el-dialog width="90%" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">

        <el-form-item label="标题" prop="title" class="itemwidth">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item label="内容" prop="introduction" class="itemwidth">
          <vue-editor id="editor1" v-model="dataForm.introduction" class="itemwidth" />
        </el-form-item>

        <el-form-item label="标签，（用，分开）" prop="tags" class="itemwidth">
          <el-input v-model="dataForm.tags" />
        </el-form-item>
        <el-form-item label="图标，128*128" prop="iconLink">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIcon"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.iconLink" :src="dataForm.iconLink" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图片，1200*300" prop="imageLink">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadImage"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.imageLink" :src="dataForm.imageLink" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="deleted">
          <el-select v-model="dataForm.deleted" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index==0?false:true" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改Quiz Grades对话框 -->
    <el-dialog width="100%" :close-on-click-modal="false" :title="测试的评分" :visible.sync="gradeDialogFormVisible">
      <el-table v-loading="listLoading" :data="curQuiz.grades" element-loading-text="正在查询中。。。" border style="width: 100%" highlight-current-row>
        <el-table-column align="center" width="50px" label="ID" prop="id" sortable />
        <el-table-column align="center" min-width="50px" label="得分下限" prop="scoreLow">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="sel['scoreLow']" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['scoreLow'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="50px" label="得分上限" prop="scoreHigh">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="sel['scoreHigh']" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['scoreHigh'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150px" label="标题" prop="title">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="sel['title']" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['title'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="350px" label="内容" prop="feedback">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <vue-editor id="editor2" v-model="sel['feedback']" class="itemwidth" />
              <!-- <el-input v-model="sel['feedback']" type="textarea" :rows="10" placeholder="请输入" /> -->
            </span>
            <span v-else>{{ scope.row['feedback'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="gradeChange(scope.row,scope.$index,true)">
              {{ scope.row.isSet?'保存':"修改" }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addNewGrade()">添加评分区间</el-button>
        <el-button @click="gradeDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改Quiz Problem对话框 -->
    <el-dialog width="100%" :close-on-click-modal="false" :title="测试的问题集" :visible.sync="problemDialogFormVisible">
      <el-table v-loading="listLoading" :data="curQuiz.problems" element-loading-text="正在查询中。。。" border style="width: 100%" highlight-current-row>
        <el-table-column align="center" width="50px" label="ID" prop="id" sortable />
        <el-table-column align="center" width="50px" label="Quiz-ID" prop="quizId" />
        <el-table-column align="center" min-width="50px" label="顺序" prop="orderInQuiz">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="qsel['orderInQuiz']" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['orderInQuiz'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="问题" prop="questionBody">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="qsel['questionBody']" type="textarea" :rows="10" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['questionBody'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="选择A" prop="option1">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="qsel['option1']" type="textarea" :rows="10" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['option1'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="选择B" prop="option2">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="qsel['option2']" type="textarea" :rows="10" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['option2'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="选择C" prop="option3">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="qsel['option3']" type="textarea" :rows="10" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['option3'] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="选择D" prop="option4">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-input v-model="qsel['option4']" type="textarea" :rows="10" size="mini" placeholder="请输入" />
            </span>
            <span v-else>{{ scope.row['option4'] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="50px" label="答案" prop="answer">
          <template slot-scope="scope">
            <span v-if="scope.row.isSet">
              <el-select v-model="qsel['answer']" placeholder="请选择"><el-option v-for="(item, index) in answerDic" :key="index" :label="item" :value="mapLabelToAnswer(item)" /></el-select>
            </span>
            <span v-else>{{ mapAnswerToLabel(scope.row['answer']) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="problemChange(scope.row,scope.$index,true)">
              {{ scope.row.isSet?'保存':"修改" }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addNewProblem()">添加测试题</el-button>
        <el-button @click="problemDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
#editor1 {
  height: 450px;
}
#editor2 {
  height: 350px;
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

import { listQuiz, getQuizDetail, createQuiz, updateQuiz, editQuizGrade, editQuizProblem } from '@/api/quiz'
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
      curQuiz: {
        id: undefined,
        grades: [],
        problems: []
      },
      sel: undefined,
      qsel: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        start: undefined,
        end: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        title: undefined,
        introduction: undefined,
        iconLink: undefined,
        imageLink: undefined,
        viewed: 0,
        deleted: 0,
        tags: undefined
      },
      statusDic: ['使用', '删除'],
      answerDic: ['A', 'B', 'C', 'D'],
      dialogFormVisible: false,
      gradeDialogFormVisible: false,
      problemDialogFormVisible: false,
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
    mapAnswerToLabel(answer) {
      if (answer === 2) { return 'B' }
      if (answer === 4) { return 'C' }
      if (answer === 8) { return 'D' }
      return 'A'
    },
    mapLabelToAnswer(label) {
      if (label === 'B') { return 2 }
      if (label === 'C') { return 4 }
      if (label === 'D') { return 8 }
      return 1
    },
    getList() {
      this.listLoading = true
      listQuiz(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getArticleDetail(quizId, callback) {
      if (this.curQuiz && this.curQuiz.id === quizId) {
        if (callback) {
          callback()
          return
        }
      }
      getQuizDetail({ quizId: quizId }).then(response => {
        response.data.data.grades.map(i => {
          i.isSet = false// 给后台返回数据添加`isSet`标识
          return i
        })
        response.data.data.problems.map(i => {
          i.isSet = false// 给后台返回数据添加`isSet`标识
          return i
        })
        this.curQuiz = response.data.data
        this.dataForm.introduction = response.data.data.introduction
        if (callback) {
          callback()
        }
      }).catch(() => {
        this.dataForm.introduction = ''
        this.curQuiz = {
          id: undefined,
          grades: [],
          problems: []
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined
      }
    },
    resetCurQuiz() {
      this.curQuiz = {
        id: undefined,
        grades: [],
        problems: []
      }
    },
    uploadIcon: function(response) {
      this.dataForm.iconLink = response.data.url
    },
    uploadImage: function(response) {
      this.dataForm.imageLink = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.resetCurQuiz()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createQuiz(this.dataForm).then(response => {
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
          updateQuiz(this.dataForm).then(() => {
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
    updateGradeData(grade) {
      editQuizGrade(grade).then(() => {
        for (const v of this.curQuiz.grades) {
          if (v.id === grade.id) {
            const index = this.curQuiz.grades.indexOf(v)
            this.curQuiz.grades.splice(index, 1, grade)
            break
          }
        }
        this.gradeDialogFormVisible = false
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
    },
    gradeChange(row, index, cg) {
      // 点击修改 判断是否已经保存所有操作
      const that = this
      for (const i of that.curQuiz.grades) {
        if (i.isSet && i.id !== row.id) {
          that.$notify.error({
            title: '失败',
            message: '请先保存当前编辑项'
          })
          return false
        }
      }
      // 是否是取消操作
      if (!cg) {
        // return row.isSet = !row.isSet
        row.isSet = !row.isSet
        return row.isSet
      }
      // 提交数据
      if (row.isSet) {
        // 项目是模拟请求操作  自己修改下
        (function() {
          const data = JSON.parse(JSON.stringify(that.sel))
          that.updateGradeData(data)
          row.isSet = false
        })()
      } else {
        that.sel = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
    },
    addNewGrade() {
      if (!this.curQuiz) { return }
      for (const i of this.curQuiz.grades) {
        if (i.isSet) {
          this.$notify.error({
            title: ' ',
            message: '请先保存'
          })
          return
        }
      }
      const j = { id: 0, quizId: this.curQuiz.id, scoreLow: 0, scoreHigh: 0, title: '', introduction: '' }
      this.curQuiz.grades.push(j)
      this.sel = JSON.parse(JSON.stringify(j))
    },
    showEditQuizGradeDialog(row) {
      this.getArticleDetail(row.id)
      this.gradeDialogFormVisible = true
    },
    //
    updateProblemData(problem) {
      editQuizProblem(problem).then(() => {
        for (const v of this.curQuiz.problems) {
          if (v.id === problem.id) {
            const index = this.curQuiz.problems.indexOf(v)
            this.curQuiz.problems.splice(index, 1, problem)
            break
          }
        }
        this.problemDialogFormVisible = false
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
    },
    problemChange(row, index, cg) {
      // 点击修改 判断是否已经保存所有操作
      const that = this
      for (const i of that.curQuiz.problems) {
        if (i.isSet && i.id !== row.id) {
          that.$notify.error({
            title: '失败',
            message: '请先保存当前编辑项'
          })
          return false
        }
      }
      // 是否是取消操作
      if (!cg) {
        // return row.isSet = !row.isSet
        row.isSet = !row.isSet
        return row.isSet
      }
      // 提交数据
      if (row.isSet) {
        // 项目是模拟请求操作  自己修改下
        (function() {
          const data = JSON.parse(JSON.stringify(that.qsel))
          that.updateProblemData(data)
          row.isSet = false
        })()
      } else {
        that.qsel = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
    },
    addNewProblem() {
      if (!this.curQuiz) { return }
      for (const i of this.curQuiz.problems) {
        if (i.isSet) {
          this.$notify.error({
            title: ' ',
            message: '请先保存'
          })
          return
        }
      }
      const j = { id: 0, quizId: this.curQuiz.id, orderInQuiz: 0, problemType: 0,
        questionBody: '', option1: '', option2: '', option3: '', option4: '', answer: 1, delated: 0 }
      this.curQuiz.problems.push(j)
      this.qsel = JSON.parse(JSON.stringify(j))
    },
    showEditQuizProblemDialog(row) {
      this.getArticleDetail(row.id)
      this.problemDialogFormVisible = true
    }

  }
}
</script>
