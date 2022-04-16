<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import { useDailyStoreHook } from "/@/store/modules/daily";
import { FormInstance } from "element-plus";
import { errorMessage, successMessage } from "/@/utils/message";
import service1 from "/@/assets/service1.png";
import { useServiceStoreHook } from "/@/store/modules/service";
onBeforeMount(() => {
  fetchData();
});

const activeKey = ref(1);
const options = reactive([]);
const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

const ruleFormRef = ref<FormInstance>();
const dailyStore = useDailyStoreHook();
const serviceStore = useServiceStoreHook();
const form = reactive({
  id: null,
  uid: null,
  cid: null,
  address: null,
  nickName: null,
  name: null,
  phone: null,
  content: null,
  serviceTime: null
});
const rules = reactive({
  uid: [{ required: true, message: "请选择居民", trigger: "change" }],
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "change"
    }
  ],
  phone: [
    {
      required: true,
      message: "请输入电话号码",
      trigger: "change"
    },
    {
      min: 11,
      max: 11,
      message: "电话号码必须为11位"
    }
  ],
  content: [
    {
      required: true,
      message: "输入服务内容",
      trigger: "change"
    }
  ],
  serviceTime: [
    {
      type: "date",
      required: true,
      message: "请选择服务的时间",
      trigger: "change"
    }
  ]
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
    dailyStore.allQuarantine[idx]
  );
  if (idx > -1) {
    form.cid = dailyStore.allQuarantine[idx].cid;
    form.address = dailyStore.allQuarantine[idx].address;
    form.nickName = dailyStore.allQuarantine[idx].nickName;
  }
}
async function initNotChecked() {
  await dailyStore.GET_ALL_QUARANTINE();
}
function initOptions() {
  options.splice(0, options.length);
  dailyStore.allQuarantine.forEach(item => {
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
      serviceStore.SERVICE_CREATE(form).then(() => {
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
      ><template #header> 隔离服务 </template>
      <span>由防疫工作人员负责填报隔离居民服务记录。</span>
      <Tabs
        v-model:activeKey="activeKey"
        tab-position="top"
        :style="{ height: 'auto', margin: '20px' }"
        ><TabPane :key="1" tab="隔离服务">
          <el-row :gutter="24" style="margin: 20px">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" />
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
                    >服务登记</span
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
                          label="服务者姓名"
                          class="form_item"
                          prop="name"
                          style="width: 80%"
                        >
                          <el-input
                            v-model="form.name"
                            placeholder="请输入姓名"
                          />
                        </el-form-item>
                        <el-form-item
                          label="服务者电话"
                          class="form_item"
                          prop="phone"
                          style="width: 80%"
                        >
                          <el-input
                            v-model="form.phone"
                            placeholder="请输入电话号码"
                          />
                        </el-form-item>
                        <el-form-item
                          label="服务时间"
                          prop="serviceTime"
                          style="width: auto"
                          class="form_item"
                        >
                          <div class="block">
                            <el-date-picker
                              v-model="form.serviceTime"
                              type="datetime"
                              placeholder="请选择时间"
                              :shortcuts="shortcuts"
                              format="YYYY-MM-DD hh:mm:ss"
                              value-format="YYYY-MM-DD hh:mm:ss"
                            />
                          </div>
                        </el-form-item>
                        <el-form-item
                          label="服务内容"
                          class="form_item"
                          prop="content"
                          style="width: 80%"
                        >
                          <el-input
                            v-model="form.content"
                            :autosize="{ minRows: 3, maxRows: 6 }"
                            placeholder="请输入服务内容"
                            type="textarea"
                          />
                        </el-form-item>
                      </el-col>
                      <el-rol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <img :src="service1" class="IMG" />
                      </el-rol>
                    </el-row>
                    <el-form-item>
                      <div style="margin-left: 30%">
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
              :xs="4"
              :sm="4"
              :md="4"
              :lg="4"
              :xl="4"
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
            />
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
</style>
