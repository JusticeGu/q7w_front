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
          <el-col :span="8"><el-image :src="selectedUser.searchurl+'!rootimg'"
                                      :preview-src-list="[selectedUser.searchurl+'!rootbigimg',selectedUser.photo]+'!rootbigimg'">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div></el-image>
            <el-upload
              class="img-upload"
              ref="upload"
              action="https://jdbd.api.q7w.cn:8081/api/club/s/file/upload"
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
          <label>{{selectedUser.setsug}} </label> ---By：{{selectedUser.score2_1_by}}
        </el-form-item>
        <td>注册时间：{{dateFormatter(selectedUser)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{dateFormatter(selectedUser)}}</td>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="信息采集"
      :visible.sync="dialogFormVisible_1">
      <el-form v-model="selectedUser1" style="text-align: left" ref="dataForm">
          <el-form-item label="姓名: " label-width="120px" prop="username">
            <label>{{selectedUser1.username}} </label>
            <td>状态：{{ statusFormatter(selectedUser1)}}</td>
          </el-form-item>
        <el-form-item label="照片: " label-width="120px" prop="photo">

          <el-upload
            class="avatar-uploader"
            action="https://jdbc.api.q7w.cn:8081/api/club/s/file/upload"
            :data="{phone:selectedUser1.phone}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分组意向：" label-width="120px" prop="fissug1" >
          <el-checkbox-group v-model="bcsunit" size="medium">
            <el-checkbox-button v-for="(item, index) in unitptions" :key="index" :label="item.value"
                                :disabled="item.disabled" border>{{item.label}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer1">
        <el-button @click="dialogFormVisible_1 = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(selectedUser1,5)">确 定</el-button>
      </div>
    </el-dialog>

    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>招新管理</el-breadcrumb-item>
        <el-breadcrumb-item>三面信息采集</el-breadcrumb-item>
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
              @click="editUser_2(scope.row)"
              type="text"
              size="small">
              采集
            </el-button>
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
        name: 'sanmian',
        components: {ImgUpload},
      data () {
        return {
          isupload:false,
          imageUrl: '',
          fileList: [],
          users: [],
          mstype:'1',
          bmData: [],
          status:'',
          upurl:'',
          roles: [],
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
          srcList:[],
          loading: true,
          dialogFormVisible: false,
          dialogFormVisible_1: false,
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
          this.$axios.get('/club/api/listbysh?status=4&bm='+this.mstype).then(resp => {
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
          this.$axios.get('club/api/bsplist?bm='+this.mstype+'&status=4&phone='+this.phone).then(resp => {
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
          this.$axios.get('/club/api/listbysh?status=4&bm='+this.mstype).then(resp => {
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
          this.$alert(response.data, '上传成功', {
            confirmButtonText: '确定'
          })
          this.isupload = true
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
        onSubmit (user,status) {
          this.$axios.put('/club/update_2sh', {
            username: user.username,
            status:status,
            fstsug: "一面意见：" + user.fstsug + "二面意见："+user.setsug,
            setsug:"节目组意向："+JSON.stringify(this.bcsunit),

          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              this.$message.success("三面采集成功")
              this.dialogFormVisible_1 = false
              // 修改角色后重新请求用户信息，实现视图更新
              this.listUsers()
            }
          })
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
        },handleAvatarSuccess(res, file) {
          this.$alert(res.rspMsg, '上传成功', {
            confirmButtonText: '确定'
          })
          this.imageURL = res.data+"!qrcode"
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 10;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 10MB!');
          }
          return isJPG && isLt2M;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
