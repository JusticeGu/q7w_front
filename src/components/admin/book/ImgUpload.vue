<template>
  <el-upload
    class="img-upload"
    ref="upload"
    action="https://jdbc.api.q7w.cn:8081/api/books/imgupload"
    :data="{'title':title}"
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
</template>

<script>
  export default {
    name: 'ImgUpload',
    data () {
      return {
        fileList: [],
        url: '',
        title:'undefine',
      }
    },
    methods: {
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
        // 此处的 file 是整个文件
        // console.log(file.response)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleSuccess (response) {
        if(response.rspCode === '200'){
        this.url = response.data
        // console.log(this.url)
        this.$emit('onUpload')
        this.data.title = ''}
        else{
          this.$message.warning("上传失败请重试")
        }
      },
      clear () {
        this.$refs.upload.clearFiles()
      }
    }
  }
</script>

<style scoped>
  .img-upload {
    /*height: 200px;*/
  }
</style>
