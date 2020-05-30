<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisible">
      <el-form v-model="selectedUser"
               v-loading="loading"
               element-loading-text="请稍后..."
               style="text-align: left" ref="dataForm">
        <el-row :gutter="20">
          <el-col :span="16"><el-form-item label="姓名: " label-width="120px" prop="username">
            <label>{{selectedUser.username}} </label>
            <td>第一志愿：{{bmFormatter_1(selectedUser.bm1)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二志愿：{{bmFormatter_1(selectedUser.bm2)}}</td>
          </el-form-item></el-col>
          <el-col :span="8"><el-image :src="selectedUser.photo+'!rootimg'"
                                      :preview-src-list="[selectedUser.photo+'!rootbigimg',selectedUser.searchurl+'!rootbigimg']">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div></el-image>
            <el-upload
              class="img-upload"
              ref="upload"
              action="http://jdbc.api.q7w.cn:8081/api/club/s/file/upload"
              :data="{phone:selectedUser.phone}"
              with-credentials
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="handleSuccess"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-col>
        </el-row>
        <el-form-item label="手机号：" label-width="120px" prop="phone">
          <el-input v-model="selectedUser.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" label-width="120px" prop="email">
          <el-input v-model="selectedUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院：" label-width="120px" prop="name">
          <el-input v-model="selectedUser.xy" autocomplete="off"></el-input>
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
            <el-input v-model="selectedUser.score1" autocomplete="off"></el-input>
            一面By：{{selectedUser.score1_by}}
          </el-form-item>
        <el-form-item label="一面意见：" label-width="120px" prop="fisugs">
          <label>{{selectedUser.fstsug}} </label>
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
            <el-form-item label="二面成绩3"  label-width="120px" prop="score2_3">
              <el-input v-model="selectedUser.score2_3" placeholder="请输入二面成绩" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="二面意见：" label-width="120px" prop="fisugs">
          <label>{{selectedUser.setsug}} </label> ---By：{{selectedUser.score2_1_by}}&nbsp;--最后处理By：{{selectedUser.lastmodifiedBy}}
          <td>注册时间：{{dateFormatter_1(selectedUser.createTime)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{dateFormatter_1(selectedUser.updateTime)}}</td>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="getcachetime(selectedUser.username,selectedUser.phone)"
          type="info"
          icon="el-icon-search" circle plain>
        </el-button>
        <el-button
          @click="onSubmit_ref(selectedUser.username,selectedUser.phone)"
          type="warning" icon="el-icon-refresh-left"  plain>清除缓存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(selectedUser)">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-col :span="24" class="warp-breadcrum">
      <!--搜索栏-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" >
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
          sortable
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
          width="160">
          <template slot-scope="scope">
            <el-button
              @click="editUser(scope.row)"
              type="primary"
              size="mini" plain>
              编辑
            </el-button>
            <el-button
             @click="onSubmit_dele(scope.row)"
             type="danger"
             size="mini" plain>
              移除
            </el-button>
            <el-button
              @click="onSubmit_ref(scope.row.username,scope.row.phone)"
              type="warning" size="mini" icon="el-icon-refresh-left" circle plain></el-button>
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
  import ImgUpload from './ImgUpload'
    export default {
        name: 'NewClubUserProfile',
        components: {ImgUpload},
      data () {
        return {
          fileList: [],
          users: [],
          upurl:'',
          phone:'',
          roles: [],
          loading: true,
          dialogFormVisible: false,
          selectedUser: [],
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
          this.$axios.get('/club/listapi_1').then(resp => {
            if (resp && resp.data.rspCode === '200') {
              _this.users = resp.data.data
              _this.loading = false
            }
          })
        },getUser() {
          this.userInfo();
          this.loading = true
        },
        userInfo() {
          var _this = this
          this.$axios.get('club/api/listbypno?phone='+this.phone).then(resp => {
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
        },getcachetime(username,phone){
          var _this = this
          this.$axios.get('club/api/getcachetime?username='+username+'&phone='+phone,{
          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              this.$message.info(username+" 的数据将会在 "+resp.data.data+" 秒后更新");
            }else {
              this.$message.info("异常信息："+resp.data.data);
            }
          })},

        uploadImg () {
          this.selectedUser.photo = this.$refs.imgUpload.url
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
        dateFormatter_1 (row, column) {
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
        onSubmit (user) {
          this.$axios.put('/club/update', {
            username: user.username,
            name: user.name,
            phone: user.phone,
            email: user.email,
            score1: user.score1,
            score2_1: user.score2_1,
            score2_2: user.score2_2,
            score2_3: user.score2_3,
            photo:user.photo,
            bm:user.bm,
            status:user.status

          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              this.$alert('用户信息修改成功')
              this.dialogFormVisible = false
              // 修改角色后重新请求用户信息，实现视图更新
              this.listUsers()
            }
          })
        },
        onSubmit_ref(username,phone){
            var _this = this
            this.$axios.get('club/api/userrefresh?username='+username+'&phone='+phone,{
            }).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                this.$message.success(resp.data.data);
              }else {
                this.$message.warning("后端错误");
              }
            })},
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
        onSubmit_dele (user) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.selectedUser = user
            this.$axios.post('/club/delete', this.selectedUser).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                this.$alert('用户删除成功')
                this.dialogFormVisible = false
                // 修改角色后重新请求用户信息，实现视图更新
                this.listUsers()
              }
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
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
            case '8':
              return '确认录取'
            default:
              return '未录取'
          }
        },
        }
    }
</script>

<style scoped>

</style>
