<template>
  <div>
    <el-dialog
      title="一面成绩审核"

      :visible.sync="dialogFormVisible">
      <el-form
        v-loading="loading"
        element-loading-text="请稍后..."
        v-model="selectedUser" style="text-align: left" ref="dataForm">
        <el-form-item label="姓名: " label-width="120px" prop="username">
          <label>{{selectedUser.username}} </label>
          <td>第一志愿：{{bmFormatter_1(selectedUser.bm1)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二志愿：{{bmFormatter_1(selectedUser.bm2)}}</td>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="phone">

          <el-input v-model="selectedUser.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="selectedUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院" label-width="120px" prop="xy">
          <el-input v-model="selectedUser.xy" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="一面成绩" label-width="120px" prop="name">
          <label>{{selectedUser.score1}} </label>
          By：{{selectedUser.score1_by}}
        </el-form-item>
        <el-form-item label="一面成绩" label-width="120px" prop="ym">
          <el-rate
            v-model="selectedUser.score1"
            :colors="colors"
            allow-half
            show-score
            :max="10">
          </el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="success" plain @click="onSubmit(selectedUser)">一面通过</el-button>
        <el-button  type="danger" plain @click="onSubmit_re(selectedUser)">驳回申请</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>

      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>招新管理</el-breadcrumb-item>
        <el-breadcrumb-item>一面审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <bulk-registration @onSubmit="listUsers()"></bulk-registration>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="users"
        stripe
        :default-sort = "{prop: 'id', order: 'ascending'}"
        style="width: 100%"
        :max-height="tableHeight">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="nid"
          label="报名ID"
          sortable
          width="100">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          fit>
        </el-table-column>

        <el-table-column
          prop="phone"
          label="手机号"
          fit>
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip
          fit>
        </el-table-column>
        <el-table-column
          prop="xy"
          label="学院"
          fit>
        </el-table-column>
        <el-table-column
          prop="bm"
          :formatter="bmFormatter"
          label="处理部门"
          fit>
        </el-table-column>
        <el-table-column
          prop="status"
          :formatter="statusFormatter"
          label="状态"
          fit>
        </el-table-column>

        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click="editUser(scope.row)"
              type="text"
              size="small">
              开始审核
            </el-button>
            <el-button
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

  export default {
    name: 'dbfirst',

    data () {
      return {
        users: [],
        roles: [],
        status: '0',
        loading: false,
        dialogFormVisible: false,
        selectedUser: [],
        selectedRolesIds: []
      }
    },
    mounted () {
      this.loading = true
      this.listUsers()
      this.listRoles()
    },
    computed: {
      tableHeight () {
        return window.innerHeight - 320
      }
    },
    methods: {
      listUsers () {
        var _this = this
        this.$axios.get('/club/api/listbysh?status=1&bm=2').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.users = resp.data.data
            _this.loading = false
          }
        })
      },
      listRoles () {
        var _this = this
        this.$axios.get('/admin/role').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.roles = resp.data.data
          }
        })
      },
      commitStatusChange (value, user) {
        if (user.username !== 'admin') {
          this.$axios.put('/admin/user/status', {
            enabled: value,
            username: user.username
          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              if (value) {
                this.$message('用户 [' + user.username + '] 已启用')
              } else {
                this.$message('用户 [' + user.username + '] 已禁用')
              }
            }
          })
        } else {
          user.enabled = true
          this.$alert('不能禁用管理员账户')
        }
      },
      onSubmit (user) {
        this.$axios.put('/club/update_1g', {
          username: user.username,
          name: user.name,
          phone: user.phone,
          email: user.email,
          score1: user.score1,
          score2_1: user.score2_1,
          score2_2: user.score2_2,
          score2_3: user.score2_3,
          status: '2'

        }).then(resp => {
          if (resp && resp.data.rspCode === '200') {
            this.$alert('审核完成')
            this.dialogFormVisible = false
            // 修改角色后重新请求用户信息，实现视图更新
            this.listUsers()
          }
        })
      },
      onSubmit_re (user) {
        this.$axios.put('/club/update_1g', {
          username: user.username,
          name: user.name,
          phone: user.phone,
          email: user.email,
          score1: user.score1,
          score2_1: user.score2_1,
          score2_2: user.score2_2,
          score2_3: user.score2_3,
          status: '-1'

        }).then(resp => {
          if (resp && resp.data.rspCode === '200') {
            this.$alert('审核完成')
            this.dialogFormVisible = false
            // 修改角色后重新请求用户信息，实现视图更新
            this.listUsers()
          }
        })
      },
      editUser (user) {
        this.dialogFormVisible = true
        this.selectedUser = user
      },
      bmFormatter (row, column) {
        let status = row.bm
        switch (status) {
          case '1':
            return '主播部'
          case '2':
            return '导播部'
          case '3':
            return '编辑部'
          case '4':
            return '行政部'
          case '5':
            return '主播部（英播）'
          default:
            return '未知'
        }
      },
      bmFormatter_1 (row, column) {
        let status = row
        switch (status) {
          case '1':
            return '主播部'
          case '2':
            return '导播部'
          case '3':
            return '编辑部'
          case '4':
            return '行政部'
          case '5':
            return '主播部（英播）'
          default:
            return '未知'
        }
      },
      statusFormatter (row, column) {
        let status = row.status
        switch (status) {
          case '3':
            return '待审核'
          case '1':
            return '待一面'
          case '2':
            return '待二面'
          default:
            return '未知'
        }
      },
      resetPassword (username) {
        this.$axios.put('/admin/user/password', {
          username: username
        }).then(resp => {
          if (resp && resp.data.rspCode === '200') {
            this.$alert('密码已重置为 123')
          }
        })
      }}
  }
</script>

<style scoped>

</style>
