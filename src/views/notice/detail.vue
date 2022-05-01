<script setup name="noticeDetail" lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useNoticeStoreHook } from "/@/store/modules/notice";
import editor from "/@/components/ReEditor/Editor.vue";
import { noticeDetailType } from "/@/store/modules/types";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { storageSession } from "/@/utils/storage";
const route = useRoute();
const noticeStore = useNoticeStoreHook();
const editFlag = ref(false);
const form = reactive({
  title: "",
  content: "",
  type: null
});
const editPermission = ref(
  storageSession.getItem("role").role == 1 ||
    storageSession.getItem("role").role == 2
);
function fetchData() {
  return new Promise(resolve => {
    console.log(
      "%c [ route.query ]-24",
      "font-size:13px; background:pink; color:#bf2c9f;",
      route.query
    );
    //const id = Number(router.currentRoute.value?.params?.id);
    const id = Number(route.query.id);
    noticeStore.GET_NOTICE_DETAIL(id).then((data: any) => {
      console.log(
        "%c [ data ]-27",
        "font-size:13px; background:pink; color:#bf2c9f;",
        data
      );
      resolve(data);
    });
  });
}
function onSubmit() {
  console.log(
    "%c [ form.content ]-50",
    "font-size:13px; background:pink; color:#bf2c9f;",
    form.content
  );
  let data = reactive({
    id: noticeStore.detailData.id,
    title: form.title,
    content: form.content,
    type: form.type
  });
  noticeStore.NOTICE_EDIT(data).then(() => {
    ElMessage.success("修改成功");
    editFlag.value = false;
    fetchData();
  });
}
function getWangEditorValue(str: string) {
  form.content = str;
}
// fetchData().then((res: detailType) => {
//   data.title = res.title;
//   data.content = res.content;
//   data.id = res.id;
//   data.uid = res.uid;
//   data.pubTime = res.pubTime;
//   data.nickName = res.nickName;
//   form.content = res.content;
//   form.title = res.title;
// });
onMounted(() => {
  fetchData().then((res: noticeDetailType) => {
    form.content = res.content;
    form.title = res.title;
    form.type = res.type;
  });
});
</script>
<template>
  <div>
    <el-row :gutter="24" style="margin: 20px">
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" />
      <el-col
        :xs="24"
        :sm="24"
        :md="18"
        :lg="18"
        :xl="18"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
        ><el-card style="height: 1000px">
          <template #header>
            <div class="card-header">
              <span class="font-medium" style="text-align: center">
                通告详情
              </span>
              <el-button
                round
                style="float: right"
                @click="editFlag = true"
                v-show="editPermission"
              >
                编辑
              </el-button>
            </div>
          </template>
          <el-row>
            <el-col :span="4" />
            <el-col :span="16">
              <h1
                style="
                  font-size: x-large;
                  font-weight: bolder;
                  margin-top: 48px;
                  width: 100%;
                  text-align: center;
                "
              >
                {{ noticeStore?.detailData?.title }}
              </h1>
              <el-divider style="width: 100%" />
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="float: right">
                <span style="font-size: 14px; color: darkgray"
                  >发布人：{{ noticeStore?.detailData?.nickName }}</span
                >
                <br />
                <span style="font-size: 14px; color: darkgray"
                  >发布时间：{{ noticeStore?.detailData?.pubTime }}</span
                >
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" />
            <el-col
              :xs="24"
              :sm="24"
              :md="20"
              :lg="20"
              :xl="20"
              style="margin-bottom: 48px"
              v-motion
              :initial="{
                opacity: 0,
                y: 100
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 200
                }
              }"
            >
              <el-scrollbar height="650px">
                <div
                  class="preview"
                  v-html="noticeStore?.detailData?.content" /></el-scrollbar
            ></el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" />
          </el-row> </el-card
      ></el-col>
    </el-row>
    <el-dialog
      v-model="editFlag"
      title="编辑公告"
      :width="800"
      center
      draggable
    >
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="标题" label-width="100" style="width: 100%">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类别" label-width="100" style="width: 50%">
          <el-select
            v-model="form.type"
            placeholder="请选择类别"
            align="center"
          >
            <el-option :key="0" label="疫情通告" :value="0" />
            <el-option :key="1" label="疫苗接种通告" :value="1" /><el-option
              :key="2"
              label="疫苗存量通告"
              :value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" label-width="100">
          <editor
            :contentHtml="form.content"
            v-on:getWangEditorValue="getWangEditorValue"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="width: 100%; text-align: center">
          <el-button @click="editFlag = false" align="items-center"
            >取 消</el-button
          >
          <el-button type="primary" @click="onSubmit()">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss"></style>
