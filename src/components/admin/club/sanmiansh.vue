<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisible">
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
        <el-form-item label="手机号：" label-width="120px" prop="phone">
          <label>{{selectedUser.phone}} </label>
        </el-form-item>
        <el-form-item label="邮箱：" label-width="120px" prop="email">
          <label>{{selectedUser.email}} </label>
        </el-form-item>
        <el-form-item label="学院：" label-width="120px" prop="name">
          <label>{{selectedUser.xy}} </label>
        </el-form-item>
        <el-form-item label="兴趣爱好：" label-width="120px" prop="hobbies">
          <label>{{selectedUser.hobbies}} </label>
        </el-form-item>
        <el-row gutter="15">
        <el-col :span="12">
        <el-form-item label="面试部门：" label-width="120px" prop="hobbies">
          <el-select v-model="selectedUser.bm" placeholder="请选择部门"  :style="{width: '100%'}">
            <el-option v-for="(item, index) in options_bm" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="面试状态：" label-width="120px" prop="hobbies">
            <el-select v-model="selectedUser.status" placeholder="请选择状态"  :style="{width: '100%'}">
              <el-option v-for="(item, index) in options_status" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
        </el-form-item>
      </el-col>
        </el-row>
          <el-form-item label="一面成绩：" label-width="120px" prop="name">
            <label>{{selectedUser.score1}} </label>
            一面By：{{selectedUser.score1_by}}
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
              <label>{{selectedUser.score2_3}} </label>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分组意向：" label-width="120px" prop="fisugs">
          <label>{{selectedUser.setsug}} </label> ---By：{{selectedUser.score2_1_by}}
        </el-form-item>
        <el-form-item label="分组：" label-width="120px" prop="fissug1" >
          <el-checkbox-group v-model="bcsunit" size="medium">
            <el-checkbox-button v-for="(item, index) in unitptions" :key="index" :label="item.value"
                                :disabled="item.disabled" border>{{item.label}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <td>注册时间：{{dateFormatter(selectedUser)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{dateFormatter(selectedUser)}}</td>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="success" plain @click="onSubmit(selectedUser,7)">确认录取</el-button>
        <el-button  type="warn" plain @click="onSubmit_re(selectedUser,-2)">驳回申请</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>招新管理</el-breadcrumb-item>
        <el-breadcrumb-item>三面审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-col :span="24" class="warp-breadcrum">
      <!--搜索栏-->
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
            <el-input v-model="phone" placeholder="请输入面试者手机号"></el-input>
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
              编辑
            </el-button>

          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
  import ImgUpload from './ImgUpload'
    export default {
        name: 'sanmiansh',
        components: {ImgUpload},
      data () {
        return {
          fileList: [],
          users: [],
          mstype:1,
          bmData: [],
          status:'',
          bcsunit:[],
          unitptions: [{
            "label": "新闻视野",
            "value": "新闻视野"
          }, {
            "label": "体育无极限",
            "value": "体育无极限"
          }, {
            "label": "文学星空",
            "value": "文学星空"
          }, {
            "label": "音影风暴",
            "value": "音影风暴"
          },{
              "label": "WS",
              "value": "Wednesday Symphony"
            }],
          upurl:'',
          srcList:[],
          loading: true,
          dialogFormVisible: false,
          selectedUser: [],
          selectedUser1: [],
          selectedRolesIds: [],
          options_bm: [{
            value: '1',
            label: '主播部'
          }, {
            value: '2',
            label: '导播部'
          }, {
            value: '3',
            label: '编辑部'
          }, {
            value: '4',
            label: '行政部'
          }, {
            value: '5',
            label: '主播部(英播)'
          }], options_status: [{
            value: '1',
            label: '待一面'
          }, {
            value: '2',
            label: '待二面'
          }, {
            value: '3',
            label: '二面已提交'
          }, {
            value: '4',
            label: '待三面'
          }, {
            value: '5',
            label: '三面审核中'
          },{
            value: '6',
            label: '待排组'
          },{
              value: '7',
              label: '已录取'
            },
            {
              value: '-2',
              label: '未录取'
            }
          ]
        }
      },
      mounted () {
        this.typeInfo(); //分类初始化
        this.userInfo(); //用户初始化列表
      },
      computed: {
        tableHeight () {
          return window.innerHeight - 320
        }
      },
      methods: {
        listUsers () {
          var _this = this
          this.$axios.get('/club/api/listbysh?status=5&bm='+this.mstype).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              _this.users = resp.data.data
              _this.loading = false
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
        listUser () {
          var _this = this
          this.$axios.get('club/api/bsplist?bm='+this.mstype+'&status=5&phone='+this.phone).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              _this.users = resp.data.data
              _this.loading = false
              _this.field105=undefined
              _this.fstsug=[]
            }else {
              _this.users = null
              _this.loading = false
              _this.field105=undefined
            }
          })
        },
        getUser() {
          this.userInfo();
        },
        userInfo() {
          var _this = this
          this.$axios.get('/club/api/listbysh?status=5&bm='+this.mstype).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              _this.users = resp.data.data
              _this.loading = false
              _this.field105=undefined
              _this.fstsug=[]
            }else {
              this.$alert(resp.data.rspMsg+"：未获取到用户信息（该用户未通过一面或无此部门面试）", '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        },

        handleSuccess (response) {
          // console.log(this.url)
          this.$emit('onUpload')
          this.$message.info(response.data)
          this.fileList= []
        }, dateFormatter (row, column) {
          let datetime = row.createTime;
          if(datetime){
            datetime = new Date(datetime);
            let y = datetime.getFullYear() + '-';
            let mon = datetime.getMonth()+1 + '-';
            let d = datetime.getDate();
            return y + mon + d;
          }
          return 'NULL'
        },
        onSubmit (user,status){
          this.$confirm('您正在对'+user.username+'进行分组操作，是否确认', '提示', {
            confirmButtonText: '确认分组',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.put('/club/update_3', {
              username: user.username,
              status:status,
              fstsug:user.fstsug,
              setsug:user.username+"同学，你分配到的节目组为："+JSON.stringify(this.bcsunit)+
                "请密切关注群内通知"
            }).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                if(user.wxopenid === null){
                  this.$alert('请人工发送通过短信给 '+user.username+' 手机号：'+user.phone,"无法微信自动通知")
                }else {
                  this.$alert('审核成功，通知成功,也可以同时发送短信到：'+user.phone+"("+user.username+")")
                  this.dialogFormVisible = false
                }
                this.$message.success("分组成功")
                this.dialogFormVisible = false
                // 修改角色后重新请求用户信息，实现视图更新
                this.listUsers()
              }
            })
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        onSubmit_re (user,status){
          this.$confirm('您正在对'+user.username+'进行驳回操作，是否确认', '提示', {
            confirmButtonText: '确认分组',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.put('/club/update_3', {
              username: user.username,
              status:status,
              fstsug:user.fstsug,
              setsug:user.username+"同学，很遗憾你没有通过我们的面试，感谢你对于理工之声社团的热爱"
            }).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                if(user.wxopenid === null){
                  this.$alert('请人工发送驳回短信给 '+user.username+' 手机号：'+user.phone,"无法微信自动通知")
                }else {
                  this.$alert('驳回成功，通知成功,也可以同时发送短信到：'+user.phone+"("+user.username+")")
                  this.dialogFormVisible = false
                }
                this.dialogFormVisible = false
                // 修改角色后重新请求用户信息，实现视图更新
                this.listUsers()
              }
            })
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        editUser (user) {
          this.dialogFormVisible = true
          this.selectedUser = user
        },
        editUser_2 (user) {
          this.dialogFormVisible_1 = true
          this.selectedUser1 = user
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
              return '已录取'
            default:
              return '未录取'
          }
        },
        }
    }
</script>

<style scoped>

</style>
