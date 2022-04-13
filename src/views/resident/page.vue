<script setup lang="ts">
import { reactive, ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";
import type { VNode, VNodeProps } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
const activeKey = ref(1);
const callback = (val: string) => {
  console.log(val);
};
const tabClick = (tab: VNodeProps) => {
  if (tab === 2) {
    //calTableData();
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

const data = ref([] as Option[]);
const residents = ref([] as any[]);
const rightValue = ref([] as any[]);
const rightValue2 = ref([] as any[]);
const tableData1 = ref([] as any[]);
const tableData2 = ref([] as any[]);
const showHeader = ref(false);
const loading = ref(true);

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
  await useUserStoreHook()
    .FIND_RESIDENTS_TO_ARRAY()
    .then(res => {
      residents.value = res;
      console.log(residents.value);
    });
}
function generateData() {
  fetchResidents().then(() => {
    residents.value.forEach(item => {
      // console.log(
      //   "%c [ item ]-21",
      //   "font-size:13px; background:pink; color:#bf2c9f;",
      //   item
      // );
      data.value.push({
        key: item?.id,
        label: `${item?.address}---${item?.nickName}`,
        disabled: false
      });
    });
  });
  // console.log(
  //   "%c [ data ]-65",
  //   "font-size:13px; background:pink; color:#bf2c9f;",
  //   data
  // );
}

function initRightValue() {
  tableData1.value = [];
  fetchResidents().then(() => {
    for (let i = 0; i <= residents.value.length; i++) {
      if (residents.value[i]?.quarantine === true) {
        rightValue.value.push(residents.value[i]?.id);
        const index = tableData1.value.indexOf(
          item => item.id === residents.value[i]?.id
        );
        if (index <= -1) {
          tableData1.value.push(residents.value[i]);
        }
      }
    }
  });
}
function initRightValue2() {
  tableData2.value = [];
  fetchResidents().then(() => {
    for (let i = 0; i <= residents.value.length; i++) {
      if (residents.value[i]?.contact === true) {
        rightValue2.value.push(residents.value[i]?.id);
        const index = tableData2.value.indexOf(
          item => item.id === residents.value[i]?.id
        );
        if (index <= -1) {
          tableData2.value.push(residents.value[i]);
        }
      }
    }
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
    useUserStoreHook()
      .END_QUARANTINE(params)
      .then(() => {
        for (let i = 0; i < movedKeys.length; i++) {
          arrayDeleteById(tableData1.value, movedKeys[i]);
          console.log(
            "%c 删除了[ movedKeys[i] ]-108",
            "font-size:13px; background:pink; color:#bf2c9f;",
            movedKeys[i]
          );
        }
      });
  } else {
    useUserStoreHook()
      .BEGIN_QUARANTINE(params)
      .then(() => {
        fetchResidents().then(() => {
          for (let i = 0; i < movedKeys.length; i++) {
            const index = residents.value.findIndex(
              item => item.id === movedKeys[i]
            );
            tableData1.value.push(residents.value[index]);
            console.log(
              "%c 添加了[ movedKeys[i] ]-108",
              "font-size:13px; background:pink; color:#bf2c9f;",
              movedKeys[i]
            );
          }
        });
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
    useUserStoreHook().END_CONTACT(params);
    for (let i = 0; i < movedKeys.length; i++) {
      arrayDeleteById(tableData2.value, movedKeys[i]);
      console.log(
        "%c 删除了[ movedKeys[i] ]-108",
        "font-size:13px; background:pink; color:#bf2c9f;",
        movedKeys[i]
      );
    }
  } else {
    useUserStoreHook()
      .BEGIN_CONTACT(params)
      .then(() => {
        fetchResidents().then(() => {
          for (let i = 0; i < movedKeys.length; i++) {
            const index = residents.value.findIndex(
              item => item.id === movedKeys[i]
            );
            tableData2.value.push(residents.value[index]);
            console.log(
              "%c 添加了[ movedKeys[i] ]-108",
              "font-size:13px; background:pink; color:#bf2c9f;",
              movedKeys[i]
            );
          }
        });
      });
  }
};
generateData();
initRightValue();
initRightValue2();
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
      <TabPane :key="1" tab="信息填报">
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
                    <span>{{ option.key }} - {{ option.label }}</span>
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
      <TabPane :key="2" tab="信息统计"
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
<style>
.transfer-footer {
  width: 100%;
  height: auto;
}

.el-transfer-panel {
  width: 250px !important;
  height: 400px !important;
}
</style>
