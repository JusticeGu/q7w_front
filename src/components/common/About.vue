<template>
  <div class="footer">
    <div style="border-top:1px #1F1F1F solid;">
      <p class="alt" style="color:#999; line-height:0">&copy;
        <span></span>
        <a href="" target="_blank" style="color:#999;">鄂ICP备18001054号-1</a>
        <div style="width:300px;margin:0 auto; padding:20px 0;">
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42011102000918" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">鄂公网安备 42011102000918号</p></a>
    </div>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Footer'
  }
</script>

<style scoped>

  * {
    margin: 0;
    padding: 0;
    font-family: '微软雅黑', Arial, Helvetica, sans-serif;
  }

  body {
    font-size: 12px;
  }

  div {
    font-size: 12px;
  }

  span {
    font-size: 12px;
  }

  .footer {
    background: #2b2e33;
  }

  .footer .alt {
    overflow: hidden;
    padding: 20px 0;
    width: 1160px;
    margin: auto;
  }

  .footer .alt .foot {
    width: 138px;
    float: left;
  }

  .footer .alt .foot p {
    color: #FFF;
    line-height: 28px;
  }

  a{
    text-decoration: none;
  }

  .footer .alt .foot a {
    color: #999;
    display: block;
    line-height: 24px;
  }
</style>
