<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import { useDailyStoreHook } from "/@/store/modules/daily";
import { FormInstance } from "element-plus";
import { formatDates } from "/@/utils/formatDate";
import { errorMessage, successMessage } from "/@/utils/message";
import daily1 from "/@/assets/daily1.png";
import SeamlessScroll from "/@/components/ReSeamlessScroll";
import { templateRef } from "@vueuse/core";
import { useUserStoreHook } from "/@/store/modules/user";
onBeforeMount(() => {
  fetchData();
});
// eslint-disable-next-line no-undef
const scroll = templateRef<ElRef | null>("scroll", null);
let classOption = reactive({
  direction: "top"
});
const activeKey = ref(1);
const options = reactive([]);

const ruleFormRef = ref<FormInstance>();
const dailyStore = useDailyStoreHook();
const userStore = useUserStoreHook();
const form = reactive({
  id: null,
  uid: null,
  cid: null,
  temperature: null,
  recordTime: null,
  tired: null,
  diarrhea: null,
  headache: null,
  note: null
});
// 根据单选框所选的用户来给表单的nickName和address赋值
function handleSelectChange(value) {
  // 获取当前单选框所选项的下标idx
  let idx = options.findIndex(item => {
    return item.$value == value;
  });
  console.log(
    "%c [ idx ]-359",
    "font-size:13px; background:pink; color:#bf2c9f;",
    dailyStore.notChecked[idx]
  );
  if (idx > -1) {
    form.cid = dailyStore.notChecked[idx].cid;
  }
}

var valiNumberPass1 = (rule, value, callback) => {
  //包含小数的数字
  let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
  if (value === "") {
    callback(new Error("请输入内容"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入数字"));
  } else {
    callback();
  }
};
const rules = reactive({
  uid: [{ required: true, message: "请选择居民", trigger: "change" }],
  result: [
    {
      required: true,
      message: "请选择结果",
      trigger: "change"
    }
  ],
  temperature: [
    {
      required: true,
      validator: valiNumberPass1,
      trigger: "change"
    }
  ]
});
async function initNotChecked() {
  await dailyStore.GET_NOT_CHECKED_TODAY();
}
function initOptions() {
  options.splice(0, options.length);
  dailyStore.notChecked.forEach(item => {
    options.push({
      $value: item?.id,
      label: `${item?.address}---${item?.nickName}`
    });
  });
}
function fetchData() {
  initNotChecked().then(() => {
    initOptions();
  });
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      form.recordTime = formatDates(new Date(), "yyyy-MM-dd");
      dailyStore.DAILY_CREATE(form).then(() => {
        ruleFormRef.value.resetFields();
        successMessage("提交成功");
        fetchData();
        console.log(
          "%c [ form ]-271",
          "font-size:13px; background:pink; color:#bf2c9f;",
          form
        );
      });
    } else {
      console.log("error submit!", fields);
      errorMessage("提交失败");
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<template>
  <div>
    <el-card style="height: auto"
      ><template #header> 每日访查 </template>
      <span>由防疫工作人员负责统计填报隔离居民每日健康信息。</span>
      <Tabs
        v-model:activeKey="activeKey"
        tab-position="top"
        :style="{ height: 'auto', margin: '20px' }"
        ><TabPane :key="1" tab="每日访查">
          <el-row :gutter="24" style="margin: 20px">
            <el-col
              :xs="24"
              :sm="24"
              :md="16"
              :lg="16"
              :xl="16"
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
            >
              <el-card style="height: auto; width: auto" shadow="hover">
                <template #header>
                  <span style="font-size: 16px; font-weight: 500"
                    >访查登记</span
                  >
                </template>
                <div style="text-align: center">
                  <el-form
                    ref="ruleFormRef"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                  >
                    <el-row :gutter="24">
                      <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                        <el-form-item
                          label="选择居民"
                          prop="uid"
                          class="form_item"
                          ><el-select
                            v-model="form.uid"
                            placeholder="请选择居民"
                            align="center"
                            @change="handleSelectChange"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.$value"
                              :label="item.label"
                              :value="item.$value"
                            /> </el-select
                        ></el-form-item>
                        <el-form-item
                          label="体温"
                          prop="temperature"
                          style="width: 73%"
                          class="form_item"
                        >
                          <el-input v-model="form.temperature" />
                        </el-form-item>
                        <el-form-item
                          label="是否乏力"
                          prop="tired"
                          class="form_item"
                        >
                          <el-radio v-model="form.tired" label="false"
                            >否</el-radio
                          >
                          <el-radio v-model="form.tired" label="true"
                            >是</el-radio
                          >
                        </el-form-item>
                        <el-form-item
                          label="是否头痛"
                          prop="headache"
                          class="form_item"
                        >
                          <el-radio v-model="form.headache" label="false"
                            >否</el-radio
                          >
                          <el-radio v-model="form.headache" label="true"
                            >是</el-radio
                          >
                        </el-form-item>
                        <el-form-item
                          label="是否腹泻"
                          prop="diarrhea"
                          class="form_item"
                        >
                          <el-radio v-model="form.diarrhea" label="false"
                            >否</el-radio
                          >
                          <el-radio v-model="form.diarrhea" label="true"
                            >是</el-radio
                          >
                        </el-form-item>
                      </el-col>
                      <el-rol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <img :src="daily1" class="IMG" />
                      </el-rol>
                    </el-row>
                    <el-form-item
                      label="备注"
                      class="form_item"
                      prop="mydescription"
                      style="width: 80%"
                    >
                      <el-input
                        v-model="form.note"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                      />
                    </el-form-item>
                    <el-form-item>
                      <div style="margin-left: 27%">
                        <el-button
                          type="primary"
                          @click="submitForm(ruleFormRef)"
                          >创建</el-button
                        >
                        <el-button @click="resetForm(ruleFormRef)"
                          >重置</el-button
                        >
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
              :xl="8"
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
            >
              <el-space wrap>
                <el-card class="box-card" shadow="hover">
                  <template #header>
                    <span>今日未访查</span>
                  </template>
                  <SeamlessScroll
                    ref="scroll"
                    :data="dailyStore.notChecked"
                    :class-option="classOption"
                    class="warp"
                  >
                    <ul class="item">
                      <li
                        v-for="(item, index) in dailyStore.notChecked"
                        :key="index"
                      >
                        <span
                          class="title"
                          v-text="`${item.address} ${item.nickName}`"
                        />
                      </li>
                    </ul>
                  </SeamlessScroll>
                </el-card>
              </el-space>
            </el-col>
          </el-row>
        </TabPane>
      </Tabs>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.IMG {
  width: 200px;
  height: auto;
  display: block;
  margin-right: 10%;
  margin-bottom: 10%;
  float: right;
}
.warp {
  height: 150px;
  width: 300px;
  margin: 0 auto;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;

    li,
    a {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: center;
      font-size: 15px;
    }
  }
}
</style>
