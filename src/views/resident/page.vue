<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import type { VNode, VNodeProps } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { FormInstance } from "element-plus";
import { errorMessage, successMessage } from "/@/utils/message";
import { useVaccineStoreHook } from "/@/store/modules/vaccine";
import pcr from "/@/assets/pcr.png";
import vaccine2 from "/@/assets/vaccine2.png";
import { usePcrStoreHook } from "/@/store/modules/pcr";
const activeKey = ref(1);
const callback = (val: string) => {
  console.log(val);
};
const tabClick = (tab: VNodeProps) => {
  if (tab === 3) {
    console.log(
      "%c [ tableData1 ]-28",
      "font-size:13px; background:pink; color:#bf2c9f;",
      tableData1.value
    );
  }
  loading.value = false;
};
interface Option {
  key: number;
  label: string;
  disabled: boolean;
}

const userStore = useUserStoreHook();
const vaccineStore = useVaccineStoreHook();
const pcrStore = usePcrStoreHook();
const data = ref([] as Option[]);
const rightValue = ref([] as any[]);
const rightValue2 = ref([] as any[]);
const tableData1 = ref([] as any[]);
const tableData2 = ref([] as any[]);
const showHeader = ref(false);
const loading = ref(true);
const options = reactive([]);
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const form = reactive({
  id: null,
  uid: null,
  cid: null,
  type: null,
  result: null,
  testTime: null,
  resultTime: null,
  mydescription: null,
  nickName: null,
  address: null
});
const rules = reactive({
  uid: [{ required: true, message: "请选择居民", trigger: "change" }],
  result: [
    {
      required: true,
      message: "请选择结果",
      trigger: "change"
    }
  ],
  testTime: [
    {
      type: "date",
      required: true,
      message: "请选择采样时间",
      trigger: "change"
    }
  ],
  resultTime: [
    {
      type: "date",
      required: true,
      message: "请选择检测时间",
      trigger: "change"
    }
  ],
  type: [
    {
      required: true,
      message: "请选择采样方式",
      trigger: "change"
    }
  ]
});

const vaccineForm = reactive({
  uid: null,
  vid: null,
  vaccineTime: null,
  mydescription: null
});
const vaccineRules = reactive({
  uid: [{ required: true, message: "请选择居民", trigger: "change" }],
  vaccineTime: [
    {
      type: "date",
      required: true,
      message: "请选择接种日期",
      trigger: "change"
    }
  ],
  vid: [
    {
      required: true,
      message: "请选择疫苗种类",
      trigger: "change"
    }
  ],
  mydescription: [
    {
      required: true,
      message: "请输入备注信息",
      trigger: "change"
    }
  ]
});
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

onBeforeMount(() => {
  fetchResidents().then(() => {
    loading.value = false;
    generateData();
    initRightValue();
    initRightValue2();
    initOptions();
    initVaccineTypes();
  });
});
onMounted(() => {});
console.log(
  "%c [ options ]-56",
  "font-size:13px; background:pink; color:#bf2c9f;",
  options
);
// 根据用户id删除数组中相应的数据
function arrayDeleteById(arr: any[], id: number | string) {
  const index = arr.findIndex(item => item.id === Number(id));
  if (index > -1) {
    arr.splice(index, 1);
  }
  console.log(
    "%c [ arr ]-41",
    "font-size:13px; background:pink; color:#bf2c9f;",
    index
  );
}

async function fetchResidents() {
  await userStore.FIND_RESIDENTS_TO_ARRAY();
}
function generateData() {
  console.log(
    "%c [ userStore.residents ]-180",
    "font-size:13px; background:pink; color:#bf2c9f;",
    userStore.residents
  );
  userStore.residents.forEach(item => {
    data.value.push({
      key: item?.id,
      label: `${item?.address}---${item?.nickName}`,
      disabled: false
    });
  });
}

function initRightValue() {
  tableData1.value = [];
  for (let i = 0; i <= userStore.residents.length; i++) {
    if (userStore.residents[i]?.quarantine === true) {
      rightValue.value.push(userStore.residents[i]?.id);
      const index = tableData1.value.indexOf(
        item => item.id === userStore.residents[i]?.id
      );
      if (index <= -1) {
        tableData1.value.push(userStore.residents[i]);
      }
    }
  }
}
function initRightValue2() {
  tableData2.value = [];
  for (let i = 0; i <= userStore.residents.length; i++) {
    if (userStore.residents[i]?.contact === true) {
      rightValue2.value.push(userStore.residents[i]?.id);
      const index = tableData2.value.indexOf(
        item => item.id === userStore.residents[i]?.id
      );
      if (index <= -1) {
        tableData2.value.push(userStore.residents[i]);
      }
    }
  }
}
function initOptions() {
  userStore.residents.forEach(item => {
    options.push({
      $value: item?.id,
      label: `${item?.address}---${item?.nickName}`
    });
  });
}

