<template>
  <div id="Register">

    <el-form
      label-position="label-position"
      status-icon
      :rules="rules"
      ref="loginForm"
      v-loading="loading"
      element-loading-text="请稍后..."
      element-loading-spinner=""
      element-loading-background="rgba(0, 0, 0, 0.05)"
      :model="loginForm"
      class="loginContainer">
      <h3 class="loginTitle">面试官注册</h3>
      <el-form-item prop="username">
        <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off"
                  placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input size="normal" type="text" v-model="loginForm.name" auto-complete="off"
                  placeholder="请输入真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="password" >
        <el-input size="normal" type="password" v-model="loginForm.user_password" auto-complete="off"
                  placeholder="请输入密码" @keydown.enter.native="submitLogin" show-password ></el-input>
      </el-form-item>
      <el-form-item prop="checkpassword" >
        <el-input size="normal" type="password" v-model="loginForm.checkpassword" auto-complete="off"
                  placeholder="请再次输入密码" @keydown.enter.native="submitLogin" ></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input size="normal" type="text" v-model="loginForm.email" auto-complete="off"
                  placeholder="请输入您的邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phone"  label-position="label-position" >
        <el-input size="normal" class="loginphone" type="text" v-model="loginForm.phone" auto-complete="off"
                  placeholder="请输入您的手机号" clearable></el-input>
      </el-form-item>


      <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin">立即注册</el-button>
    </el-form>
  </div>
</template>

<script>
  const TIME_COUNT = 60; //更改倒计时时间
  export default {
    name: "msgreg",
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.loginForm.user_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }

      };
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      return {

        show: true,  // 初始启用按钮
        roles: [],
        selectedRolesIds: [],
        count: '',   // 初始化次数
        timer: null,
        labelPosition: 'left',
        loading: false,
        loginForm: {
          isDisabled:false,
          username: '',
          name:'',
          user_password: '',
          phone: '',
          email: '',
          checkpassword: '',
          id_code:'',
          create_by:'web-register',
          roles:[{"id":4,"name":"clubmanage","nameZh":"面试官","enabled":true,"perms":[{"id":4,"name":"社团管理","desc_":"club_management","url":"/api/club"},{"id":1,"name":"用户管理","desc_":"users_management","url":"/api/admin/user"}],"menus":[{"id":12,"path":"/admin","name":"Club","nameZh":"面试管理","iconCls":"el-icon-user","component":"AdminIndex","parentId":0,"children":[{"id":11,"path":"/admin/club/NewClubUserProfile","name":"NewClubUserProfile","nameZh":"面试列表","iconCls":"","component":"club/NewClubUserProfile","parentId":12,"children":[]},{"id":13,"path":"/admin/club/first","name":"first","nameZh":"一面列表","iconCls":null,"component":"club/first","parentId":12,"children":[]},{"id":14,"path":"/admin/club/second","name":"second","nameZh":"二面列表","iconCls":null,"component":"club/second","parentId":12,"children":[]}]},{"id":1,"path":"/admin","name":"AdminIndex","nameZh":"首页","iconCls":"el-icon-s-home","component":"AdminIndex","parentId":0,"children":[{"id":2,"path":"/admin/dashboard","name":"DashboardAdmin","nameZh":"运行情况","iconCls":null,"component":"dashboard/admin/index","parentId":1,"children":[]}]},{"id":17,"path":"/admin","name":"Club-sh","nameZh":"主播面试","iconCls":"el-icon-s-order","component":"AdminIndex","parentId":0,"children":[{"id":16,"path":"/admin/club/yimain","name":"yimian","nameZh":"一面(手机号)","iconCls":null,"component":"club/yimain","parentId":17,"children":[]},{"id":18,"path":"/admin/club/ermian","name":"ermian","nameZh":"二面(手机号)","iconCls":null,"component":"club/ermian","parentId":17,"children":[]},{"id":19,"path":"/admin/club/zbsm","name":"sanmian","nameZh":"二面审核","iconCls":null,"component":"club/zbsm","parentId":17,"children":[]},{"id":20,"path":"/admin/club/sanmian","name":"sanmiansh","nameZh":"三面采集","iconCls":null,"component":"club/sanmian","parentId":17,"children":[]},{"id":21,"path":"/admin/club/sanmiansh","name":"sanmiansh","nameZh":"三面分组","iconCls":null,"component":"club/sanmiansh","parentId":17,"children":[]},{"id":22,"path":"/admin/club/successlist","name":"successlist","nameZh":"确认列表","iconCls":null,"component":"club/successlist","parentId":17,"children":[]}]}]}],
        },
        checked: true,
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          user_password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          checkpassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          phone:[
            { validator: validatePhone, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      send(){
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.send_mes();
            return true;
          } else {
            this.$message.error('信息填写有误，请核对');
            return false;
          }
        });
      },
      send_mes(){
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);  // 清除定时器
              this.timer = null;
            }
          }, 1000)
        }
      },

      submitLogin() {

        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$axios
              .post('msgregister', this.loginForm).then(resp => {
              if (resp && resp.data.rspCode === '200') {
                this.loading = false;
                this.$message.success(resp.data.data+"注册成功，请验证您的邮箱")
                //  this.$store.commit('INIT_CURRENTHR', resp.obj);
                // window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
                let path = this.$route.query.redirect;
           //     this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
              }
              else {
                this.loading = false;
                this.$message.warning(resp.data.data+",请重新注册")
              }
            })
          } else {
            this.$message.error('用户名/密码不可以为空，请正确输入');
            return false;
          }
        });
      }
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
</style>
