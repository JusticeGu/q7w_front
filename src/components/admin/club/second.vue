<template>
  <div>
    <el-dialog
      title="二面成绩审核"

      :visible.sync="dialogFormVisible">
      <el-form
        element-loading-text="请稍后..."
        v-model="selectedUser" style="text-align: left" ref="dataForm">
        <el-row :gutter="20">
          <el-col :span="16"><el-form-item label="姓名: " label-width="120px" prop="username">
            <label>{{selectedUser.username}} </label>
            <td>第一志愿：{{bmFormatter_1(selectedUser.bm1)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二志愿：{{bmFormatter_1(selectedUser.bm2)}}</td>
          </el-form-item></el-col>
          <el-col :span="8"><el-image :src="selectedUser.searchurl+'!rootimg'"
                                      :preview-src-list="[selectedUser.searchurl+'!rootbigimg',selectedUser.photo]+'!rootbigimg'">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div></el-image>
          </el-col>
        </el-row>
        <el-form-item label="手机号" label-width="120px" prop="phone" >
          <label>{{selectedUser.phone}} </label>
        </el-form-item>
        <el-form-item label="邮箱：" label-width="120px" prop="email">
          <label>{{selectedUser.email}} </label>
        </el-form-item>
        <el-form-item label="学院：" label-width="120px" prop="xy">
          <label>{{selectedUser.xy}} </label>
        </el-form-item>
        <el-form-item label="兴趣爱好：" label-width="120px" prop="hobbies">
          <label>{{selectedUser.hobbies}} </label>
        </el-form-item>
        <el-form-item label="一面成绩：" label-width="120px" prop="firsscore">
          <label>{{selectedUser.score1}} </label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; By：{{selectedUser.score1_by}}
        </el-form-item>
        <el-form-item label="一面意见：" label-width="120px" prop="fisugs">
          <label>{{selectedUser.fstsug}} </label>
          <td>注册时间：{{dateFormatter_1(selectedUser.createTime)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{dateFormatter_1(selectedUser.updateTime)}}</td>
        </el-form-item>
        <el-form-item label="二面建议：" label-width="120px" prop="field106">
          <el-input v-model="selectedUser.setsug" placeholder="请输入二面建议" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-row gutter="15">
          <el-col :span="8">
            <el-form-item label="二面成绩1" label-width="120px" prop="score2_1">
              <el-input v-model="selectedUser.score2_1" placeholder="请输入二面成绩" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二面成绩2" label-width="120px" prop="score2_2">
              <el-input v-model="selectedUser.score2_2" placeholder="成绩" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二面成绩3" label-width="120px" prop="score2_3">
              <el-input v-model="selectedUser.score2_3" placeholder="请输入二面成绩" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="success" plain @click="onSubmit(selectedUser)">成绩提交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>招新管理</el-breadcrumb-item>
        <el-breadcrumb-item>二面审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" >
        <el-form-item>
          <template>
            <el-select v-model="mstype" placeholder="处理部门">
              <el-option v-for="item in bmData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUser">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <bulk-registration @onSubmit="listUsers()"></bulk-registration>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="users"
        v-loading="loading"
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
    name: 'second',

    data () {
      return {
        users: [],
        fileList: [],
        mstype:1,
        roles: [],
        status: '0',
        loading: true,
        dialogFormVisible: false,
        selectedUser: [],
        selectedRolesIds: []
      }
    },
    mounted () {
      this.typeInfo(); //分类初始化
      this.loading = true
      this.listUsers()
    },
    computed: {
      tableHeight () {
        return window.innerHeight - 320
      }
    },
    methods: {
      listUsers () {
        var _this = this
        this.$axios.get('/club/api/listbysh?status=2&bm=1').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.users = resp.data.data
            _this.loading = false
          }
        })
      }, getUser() {
        this.userInfo();
      },
      userInfo() {
        var _this = this
        this.$axios.get('/club/api/listbysh?status=2&bm='+this.mstype).then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.users = resp.data.data
            _this.loading = false
          }else {
            this.$alert(resp.data.rspMsg+"：未获取到用户信息（该用户未通过一面或无此部门面试）", '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      typeInfo() {
        this.bmData = [
          {value: 1, label:'主播部'},
          {value: 2, label: '导播部'},
          {value: 3, label: '编辑部'},
          {value: 4, label: '行政部'},
          {value: 5, label: '英播'}];
      },
      onSubmit (user) {
        this.$axios.put('/club/update_2', {
          username: user.username,
          name: user.name,
          phone: user.phone,
          email: user.email,
          score2_1: user.score2_1,
          score2_2: user.score2_2,
          score2_3: user.score2_3,
          status: '3',
          setsug:user.setsug,

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
      },  dateFormatter_1 (row, column) {
        let datetime = row;
        if(datetime){
          datetime = new Date(datetime);
          let y = datetime.getFullYear() + '-';
          let mon = datetime.getMonth()+1 + '-';
          let d = datetime.getDate()+ ' ';
          let h = datetime.getHours()+':';
          let m = datetime.getMinutes()+':'
          let s = datetime.getSeconds()
          return y + mon + d + h + m + s;
        }
        return 'NULL'
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
     }
  }
</script>

<style scoped>

</style>