const handleChange = (
  value: number | string,
  direction: "left" | "right",
  movedKeys: string[] | number[]
) => {
  console.log(value, direction, movedKeys);

  let params = {
    ids: movedKeys
  };
  if (direction === "left") {
    userStore.END_QUARANTINE(params).then(() => {
      for (let i = 0; i < movedKeys.length; i++) {
        arrayDeleteById(tableData1.value, movedKeys[i]);
        console.log(
          "%c 删除了[ movedKeys[i] ]-108",
          "font-size:13px; background:pink; color:#bf2c9f;",
          movedKeys[i]
        );
      }
      //fetchResidents();
    });
  } else {
    userStore.BEGIN_QUARANTINE(params).then(() => {
      for (let i = 0; i < movedKeys.length; i++) {
        const index = userStore.residents.findIndex(
          item => item.id === movedKeys[i]
        );
        tableData1.value.push(userStore.residents[index]);
        console.log(
          "%c 添加了[ movedKeys[i] ]-108",
          "font-size:13px; background:pink; color:#bf2c9f;",
          movedKeys[i]
        );
      }
    });
  }
};
const handleChange2 = (
  value: number | string,
  direction: "left" | "right",
  movedKeys: string[] | number[]
) => {
  console.log(value, direction, movedKeys);

  let params = {
    ids: movedKeys
  };
  if (direction === "left") {
    userStore.END_CONTACT(params);
    for (let i = 0; i < movedKeys.length; i++) {
      arrayDeleteById(tableData2.value, movedKeys[i]);
      console.log(
        "%c 删除了[ movedKeys[i] ]-108",
        "font-size:13px; background:pink; color:#bf2c9f;",
        movedKeys[i]
      );
    }
  } else {
    userStore.BEGIN_CONTACT(params).then(() => {
      for (let i = 0; i < movedKeys.length; i++) {
        const index = userStore.residents.findIndex(
          item => item.id === movedKeys[i]
        );
        tableData2.value.push(userStore.residents[index]);
        console.log(
          "%c 添加了[ movedKeys[i] ]-108",
          "font-size:13px; background:pink; color:#bf2c9f;",
          movedKeys[i]
        );
      }
    });
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(
        "%c [ form ]-271",
        "font-size:13px; background:pink; color:#bf2c9f;",
        form
      );
      pcrStore.PCR_CREATE(form).then(() => {
        ruleFormRef.value.resetFields();
        //TODO fetchPcrs();
        successMessage("提交成功");
      });
    } else {
      console.log("error submit!", fields);
      errorMessage("提交失败");
    }
  });
};
const submitForm2 = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(
        "%c [ vaccineForm ]-320",
        "font-size:13px; background:pink; color:#bf2c9f;",
        vaccineForm
      );
      vaccineStore
        .ADD_VACCINE_RECORD(vaccineForm)
        .then(() => {
          ruleFormRef2.value.resetFields();
          //TODO fetchVaccineRecords();
          successMessage("提交成功");
        })
        .catch(() => {
          errorMessage("提交失败");
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

function initVaccineTypes() {
  vaccineStore.GET_VACCINES().then(() => {
    console.log(
      "%c [ vaccineStore.vaccines ]-335",
      "font-size:13px; background:pink; color:#bf2c9f;",
      vaccineStore.vaccines
    );
  });
}
// 根据单选框所选的用户来给表单的nickName和address赋值
function handleSelectChange(value) {
  // 获取当前单选框所选项的下标idx
  let idx = options.findIndex(item => {
    return item.$value == value;
  });
  console.log(
    "%c [ idx ]-359",
    "font-size:13px; background:pink; color:#bf2c9f;",
    userStore.residents[idx]
  );
  if (idx > -1) {
    form.nickName = userStore.residents[idx].nickName;
    form.address = userStore.residents[idx].address;
    form.cid = userStore.residents[idx].cid;
  }
}
</script>

<template>
  <el-card style="height: auto">
    <template #header> 防疫信息统计 </template>
    <span>由防疫工作人员负责统计填报居民防疫信息。</span>
    <Tabs
      v-model:activeKey="activeKey"
      tab-position="top"
      :style="{ height: 'auto', margin: '20px' }"
      @tabScroll="callback"
      @tabClick="tabClick"
    >
      <TabPane :key="1" tab="核酸与疫苗">
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
                <span style="font-size: 16px; font-weight: 500">核酸登记</span>
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
                        label="核酸检测结果"
                        prop="result"
                        style="width: 50%"
                        class="form_item"
                      >
                        <el-radio v-model="form.result" label="false"
                          >阴性</el-radio
                        >
                        <el-radio v-model="form.result" label="true"
                          >阳性</el-radio
                        >
                      </el-form-item>
                      <el-form-item
                        label="采样方式"
                        prop="type"
                        class="form_item"
                      >
                        <el-radio v-model="form.type" label="true"
                          >口咽拭子</el-radio
                        >
                        <el-radio v-model="form.type" label="false"
                          >鼻咽拭子</el-radio
                        >
                      </el-form-item>
                      <el-form-item
                        label="采样时间"
                        prop="testTime"
                        style="width: auto"
                        class="form_item"
                      >
                        <div class="block">
                          <el-date-picker
                            v-model="form.testTime"
                            type="datetime"
                            placeholder="请选择时间"
                            :shortcuts="shortcuts"
                            format="YYYY-MM-DD hh:mm:ss"
                            value-format="YYYY-MM-DD hh:mm:ss"
                          />
                        </div>
                      </el-form-item>
                      <el-form-item
                        label="检测时间"
                        prop="resultTime"
                        class="form_item"
                      >
                        <div class="block">
                          <el-date-picker
                            v-model="form.resultTime"
                            type="datetime"
                            placeholder="请选择时间"
                            :shortcuts="shortcuts"
                            format="YYYY-MM-DD hh:mm:ss"
                            value-format="YYYY-MM-DD hh:mm:ss"
                          />
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-rol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <img :src="pcr" class="vaccineIMG" />
                    </el-rol>
                  </el-row>
                  <el-form-item
                    label="备注"
                    class="form_item"
                    prop="mydescription"
                    style="width: 80%"
                  >
                    <el-input
                      v-model="form.mydescription"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                    />
                  </el-form-item>
                  <el-form-item>
                    <div style="margin-left: 30%">
                      <el-button type="primary" @click="submitForm(ruleFormRef)"
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
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" />
        </el-row>
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
                  >疫苗接种登记</span
                >
              </template>
              <div style="text-align: center">
                <div style="text-align: center">
                  <el-form
                    ref="ruleFormRef2"
                    :model="vaccineForm"
                    :rules="vaccineRules"
                    label-width="120px"
                  >
                    <!-- todo -->
                    <el-row :gutter="24">
                      <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                        <el-form-item
                          label="选择居民"
                          prop="uid"
                          class="form_item"
                          ><el-select
                            v-model="vaccineForm.uid"
                            placeholder="请选择居民"
                            align="center"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.$value"
                              :label="item.label"
                              :value="item.$value"
                            /> </el-select
                        ></el-form-item>
                        <el-form-item
                          label="疫苗种类"
                          prop="vid"
                          class="form_item"
                        >
                          <el-select
                            v-model="vaccineForm.vid"
                            clearable
                            placeholder="请选择疫苗种类"
                          >
                            <el-option
                              v-for="item in vaccineStore.vaccines"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="接种日期"
                          prop="vaccineTime"
                          style="width: auto"
                          class="form_item"
                        >
                          <div class="block">
                            <!-- <el-date-picker
                          v-model="vaccineForm.vaccineTime"
                          type="date"
                          placeholder="请选择时间"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD hh:mm:ss"
                          :shortcuts="shortcuts"
                        /> -->
                            <el-date-picker
                              v-model="vaccineForm.vaccineTime"
                              type="datetime"
                              placeholder="请选择时间"
                              :shortcuts="shortcuts"
                              format="YYYY-MM-DD"
                              value-format="YYYY-MM-DD"
                            />
                          </div>
                        </el-form-item>
                      </el-col>
                      <el-rol :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <img :src="vaccine2" class="vaccineIMG" />
                      </el-rol>
                    </el-row>
                    <el-row style="padding: 0%">
                      <el-form-item
                        label="备注"
                        class="form_item"
                        prop="mydescription"
                        style="width: 80%"
                      >
                        <el-input
                          v-model="vaccineForm.mydescription"
                          type="textarea"
                          :autosize="{ minRows: 3, maxRows: 6 }"
                          placeholder="至少描述接种剂次和身体反映情况等"
                        />
                      </el-form-item>
                    </el-row>
                    <el-form-item>
                      <div style="margin-left: 27%">
                        <el-button
                          type="primary"
                          @click="submitForm2(ruleFormRef2)"
                          >创建</el-button
                        >
                        <el-button @click="resetForm(ruleFormRef2)"
                          >重置</el-button
                        >
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" />
        </el-row>
      </TabPane>
      <TabPane :key="2" tab="隔离与密接">
        <el-row :gutter="24" style="margin: 20px">
          <el-col
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
            style="margin-bottom: 20px"
          />
          <el-col
            :xs="24"
            :sm="24"
            :md="20"
            :lg="20"
            :xl="20"
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
                <span style="font-size: 16px; font-weight: 500">隔离人员</span>
              </template>
              <div style="text-align: center">
                <el-transfer
                  v-model="rightValue"
                  style="text-align: left; display: inline-block"
                  filterable
                  filter-placeholder="请输入姓名"
                  :titles="['正常居民', '隔离居民']"
                  :button-texts="['移出隔离', '加入隔离']"
                  :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                  }"
                  :data="data"
                  @change="handleChange"
                >
                  <template #default="{ option }">
                    <span>{{ option.label }}</span>
                  </template>
                  <template #left-footer><span /></template>
                  <template #right-footer>
                    <span />
                  </template>
                </el-transfer>
              </div>
            </el-card>
          </el-col>
          <el-col
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
            style="margin-bottom: 20px"
          />
        </el-row>
        <el-row :gutter="24" style="margin: 20px">
          <el-col
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
            style="margin-bottom: 20px"
          />
          <el-col
            :xs="24"
            :sm="24"
            :md="20"
            :lg="20"
            :xl="20"
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
                  >密切接触者</span
                >
              </template>
              <div style="text-align: center">
                <el-transfer
                  v-model="rightValue2"
                  style="text-align: left; display: inline-block"
                  filterable
                  filter-placeholder="请输入姓名"
                  :titles="['正常居民', '密切接触者']"
                  :button-texts="['移出密接', '加入密接']"
                  :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                  }"
                  :data="data"
                  @change="handleChange2"
                >
                  <template #default="{ option }">
                    <span>{{ option.label }}</span>
                  </template>
                  <template #left-footer><span /></template>
                  <template #right-footer>
                    <span />
                  </template>
                </el-transfer>
              </div>
            </el-card>
          </el-col>
          <el-col
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
            style="margin-bottom: 20px"
          />
        </el-row>
      </TabPane>

      <TabPane :key="3" tab="名单"
        ><el-row :gutter="24" style="margin: 20px">
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
            <el-card style="height: auto; width: auto" shadow="hover">
              <template #header>
                <span style="font-size: 16px; font-weight: 500">隔离名单</span>
              </template>
              <el-table
                :data="tableData1"
                style="width: 100%; height: 400px"
                max-height="400"
                :show-header="showHeader"
                align="center"
                v-loading="loading"
              >
                <el-table-column prop="address" label="地址" width="180" />
                <el-table-column prop="nickName" label="姓名" width="120" />
                <el-table-column
                  prop="quarantineBeginTime"
                  label="开始隔离时间"
                  width="180"
                />
              </el-table>
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
          >
            <el-card style="height: auto; width: auto" shadow="hover">
              <template #header>
                <span style="font-size: 16px; font-weight: 500">密接名单</span>
              </template>
              <div style="text-align: center">
                <el-table
                  :data="tableData2"
                  style="width: 100%; height: 400px"
                  max-height="400"
                  :show-header="showHeader"
                  align="center"
                  v-loading="loading"
                >
                  <el-table-column prop="address" label="地址" width="180" />
                  <el-table-column prop="nickName" label="姓名" width="120" />
                  <el-table-column
                    prop="contactBeginTime"
                    label="开始密接时间"
                    width="180"
                  />
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </TabPane>
    </Tabs>
  </el-card>
</template>
<style lang="scss">
.el-transfer-panel {
  width: 300px !important;
}
.select_cid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #fff;
  width: 100%;
}
.form_item .el-form-item__label {
  font-size: 14px;
  font-weight: bold;
  //color: #4ea5ff;
}
.vaccineIMG {
  width: 220px;
  height: auto;
  display: block;
  margin: 0 auto;
  margin-left: auto;
  margin-bottom: 10%;
  float: right;
}
</style>
