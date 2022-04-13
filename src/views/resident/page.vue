<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import type { VNode, VNodeProps } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
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
const data = ref([] as Option[]);
const rightValue = ref([] as any[]);
const rightValue2 = ref([] as any[]);
const tableData1 = ref([] as any[]);
const tableData2 = ref([] as any[]);
const showHeader = ref(false);
const loading = ref(true);
const options = reactive([]);
const form = reactive({
  id: null,
  uid: null,
  testResult: null,
  testDate: null,
  desc: null
});
const value = ref("");

onBeforeMount(() => {
  fetchResidents().then(() => {
    loading.value = false;
    generateData();
    initRightValue();
    initRightValue2();
    initOptions();
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
const onSubmit = () => {
  console.log("submit!");
};

//function initOpt()
</script>

<template>
  <el-card style="height: auto">
    <template #header> 防疫信息统计 </template>
    <span>由防疫工作人员负责统计填报居民防疫信息</span>
    <Tabs
      v-model:activeKey="activeKey"
      tab-position="top"
      :style="{ height: 'auto', margin: '20px' }"
      @tabScroll="callback"
      @tabClick="tabClick"
    >
      <TabPane :key="1" tab="核酸与疫苗">
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
            <el-card style="height: auto; width: auto" shadow="hover">
              <template #header>
                <span style="font-size: 16px; font-weight: 500">核酸登记</span>
                <el-select
                  v-model="form.uid"
                  placeholder="请选择居民"
                  style="margin-left: 50%: width: auto"
                  align="center"
                  float="right"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.$value"
                    :label="item.label"
                    :value="item.$value"
                  />
                </el-select>
              </template>
              <div style="text-align: center">
                <el-form :model="form" label-width="120px">
                  <el-form-item label="Activity name">
                    <el-input v-model="form.name" />
                  </el-form-item>
                  <el-form-item label="Activity zone">
                    <el-select
                      v-model="form.region"
                      placeholder="please select your zone"
                    >
                      <el-option label="Zone one" value="shanghai" />
                      <el-option label="Zone two" value="beijing" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Activity time">
                    <el-col :span="11">
                      <el-date-picker
                        v-model="form.date1"
                        type="date"
                        placeholder="Pick a date"
                        style="width: 100%"
                      />
                    </el-col>
                    <el-col :span="2" class="text-center">
                      <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                      <el-time-picker
                        v-model="form.date2"
                        placeholder="Pick a time"
                        style="width: 100%"
                      />
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Instant delivery">
                    <el-switch v-model="form.delivery" />
                  </el-form-item>
                  <el-form-item label="Activity type">
                    <el-checkbox-group v-model="form.type">
                      <el-checkbox label="Online activities" name="type" />
                      <el-checkbox label="Promotion activities" name="type" />
                      <el-checkbox label="Offline activities" name="type" />
                      <el-checkbox label="Simple brand exposure" name="type" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="Resources">
                    <el-radio-group v-model="form.resource">
                      <el-radio label="Sponsor" />
                      <el-radio label="Venue" />
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="Activity form">
                    <el-input v-model="form.desc" type="textarea" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit"
                      >Create</el-button
                    >
                    <el-button>Cancel</el-button>
                  </el-form-item>
                </el-form>
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
          >
            <el-card style="height: auto; width: auto" shadow="hover">
              <template #header>
                <span style="font-size: 16px; font-weight: 500"
                  >疫苗接种登记</span
                >
              </template>
              <div style="text-align: center">1111</div>
            </el-card>
          </el-col>
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
                    <!-- <el-button
                      class="transfer-footer"
                      size="large"
                      @click="handleSubmit()"
                      >保存</el-button
                    > -->
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
                    <!-- <el-button
                      class="transfer-footer"
                      size="large"
                      @click="handleSubmit()"
                      >保存</el-button
                    > -->
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

      <TabPane :key="3" tab="信息统计"
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
        <el-row
      /></TabPane>
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
</style>
