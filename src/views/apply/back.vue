<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import { FormInstance } from "element-plus";
import { errorMessage, successMessage } from "/@/utils/message";
import back1 from "/@/assets/back1.png";
import { EluiChinaAreaDht } from "elui-china-area-dht";
import { useBackStoreHook } from "/@/store/modules/back";
import { storageSession } from "/@/utils/storage";
onBeforeMount(() => {
  fetchData();
});

const isChecked = ref(false);
const activeKey = ref(1);
const shortcuts = [
  {
    text: "明天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "后天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
      return date;
    }
  },
  {
    text: "一周后",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat;
const ruleFormRef = ref<FormInstance>();
const backStore = useBackStoreHook();
const form = reactive({
  uid: null,
  tfrom: null,
  phone: null,
  risk: null,
  tmeans: "",
  backTime: null,
  tseq: ""
});
const rules = reactive({
  tfrom: [{ required: true, message: "请选择出发地", trigger: "change" }],
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
  risk: [
    {
      required: true,
      message: "请确认是否为中高风险地区",
      trigger: "change"
    }
  ],
  tmeans: [
    {
      required: true,
      message: "请提供交通方式",
      trigger: "change"
    }
  ],
  backTime: [
    {
      type: "date",
      required: true,
      message: "请选择返回的时间",
      trigger: "change"
    }
  ]
});
function fetchData() {
  // initNotChecked().then(() => {
  //   initOptions();
  // });
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(
        "%c [ form ]-104",
        "font-size:13px; background:pink; color:#bf2c9f;",
        form
      );
      form.uid = storageSession.getItem("info").id;
      backStore.BACK_CREATE(form).then(() => {
        ruleFormRef.value.resetFields();
        successMessage("提交成功");
        //fetchData();
        console.log(
          "%c [ form ]-271",
          "font-size:13px; background:pink; color:#bf2c9f;",
          form
        );
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
function onChange(e) {
  const one = chinaData[e[0]];
  const two = chinaData[e[1]];
  const three = chinaData[e[2]];
  console.log(one, two, three);
  console.log(one.label + two.label + three.label);
  form.tfrom = one.label + two.label + three.label;
}
</script>
<template>
  <div>
    <el-card style="height: auto"
      ><template #header> 返乡报备 </template>
      <span>请您如实填写返乡报备表</span>
      <Tabs
        v-model:activeKey="activeKey"
        tab-position="top"
        :style="{ height: 'auto', margin: '20px' }"
        ><TabPane :key="1" tab="返乡报备">
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
              <div style="margin-bottom: 48px">
                <el-radio
                  v-model="isChecked"
                  :label="true"
                  size="large"
                  style="font-size: large; margin-left: 220px"
                  >本人保证以下信息如实填写，否则后果自负</el-radio
                >
              </div>
              <div v-show="isChecked">
                <el-card
                  style="height: auto; width: auto"
                  shadow="hover"
                  class="formCard"
                >
                  <template #header>
                    <div>
                      <img :src="back1" class="reportIMG" />
                    </div>
                  </template>
                  <div style="text-align: center">
                    <el-form
                      ref="ruleFormRef"
                      :model="form"
                      :rules="rules"
                      label-width="auto"
                    >
                      <el-row :gutter="24" style="margin-top: 50px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="22">
                          <el-form-item
                            label="出发地"
                            prop="tfrom"
                            class="form_item"
                            ><elui-china-area-dht
                              @change="onChange"
                              size="default"
                              class="elui-china-area-dht"
                              placeholder="请选择当前所在地区"
                          /></el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="是否为中高风险地区"
                            class="form_item"
                            prop="risk"
                            style="width: 80%"
                          >
                            <el-radio
                              v-model="form.risk"
                              :label="false"
                              size="default"
                              >否</el-radio
                            >
                            <el-radio
                              v-model="form.risk"
                              :label="true"
                              size="default"
                              >是</el-radio
                            >
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="联系电话"
                            class="form_item"
                            prop="phone"
                            style="width: 80%"
                          >
                            <el-input
                              v-model="form.phone"
                              placeholder="请输入电话号码"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="预计返回时间"
                            prop="backTime"
                            style="width: auto"
                            class="form_item"
                          >
                            <div class="block">
                              <el-date-picker
                                v-model="form.backTime"
                                type="datetime"
                                placeholder="请选择时间"
                                :shortcuts="shortcuts"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                              />
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="交通方式"
                            class="form_item"
                            prop="tmeans"
                            style="width: 80%"
                          >
                            <el-input
                              v-model="form.tmeans"
                              placeholder="请输入交通方式"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="航班号/列车号(若有)"
                            class="form_item"
                            prop="tseq"
                            style="width: 80%"
                          >
                            <el-input
                              v-model="form.tseq"
                              placeholder="若有请输入航班号/列车号"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-form-item>
                        <div style="margin-left: 25%; margin-top: 30px">
                          <el-button
                            type="primary"
                            @click="submitForm(ruleFormRef)"
                            >提交</el-button
                          >
                          <el-button @click="resetForm(ruleFormRef)"
                            >重置</el-button
                          >
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-card>
              </div>
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
.formCard :deep() .el-card__header {
  padding: 0;
}
.formCard :deep() .el-card__body {
  padding: 0;
}
</style>
