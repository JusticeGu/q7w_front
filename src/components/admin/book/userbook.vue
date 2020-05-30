<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <edit-form @onSubmit="loadBooks()" ref="edit"></edit-form>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="books"
        stripe
        style="width: 100%"
        :max-height="tableHeight">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item>
                <span>作品简介：{{ props.row.abs }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="作品名（展开查看摘要）"
          fit>
        </el-table-column>
        <el-table-column
          prop="category.name"
          label="分类"
          width="100">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          fit>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="提交日期"
          :formatter="dateFormatter"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="进度"
          :formatter="staFormatter"
          fit>
        </el-table-column>

        <el-table-column
          prop="isrejec"
          label="状态"
          :formatter="isreFormatter"
          fit>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>状态：{{ isreFormatter(scope.row)}}</p>
              <p >备注: {{ scope.row.suggestion }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag
                  :type="scope.row.isrejec === '0' ? 'success' : 'danger'"
                  disable-transitions>{{isreFormatter(scope.row)}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="abs"-->
        <!--label="摘要"-->
        <!--show-overflow-tooltip-->
        <!--fit>-->
        <!--</el-table-column>-->
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === '1'"
              @click.native.prevent="editBook(scope.row,false)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === '4'&&scope.row.enabled ===false"
              @click.native.prevent="editBook(scope.row,false)"
              type="text"
              size="small">
              发布
            </el-button>
            <el-button
              v-if="scope.row.enabled === true"
              @click.native.prevent="editBook(scope.row,false)"
              type="text"
              size="small">
              撤回
            </el-button>
            <el-button
              v-if="scope.row.status === '2'&&scope.row.status === '3'"
              @click.native.prevent="editBook(scope.row,true)"
              type="text"
              size="small">
              查看信息
            </el-button>
            <el-button
              @click.native.prevent="deleteBook(scope.row.id)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button>取消选择</el-button>
        <el-button>批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import EditForm from './EditForm'
  export default {
    name: 'userbook',
    components: {EditForm},
    data () {
      return {
        books: []
      }
    },
    mounted () {
      this.loadBooks()
    },
    computed: {
      tableHeight () {
        return window.innerHeight - 320
      }
    },
    methods: {
      deleteBook (id) {
        this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios
              .post('/admin/content/books/delete', {id: id}).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                this.loadBooks()
              }
            })
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      dateFormatter (row, column) {
        let datetime = row.updateTime;
        if(datetime){
          datetime = new Date(datetime);
          let y = datetime.getFullYear() + '-';
          let mon = datetime.getMonth()+1 + '-';
          let d = datetime.getDate();
          return y + mon + d;
        }
        return 'NULL'
      },
      editBook (item,status) {
        this.$refs.edit.dialogFormVisible = true
        this.$refs.edit.isnew = false
        this.$refs.edit.disabled = status
        this.$refs.edit.form = {
          id: item.id,
          cover: item.cover,
          title: item.title,
          author: item.author,
          date: item.date,
          press: item.press,
          abs: item.abs,
          status:item.status,
          isrejec:item.isrejec,
          enabled:item.enabled,
          context:item.context,
          suggestion:item.suggestion,

          category: {
            id: item.category.id.toString(),
            name: item.category.name
          }
        }
        // this.$refs.edit.category = {
        //   id: item.category.id.toString()
        // }
      },
      loadBooks () {
        var _this = this
        this.$axios.get('/book/userbook').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.books = resp.data.data
          }
        })
      },
      staFormatter (row, column) {
        let status = row.status
        switch (status) {
          case '1':
            return '待提交'
          case '2':
            return '已提交'
          case '3':
            return '审核中'
          case '4':
            return '审核通过,待发布'
          case '5':
            return '已发布'
          default:
            return '未知'
        }
      },
      isreFormatter (row, column) {
        let status = row.isrejec
        switch (status) {
          case '1':
            return '已退回'
          case '0':
            return '正常'
          default:
            return '未知'
        }
      },
    }
  }
</script>

<style scoped>
</style>
