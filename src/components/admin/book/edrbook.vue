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
          :formatter="dateFormatter"
          label="提交日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="目前状态"
          :formatter="staFormatter"
          fit>
          <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              effect="dark"
              :type="scope.row.status === '2' ? 'danger' : ''"
              disable-transitions>{{staFormatter(scope.row)}}</el-tag>
          </div>
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
              v-if="scope.row.status == '3'"
              @click.native.prevent="editBook_1(scope.row,true)"
              type="text"
              size="small">
              继续审核
            </el-button>
            <el-button
              v-else
              @click.native.prevent="editBook(scope.row,true)"
              type="text"
              size="small">
              开始审核
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
  import EditForm from './ShEditForm'
  export default {
    name: 'edrbook',
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
          category: {
            id: item.category.id.toString(),
            name: item.category.name
          }
        };
        this.$axios
          .put('admin/content/vering', {id: item.id}).then(resp => {
          if (resp && resp.data.rspCode === '200') {
            this.$alert("您已经进入审核流程，请在指定时间内审核完毕",resp.data.rspMsg, {
              confirmButtonText: '确定'
            })
          }
        })
        // this.$refs.edit.category = {
        //   id: item.category.id.toString()
        // }
      },editBook_1 (item,status) {
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
          category: {
            id: item.category.id.toString(),
            name: item.category.name
          }
        };
        // this.$refs.edit.category = {
        //   id: item.category.id.toString()
        // }
      },
      loadBooks () {
        var _this = this
        this.$axios.get('/book/edrshbook').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.books = resp.data.data
          }
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
      },staFormatter (row, column) {
        let status = row.status
        switch (status) {
          case '1':
            return '待提交'
          case '2':
            return '待审核'
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
