<template>
  <div style="text-align: left">
    <el-dialog
      title="作品审核"
      :visible.sync="dialogFormVisible"
      @close="clear">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
        <el-form-item label="书名" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" autocomplete="off" placeholder="不加《》"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="author">
          <el-input v-model="form.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版日期" :label-width="formLabelWidth" prop="date">
          <el-input v-model="form.date" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社" :label-width="formLabelWidth" prop="press">
          <el-input v-model="form.press" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth" prop="cover">
          <el-input v-model="form.cover" autocomplete="off" placeholder="图片 URL"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="abs">
          <el-input type="textarea" v-model="form.abs" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作品下载" :label-width="formLabelWidth" prop="abs">
          <a :href="'https://view.officeapps.live.com/op/view.aspx?src='+form.context">点击下载</a>

        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth" prop="cid">
        <el-select v-model="form.category.id" placeholder="请选择分类">
          <el-option label="文学" value="1"></el-option>
          <el-option label="流行" value="2"></el-option>
          <el-option label="文化" value="3"></el-option>
          <el-option label="生活" value="4"></el-option>
          <el-option label="经管" value="5"></el-option>
          <el-option label="科技" value="6"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="审核意见" :label-width="formLabelWidth" prop="suggestion">
          <el-input type="textarea" v-model="form.suggestion" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="审核结论" :label-width="formLabelWidth" prop="if">
          <div>
            <el-radio v-model="radio1" label="1" border>驳回</el-radio>
            <el-radio v-model="radio1" label="4" border>通过</el-radio>
          </div>
        </el-form-item>
        <el-form-item prop="id" style="height: 0">
          <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button  type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ImgUpload from './ImgUpload'
  import fileUpload from './FileUpload'
  export default {
    name: 'EditForm',
    components: {ImgUpload},
    data () {
      return {
        dialogFormVisible: false,
        radio1: '1',
        form: {
          id: '',
          title: '',
          author: '',
          date: '',
          press: '',
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
        this.form = {
          id: '',
          title: '',
          author: '',
          date: '',
          press: '',
          cover: '',
          abs: '',
          category: {
            id: '',
            name: ''
          }
        }
      },
      onSubmit () {
        if (this.redio1 === '1'){ isrejec:'1'}
        else{isrejec:'0'}
        this.$axios
          .put('/admin/content/books_sh', {
            id: this.form.id,
            cover: this.form.cover,
            author: this.form.author,
            date: this.form.date,
            press: this.form.press,
            abs: this.form.abs,
            category: this.form.category,
            suggestion:this.form.suggestion,
            status:this.radio1

          }).then(resp => {
          if (resp && resp.data.rspCode === '200') {
            this.dialogFormVisible = false
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

      uploadImg () {
        this.form.cover = this.$refs.imgUpload.url
      }
    }
  }
</script>

<style scoped>
  .add-button {
    margin: 18px 0 0 10px;
  }
</style>
