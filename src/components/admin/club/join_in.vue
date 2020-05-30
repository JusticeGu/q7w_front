<template>
    <el-main>
        <el-form
                label-position="label-position"
                status-icon
                :rules="rules"
                ref="loginForm"
                v-loading="loading"
                element-loading-text="请稍后..."
                element-loading-spinner=""
                element-loading-background="rgba(0, 0, 0, 0.05)"
                :model="joinForm"
                class="loginContainer">
            <h3 class="loginTitle">社团报名系统</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="joinForm.username" auto-complete="off"
                          placeholder="请输入您的姓名(必填)" clearable></el-input>
            </el-form-item>
          <el-form-item prop="xy">
            <el-input size="normal" type="text" v-model="joinForm.xy" auto-complete="off"
                      placeholder="请输入您的所在学院(必填)" clearable></el-input>
          </el-form-item>
          <el-row gutter="15">
            <el-col :span="12">
              <el-form-item prop="field104">
                <el-select v-model="joinForm.bm1" placeholder="请选择第一志愿(必填)" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in options_bm" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  prop="field105">
                <el-select v-model="joinForm.bm2" placeholder="请选择第二志愿(可选)" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in options_bm2" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-form-item prop="email">
                <el-input size="normal"  type="text" v-model="joinForm.email" auto-complete="off"
                          placeholder="请输入您的邮箱(必填)" clearable></el-input>
            </el-form-item>
            <el-form-item prop="phone"  label-position="label-position" >
                <el-input size="normal" class="loginphone" type="text" v-model="joinForm.phone" auto-complete="off"
                          placeholder="请输入您的手机号(重要)" clearable></el-input>
            </el-form-item>
          <el-form-item prop="hobbies">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="兴趣&爱好"
              v-model="joinForm.hobbies">
            </el-input>
          </el-form-item>

            <el-alert title="注意事项：" type="info" show-icon><template slot='title'>
              <div>1、报名表只可以提交一次，如果信息填写错误可以找现场带工作证的学长学姐进行更改</div>
              <div>2、手机号是我们发送面试结果以及查询面试状态的重要信息，请务必确保手机号填写正确嗷</div>
              <div>3、英播面试流程属于单列，请英语相关专业或有英播经验的同学报名，无相关经验慎选"</div>
            </template></el-alert>
          <el-alert  title="只有一面未通过申请才会进入第二志愿部门，通过一面后还想面试其他部门请直接和学长学姐说明这一点哦"  type="warning"  show-icon>
          </el-alert>
            <el-checkbox size="normal" class="loginRemember" v-model="checked">我已了解</el-checkbox>
           <!-- <el-button size="normal" type="primary" style="width: 100%;" @click="submit_Json">立即注册</el-button>-->
            <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin"
                       :disabled="!checked" :loading="loading">立即注册</el-button>
        </el-form>
      <el-dialog title="注意事项：" :visible.sync="dialogFormVisible_newuser">
        <el-form :model="newuserform">
          <el-form-item label="姓名：" :label-width="formLabelWidth">
            <label>{{newuserform.username}} </label>
          </el-form-item>
          <el-form-item label="一面部门：" :label-width="formLabelWidth">
            <label>{{formatterColumn1(newuserform.bm)}} </label>
          </el-form-item>
          <el-form-item label="二维码(加载缓慢请先阅读下方注意事项)" >
            <el-image :src="newuserform.searchurl+'!qrcode'" :preview-src-list="[newuserform.searchurl+'!userbigimg']" :lazy='true'>
              <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div></el-image>
          </el-form-item>
          <tr>点击二维码放大</tr>
          <tr>二维码加载失败可以在一面时联系学长学姐获取,不影响面试过程 </tr>
          <el-form-item label="注意事项" :label-width="formLabelWidth">
            <div><br><strong>请将上方二维码截图保存，二维码可以使用微信扫一扫获取最新面试进度</strong><br/>
          主播部面试地点:新1-101(一面)新1-102(二面)<br/>
          导播、编辑、行政部面试地点:新1-103(一面)新1-104(二面)<br/>
           请加入武汉理工大学广播台QQ招新群 群号：98765432<br/>
             欢迎关注武汉理工大学广播台官方微信：whut_bcs</strong><br/></div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible_newuser = false">取 消</el-button>
          <el-button type="primary" @click="loadUsers_new(newuserform.username,newuserform.phone)">刷新</el-button>
        </div>
      </el-dialog>
    </el-main>
</template>

<script>
    const TIME_COUNT = 60 // 更改倒计时时间
    export default {
      name: 'join_in',
      data () {
        var validatePhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'))
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            console.log(reg.test(value))
            if (reg.test(value)) {
              callback()
            } else {
              return callback(new Error('请输入正确的手机号'))
            }
          }
        }
        return {
          field103Options: [{
            "label": "前后鼻音",
            "value": "eng"
          }, {
            "label": "尖音-jqx",
            "value": "jqx"
          }, {
            "label": "平翘舌-nl",
            "value": "nl"
          }, {
            "label": "方音-ao",
            "value": "ao"
          }],
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
          }], options_bm2: [{
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
          },],
          value_xy: '',
          value_bm1: '',
          value_bm2: '',
          field103: [],
          show: true, // 初始启用按钮
          count: '', // 初始化次数
          timer: null,
          labelPosition: 'left',
          loading: false,
          newuserform: [],
          dialogFormVisible_newuser: false,
          joinForm: {
            username: '',
            phone: '',
            email: '',
            xy: '',
            bm1: '',
            bm2: '',
            status: '1',
            hobbies: '',
            wxopenid:'.'
          },

          checked: false,
          rules: {
            username: [{required: true, message: '请输入您的姓名', trigger: 'blur'}],
            email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],

            phone: [
              {validator: validatePhone, trigger: 'blur'}
            ]
          }
        }
      },
      methods: {

        send_mes () {
          if (!this.timer) {
            this.count = TIME_COUNT
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.show = true
                clearInterval(this.timer) // 清除定时器
                this.timer = null
              }
            }, 1000)
          }
        },
        // 此方式传递的信息为key-value形式Json形式见上一方法
        loadUsers_new (username, bm,searchurl) {
          var _this = this
          _this.newuserform.username = username
          _this.newuserform.searchurl = searchurl
          _this.newuserform.bm = bm

        },
        submitLogin () {
          this.$refs.loginForm.validate((valid) => {
            if (valid) {
              this.loading = true
              this.$axios.post('/club/api/clubadd', this.joinForm).then(resp => {
                if (resp && resp.data.rspCode === '200') {
                  this.loading = false
                  this.$message.success(this.joinForm.username + '，你已经成功提交申请,请在指定时间参加面试！')
                  this.loadUsers_new(this.joinForm.username, this.joinForm.bm1,resp.data.data)
                  this.dialogFormVisible_newuser = true
                } else {
                  this.loading = false
                  this.$message.warning(resp.data.data + ' 错误代码：' + resp.data.rspCode + ' 具体问题：' + resp.data.rspMsg)
                }
              })
            } else {
              this.$message.error('你还有信息没有填写完哦，请核对后再提交！')
              return false
            }
          })
        },
        formatterColumn1 (row) {
          switch (row) {
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

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .option_1{
        margin: 10px auto;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
    .loginphone{
        text-align: left;

    }
    .loginmail {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>
