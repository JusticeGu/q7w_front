<template>
  <div style="text-align: left">
    <el-button class="add-button" type="success" @click="dialogFormVisible = true">添加图书</el-button>
    <el-dialog
      title="添加/修改作品"
      :visible.sync="dialogFormVisible"
      @close="clear">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
        <el-form-item label="书名" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" autocomplete="off" placeholder="不加《》" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="author">
          <el-input v-model="form.author" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="出版日期" :label-width="formLabelWidth" prop="date">
          <el-input v-model="form.date" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="出版社" :label-width="formLabelWidth" prop="press">
          <el-input v-model="form.press" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth" prop="cover">
          <el-input v-model="form.cover" autocomplete="off" placeholder="图片 URL" :disabled="disabled"></el-input>
          <img-upload @onUpload="uploadImg(form.title)" ref="imgUpload" :disabled="disabled"></img-upload>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="abs">
          <el-input type="textarea" v-model="form.abs" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="作品上传" :label-width="formLabelWidth" prop="context">
          <el-input v-model="form.context" autocomplete="off" placeholder="文件 URL" :disabled="disabled"></el-input>
          <file-upload @onUpload="uploadFile(form.title)" ref="fileUpload" :disabled="disabled"></file-upload>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth" prop="cid">
        <el-select v-model="form.category.id" placeholder="请选择分类" :disabled="disabled">
          <el-option label="文学" value="1"></el-option>
          <el-option label="流行" value="2"></el-option>
          <el-option label="文化" value="3"></el-option>
          <el-option label="生活" value="4"></el-option>
          <el-option label="经管" value="5"></el-option>
          <el-option label="科技" value="6"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item v-if="isnew === false" label="审核意见" :label-width="formLabelWidth" prop="abs">
          <el-input type="textarea" v-model="form.suggestion" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="id" style="height: 0">
          <el-input type="hidden" v-model="form.id" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="form.isrejec === '1'"  type="primary" @click="onSubmit_mod" :disabled="disabled">重新提交</el-button>
        <el-button  type="primary" @click="onSubmit" :disabled="disabled">提交作品</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ImgUpload from './ImgUpload'
  import FileUpload from './FileUpload'
  export default {
    name: 'EditForm',
    components: {ImgUpload,FileUpload},
    data () {
      return {
        dialogFormVisible: false,
        disabled:false,
        isnew:true,
        form: {
          id: '',
          title: '',
          author: '',
          date: '',
          press: '',
          context:'',
          cover: '',
          abs: '',
          cid: '',
          category: {
            id: '',
            name: ''
          }
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      clear () {
        this.$refs.imgUpload.clear()
        this.$refs.fileUpload.clear()
        this.isnew=true
        this.disabled=false
        this.form = {
          id: '',
          title: '',
          author: '',
          date: '',
          press: '',
          context:'',
          cover: '',
          abs: '',
          category: {
            id: '',
            name: ''
          }
        }
      },
      onSubmit () {
        this.$axios
          .post('/admin/content/books_reg', {
            id: this.form.id,
            cover: this.form.cover,
            title: this.form.title,
            author: this.form.author,
            date: this.form.date,
            press: this.form.press,
            abs: this.form.abs,
            category: this.form.category,
            context:this.form.context,
          }).then(resp => {
            if (resp && resp.data.rspCode === '200') {
              this.$alert(resp.data.data,resp.data.rspMsg, {
                confirmButtonText: '确定'
              })
              this.dialogFormVisible = false
              this.$emit('onSubmit')
            }else {
              this.$alert(resp.data.data,resp.data.rspMsg, {
                confirmButtonText: '确定'
              })
            }
        })
      },
      onSubmit_mod () {
        this.$axios
          .post('/admin/content/bkmodify', {
            id: this.form.id,
            cover: this.form.cover,
            title: this.form.title,
            author: this.form.author,
            date: this.form.date,
            press: this.form.press,
            abs: this.form.abs,
            category: this.form.category
          }).then(resp => {
          if (resp && resp.data.rspCode === 200) {
            this.dialogFormVisible = false
            this.$alert(resp.data.data,resp.data.rspMsg, {
              confirmButtonText: '确定'
            })

            this.$emit('onSubmit')
          }else{
            this.$alert(resp.data.data,resp.data.rspMsg, {
              confirmButtonText: '确定'
            })
          }
        })
      },
      uploadImg (title) {
        this.$refs.imgUpload.title = title
        this.form.cover = this.$refs.imgUpload.url
      },
      uploadFile (title) {
        this.$refs.fileUpload.title = title
        this.form.context = this.$refs.fileUpload.url
        this.$message(this.$refs.fileUpload.url)
      }
    },

  }
</script>

<style scoped>
  .add-button {
    margin: 18px 0 0 10px;
  }
</style>
