<script setup lang="ts">
import { ref } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { storageSession } from "/@/utils/storage";
const userStore = useUserStoreHook();
const lists = ref([
  { type: "", label: "善良" },
  { type: "success", label: "好学" },
  { type: "info", label: "幽默" },
  { type: "danger", label: "旅游" },
  { type: "warning", label: "追剧" }
]);
// 角色格式化显示
const formatGender = (value: any) => {
  if (value === 1) {
    return "男";
  } else if (value === 2) {
    return "女";
  } else return "未知";
};
</script>

<template>
  <el-descriptions class="margin-top" direction="vertical" :column="3" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="user" />
        </el-icon>
        姓名
      </template>
      {{ storageSession.getItem("info").nickName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="notebook" />
        </el-icon>
        性别
      </template>
      {{ formatGender(storageSession.getItem("info").gender) }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="notebook" />
        </el-icon>
        年龄
      </template>
      {{ storageSession.getItem("info").age }}
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions class="margin-top" direction="vertical" :column="3" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="iphone" />
        </el-icon>
        手机号
      </template>
      {{ storageSession.getItem("info").phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="location" />
        </el-icon>
        居住地
      </template>
      {{ storageSession.getItem("info").address }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-tag {
  margin-right: 10px !important;
}
</style>
