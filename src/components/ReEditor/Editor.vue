<template>
  <div ref="editor" />
</template>
<script lang="ts">
import { onMounted, defineComponent, onBeforeUnmount, ref, toRefs } from "vue";
// 引入wangeditor组件
import WangEditor from "wangeditor";
// 公共状态文件
// 官方文档：https://www.kancloud.cn/wangfupeng/wangeditor3/335774
export default defineComponent({
  name: "editor",
  // 设置富文本编辑器的HTML内容
  props: {
    contentHtml: String
  },
  setup(props: any, content: any) {
    // 获取编辑器实例html
    const editor = ref();
    // 编辑器实例对象
    let instance: any = "";
    onMounted(() => {
      // 编辑器实例对象
      instance = new WangEditor(editor.value);
      // 自定义菜单
      instance.config.menus = [
        // 'head',
        "bold", //字体加粗
        "fontSize", //字号
        "fontName", //字体
        // 'italic',
        // 'underline',//下划线
        // 'strikeThrough',//删除线
        // 'indent',
        // 'lineHeight',
        "foreColor",
        // 'backColor',
        "link",
        "list", //列表
        // 'todo',
        "justify", //对其
        // 'quote',// 引用
        "emoticon",
        "image",
        // 'video',//视频
        // 'table',//表格
        "code",
        // 'splitLine',
        "undo", //撤销
        "redo" //恢复
      ];
      // 代码高亮
      //instance.highlight = hljs;
      // 开启本地上传图片(这是后端上传链接)
      instance.config.uploadImgServer = "/upload-img";
      // 限制上传图片格式
      instance.config.uploadImgAccept = ["jpg", "jpeg", "png", "gif", "bmp"];
      // 开启本地上传视频(这是后端上传链接)
      instance.config.uploadVideoServer = "/api/upload-video";
      // 设置编辑器高度
      instance.config.height = 350;
      // 设置编辑器页面层级
      instance.config.zIndex = 10;
      // 设置编辑器placeholder
      instance.config.placeholder = "请输入您的文字！";
      // 配置编辑器显示颜色
      instance.config.colors = ["#000000", "#eeece0", "#1c487f", "#4d80bf"];
      // 忽略粘贴内容中的图片
      instance.config.pasteIgnoreImg = true;

      Object.assign(instance.config, {
        // wangeditor 值发生变化的时候
        onchange() {
          // 将值instance.txt.html() 传递至父组件
          content.emit("getWangEditorValue", instance.txt.html());
        },
        // 上传网络图片回调
        linkImgCallback(src: string) {
          console.log("图片 src ", src);
        },
        // 上传网络视频回调
        onlineVideoCallback(video: string) {
          // 自定义回调内容，内容成功插入后会执行该函数
          console.log("插入视频内容", video);
        }
      });
      instance.create();

      // 设置富文本编辑器的页面内容，父组件传递的
      instance.txt.html(props.contentHtml);
    });
    //  页面卸载
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    return {
      editor
    };
  }
});
</script>
