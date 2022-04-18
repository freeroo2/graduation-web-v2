<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import { FormInstance } from "element-plus";
import { errorMessage, successMessage } from "/@/utils/message";
import report2 from "/@/assets/report2.png";
import done from "/@/assets/done.png";
import { useReportStoreHook } from "/@/store/modules/report";
import { storageSession } from "/@/utils/storage";
onBeforeMount(() => {
  fetchData();
});
async function fetchData() {
  await reportStore
    .IS_CHECKED({ id: storageSession.getItem("info").id })
    .then((res: any) => {
      isChecked.value = res?.isChecked;
      console.log(
        "%c [ res?.isChecked ]-15",
        "font-size:13px; background:pink; color:#bf2c9f;",
        res?.isChecked
      );
    });
  loading.value = true;
  await reportStore
    .FIND_LIST({ id: storageSession.getItem("info").id })
    .then(() => {
      loading.value = false;
      console.log(
        "%c [ reportStore.myChecks ]-28",
        "font-size:13px; background:pink; color:#bf2c9f;",
        reportStore.myChecks
      );
    });
}
const loading = ref(true);
const isChecked = ref(false);
const activeKey = ref(1);
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
const reportStore = useReportStoreHook();
const form = reactive({
  uid: null,
  contactFlag: false,
  passbyFlag: false,
  takeFlag: false,
  cough: false,
  fever: false,
  tired: false,
  hardBreath: false,
  pubTime: null,
  note: null
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      form.uid = storageSession.getItem("info").id;
      reportStore.REPORT_CREATE(form).then(() => {
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
      ><template #header> 健康打卡 </template>
      <Tabs
        v-model:activeKey="activeKey"
        tab-position="top"
        :style="{ height: 'auto', margin: '20px' }"
        ><TabPane :key="1" tab="健康打卡">
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
              <div style="margin-bottom: 50px; font-size: 16px">
                <p>
                  目前全国多地区发现新型冠状病毒感染病例，国家卫健委将其纳入乙类传染病并按甲类防控。
                </p>
                <p>
                  为做好新型冠状病毒的防控工作，请各位配合做好健康情况统计，
                  <span style="color: red">每天12点前填好身体健康情况。</span>
                </p>
                <p>祝各位及家人身体健康！</p>
              </div>
              <div v-show="!isChecked">
                <el-card
                  style="height: auto; width: auto"
                  shadow="hover"
                  class="formCard"
                >
                  <template #header>
                    <div>
                      <img :src="report2" class="reportIMG" />
                    </div>
                  </template>
                  <div style="text-align: center">
                    <el-form ref="ruleFormRef" :model="form" label-width="auto">
                      <el-row :gutter="24" style="margin-top: 50px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="22">
                          <el-form-item
                            label="是否接触中高风险地区人员"
                            class="form_item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.contactFlag"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.contactFlag"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="是否途径中高风险地区"
                            class="item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.passbyFlag"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.passbyFlag"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="是否乘坐飞机、火车等长途交通工具"
                            class="item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.takeFlag"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.takeFlag"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="咳嗽"
                            prop="cough"
                            class="item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.cough"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.cough"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="发热"
                            prop="fever"
                            class="item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.fever"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.fever"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="乏力"
                            prop="tired"
                            class="item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.tired"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.tired"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="呼吸困难"
                            prop="hardBreath"
                            class="item"
                            required
                          >
                            <div style="margin-left: 24px">
                              <el-radio
                                v-model="form.hardBreath"
                                :label="false"
                                size="default"
                                >否</el-radio
                              >
                              <el-radio
                                v-model="form.hardBreath"
                                :label="true"
                                size="default"
                                >是</el-radio
                              >
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="填写日期"
                            prop="pubTime"
                            class="item"
                            required
                          >
                            <el-date-picker
                              v-model="form.pubTime"
                              type="datetime"
                              placeholder="请选择时间"
                              :shortcuts="shortcuts"
                              format="YYYY-MM-DD hh:mm:ss"
                              value-format="YYYY-MM-DD hh:mm:ss"
                              style="margin-left: 24px"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-row :gutter="24" style="margin-top: 30px">
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" />
                        <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                          <el-form-item
                            label="其他情况说明"
                            prop="note"
                            class="item"
                          >
                            <el-input
                              v-model="form.note"
                              :rows="4"
                              type="textarea"
                              placeholder=""
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row> <el-divider /></el-row>
                      <el-form-item>
                        <div style="margin-left: 10%; margin-top: 30px">
                          <el-button
                            type="primary"
                            @click="submitForm(ruleFormRef)"
                            >打卡</el-button
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
          <div v-show="isChecked">
            <el-row :gutter="24" style="margin: 20px">
              <el-col
                :xs="24"
                :sm="24"
                :md="12"
                :lg="12"
                :xl="12"
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
                <el-card shadow="never" style="height: 500px">
                  <template #header>
                    <div style="font-size: 16px; color: green; margin: 0 auto">
                      您今日已经填写过健康情况
                    </div>
                  </template>
                  <div
                    v-show="isChecked"
                    style="width: 50%; height: auto; margin: 10% auto"
                  >
                    <img :src="done" class="doneIMG" />
                  </div>
                </el-card>
              </el-col>
              <el-col
                :xs="24"
                :sm="24"
                :md="12"
                :lg="12"
                :xl="12"
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
                ><el-card shadow="hover" style="height: 500px">
                  <template #header
                    ><div style="font-size: 16px">我的打卡记录</div>
                  </template>
                  <el-scrollbar height="400px">
                    <div
                      v-for="item in reportStore.myChecks"
                      :key="item.id"
                      class="mychecks_item"
                    >
                      <el-row :gutter="100">
                        <el-col
                          :xs="24"
                          :sm="24"
                          :md="24"
                          :lg="24"
                          :xl="24"
                          style="margin-left: 24px"
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
                          ><div>已打卡：是</div></el-col
                        >
                        <el-col
                          :xs="14"
                          :sm="14"
                          :md="14"
                          :lg="14"
                          :xl="14"
                          style="margin-left: 24px"
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
                          >{{ item.pubTime }}</el-col
                        >
                      </el-row>
                    </div>
                  </el-scrollbar>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </TabPane>
      </Tabs>
    </el-card>
  </div>
</template>
<style scoped>
.reportIMG {
  height: 350px;
  width: 100%;
}
.formCard :deep() .el-card__header {
  padding: 0;
}
.formCard :deep() .el-card__body {
  padding: 0;
}
.mychecks_item {
  display: flex;
  height: 50px;
  width: 100%;
  margin: 10px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
