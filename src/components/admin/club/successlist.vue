<template>
  <div>
    <el-dialog
      title="详细信息"
      :visible.sync="dialogFormVisible"
      :center="true">
      <el-form v-model="selectedUser" style="text-align: left" ref="dataForm">
        <el-row :gutter="20">
          <el-col :span="16"><el-form-item label="姓名: " label-width="120px" prop="username">
            <label>{{selectedUser.username}} </label>
            <td>第一志愿：{{bmFormatter_1(selectedUser.bm1)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二志愿：{{bmFormatter_1(selectedUser.bm2)}}</td>
          </el-form-item></el-col>
          <el-col :span="8"><el-image :src="selectedUser.photo+'!rootimg'"
                                      :preview-src-list="[selectedUser.photo+'!rootbigimg',selectedUser.searchurl+'!rootbigimg']">
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
        <el-form-item label="面试意见：" label-width="120px" prop="fisugs">
          <label>{{selectedUser.fstsug}} </label>
        </el-form-item>
        <el-row gutter="15">
          <el-col :span="8">
            <el-form-item label="二面成绩1" label-width="120px" prop="score2_1">
              <label>{{selectedUser.score2_1}} </label>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二面成绩2" label-width="120px" prop="score2_2">
              <label>{{selectedUser.score2_2}} </label>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二面成绩3"  label-width="120px" prop="score2_3">
              <label>{{selectedUser.score2_2}} </label>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分组意见：" label-width="120px" prop="fisugs">
          <label>{{selectedUser.setsug}} </label> ---By：{{selectedUser.score2_1_by}}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="selectedUser.status == '7'"  @click="onSubmit(selectedUser)" type="success" plain>帮助确认收到</el-button>
      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>社团招新</el-breadcrumb-item>
        <el-breadcrumb-item>招新</el-breadcrumb-item>
        <el-breadcrumb-item>招新列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-col :span="24" class="warp-breadcrum">
      <!--搜索栏-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" >
          <el-form-item>
            <template>
              <el-select v-model="mstype" placeholder="选择部门">
                <el-option v-for="item in bmData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item>
            <template>
              <el-select v-model="statustupe" placeholder="选择状态">
                <el-option v-for="item in stautusData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUser">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
    <bulk-registration @onSubmit="listUsers()"></bulk-registration>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="users"
        v-loading="loading"
        stripe
        :default-sort = "{prop: 'score2_1', order: 'ascending'}"
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
          width="60">
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
          prop="xy"
          sortable
          label="学院"
          fit>
        </el-table-column>
        <el-table-column
          prop="score1"
          label="一面成绩"
          sortable
          fit>
        </el-table-column>
        <el-table-column
          prop="score2_1"
          label="二面成绩1"
          sortable
          show-overflow-tooltip
          fit>
        </el-table-column>
        <el-table-column
          prop="score2_2"
          sortable
          label="二面成绩2"
          show-overflow-tooltip
          fit>
        </el-table-column>
        <el-table-column
          prop="score2_3"
          label="二面成绩3"
          sortable
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
          prop="secsum"
          sortable
          label="二面总分"
          fit>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">

            <el-button
              @click="editUser(scope.row)"
              type="text"
              size="mini">
              详细
            </el-button>
            <el-button
              @click="getcachetime(scope.row.username,scope.row.phone)"
              type="info"
              size="mini" plain round>
              缓存时间
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
        name: 'successlist',

      data () {
        return {
          users: [],
          mstype:1,
          statustupe:7,
          roles: [],
          loading: true,
          dialogFormVisible: false,
          selectedUser: [],
          selectedRolesIds: []
        }
      },
      mounted () {
        this.typeInfo(); //分类初始化
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
          this.$axios.get('/club/api/listbysh?status='+this.statustupe+'&bm='+this.mstype).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              _this.users = resp.data.data
              _this.loading = false
            }
          })
        },getUser() {
          this.userInfo();
        },
        userInfo() {
          var _this = this
          this.$axios.get('/club/api/listbysh?status='+this.statustupe+'&bm='+this.mstype).then(resp => {
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
          this.stautusData = [
            {value: 7, label:'录取待确认'},
            {value: 8, label: '已确认'},
            {value: -2, label: '已驳回'}];
        },
        onSubmit (user) {
          this.$axios.post('/club/api/nusrconfirm', {
            username: user.username,
            status:'8',
            phone:user.phone,
          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              this.$alert('确认成功')
              this.dialogFormVisible = false
              // 修改角色后重新请求用户信息，实现视图更新
              this.listUsers()
            }else {
              this.$alert("确认失败："+resp.data.data)
            }
          })
        },
        getcachetime(username,phone){
          var _this = this
          this.$axios.get('club/api/getcachetime?username='+username+'&phone='+phone,{
          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              this.$message.info(username+" 的数据将会在 "+resp.data.data+" 秒后更新");
            }else {
              this.$message.info("异常信息："+resp.data.data);
            }
          })},
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
              return '二面已提交'
            case '1':
              return '待一面'
            case '2':
              return '待二面'
            case '4':
              return '待三面'
            case '5':
              return '三面审核中'
            case '6':
              return '待排组'
            case '7':
              return '待确认'
            case '8':
              return '已确认'
            default:
              return '未录取'
          }
        },
        }
    }
</script>

<style scoped>

</style>
