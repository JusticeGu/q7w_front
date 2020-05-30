<template>
    <el-main>
        <el-form
                label-position="label-position"
                status-icon
                :rules="rules"
                ref="formLabelAlign"
                v-loading="loading"
                element-loading-text="请稍后..."
                element-loading-spinner=""
                element-loading-background="rgba(0, 0, 0, 0.05)"
                :model="formLabelAlign"
                class="loginContainer">
            <h3 class="loginTitle">{{users.username}}同学，你目前的面试进度为{{formatterColumn(users.status)}}</h3>
            <el-steps :space="200" :active=users.status finish-status="success">
                <el-step title="信息提交"></el-step>
                <el-step title="一面"></el-step>
                <el-step title="二面"></el-step>
                <el-step title="待三面"></el-step>
              <el-step title="三面"></el-step>
              <el-step title="待录取"></el-step>
                <el-step title="面试结束"></el-step>
            </el-steps>
            <el-form-item>
                <tr>
                    <td>姓名:</td>
                    <td>{{users.username}}</td>
                </tr>
            </el-form-item>
          <el-row :gutter="20">

            <el-col :span="8"> <el-form-item label="照片" >
              <el-image :src="users.photo+'!userimg'" :preview-src-list="[users.photo+'!userbigimg']">
                <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div></el-image>
            </el-form-item>
              <el-upload
                v-if="users.status == '4'||users.status == '3'"
                class="img-upload"
                ref="upload"
                action="https://jdbc.api.q7w.cn:8081/api/club/s/file/upload"
                :data="{phone:users.phone}"
                with-credentials
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleSuccess"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary" :disabled="isupload">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-col>
          </el-row>
            <el-form-item>
                <tr>
                    <td>手机号:</td>
                    <td>{{users.phone}}</td>
                </tr>
            </el-form-item>
            <el-form-item>
                <tr>
                    <td>处理部门:</td>
                    <td>{{formatterColumn1(users.bm)}}</td>
                </tr>
            </el-form-item>

            <el-form-item>
                <tr>
                    <td>节目组建议:</td>
                  <td><strong>{{users.setsug}}</strong></td>
                </tr>
            </el-form-item>
          <el-form-item>
            <tr>
              <td>录取状态:</td>
              <td ><strong>{{formatterColumn(users.status)}}</strong></td>
            </tr>
          </el-form-item>
          <td>注册时间：{{dateFormatter(users.create_time)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{dateFormatter(users.update_time)}}</td>
        </el-form>


    </el-main>
</template>

<script>
    export default {
        name: "status",
        data() {
            return {
              isupload:false,
                users: [],
                fileList: [],
                formLabelAlign: {
                    score1:'',
                    score2_1:'',
                    score2_2:'',
                    score2_3:'',
                    status:'2',
                },
                rules: {
                    score1:[{required: true, message: '请输入一面成绩', trigger: 'blur'}],
                    score2_1:[{required: true, message: '请输入二面成绩1', trigger: 'blur'}],
                    score2_2:[{required: true, message: '请输入二面成绩2', trigger: 'blur'}],
                    score2_3:[{required: true, message: '请输入二面成绩3', trigger: 'blur'}],

                },



            }
        },
        mounted:
            function () {
                this.loadUsers();
            },
        methods: {
            handleChange(value) {
                console.log(value);
            },
            onSubmit() {
                console.log('submit!');
            },

          loadUsers () {
            var query=this.$route.query;
            let phone = query.phone;
            let username = query.username;
            var _this = this
            this.$axios.get('/club/api/namephone?username=' +username+"&phone="+phone).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                _this.users = resp.data.data
                _this.loading = false
              }else {
                this.$alert("错误信息："+resp.data.rspMsg, '查询失败,请联系学长学姐处理', {
                  confirmButtonText: '确定'
                })
              }
            })
          }, handleSuccess (response) {
            // console.log(this.url)
            this.$emit('onUpload')
            this.$message.info(response.data+",照片上传后不会马上显示，3小时内更新或联系管理员清除缓存后立即显示")
            this.isupload = true
            this.loadUsers();
            this.fileList= []
          },  handleRemove(file, fileList) {
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
          },dateFormatter (row, column) {
            let datetime = row;
            if(datetime){
              datetime = new Date(datetime);
              let y = datetime.getFullYear() + '-';
              let mon = datetime.getMonth()+1 + '-';
              let d = datetime.getDate()+' ';
              let h = datetime.getHours()+':';
              let m = datetime.getMinutes()+':'
              let s = datetime.getSeconds()
              return y + mon + d + h + m + s;
            }
            return 'NULL'
          },

            submit() {
                this.$refs.formLabelAlign.validate((valid) => {
                    if (valid) {
                      this.$message.success('查询成功');
                    } else {
                        this.$message.error('请正确输入');
                        return false;
                    }
                });
            },
            formatterColumn(row) {
                switch(row){
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
            formatterColumn1(row) {
                switch(row){
                    case '1':
                        return '主播部';
                    case '2':
                        return '导播部';
                    case '3':
                        return '编辑部';
                    case '4':
                        return '行政部';
                    case '5':
                    return '主播部（英播）';
                    default:
                        return '未知';
                }
            },


        }
    }
</script>

<style scoped>

</style>
