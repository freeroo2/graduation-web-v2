<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { initRouter } from "/@/router/utils";
import { storageSession } from "/@/utils/storage";
import { addClass, removeClass } from "/@/utils/operate";
import bg from "/@/assets/login/bg.png";
import avatar from "/@/assets/login/avatar.svg?component";
import illustration from "/@/assets/login/illustration.svg?component";
import { useUserStoreHook } from "../store/modules/user";
import { useRoleStoreHook } from "../store/modules/role";

const router = useRouter();

let user = ref("admin");
let pwd = ref("123456");

function getCurRole(id: number) {
  useRoleStoreHook()
    .GET_CUR_ROLE(id)
    .then(res => {
      console.log(
        "%c [ res ]-23",
        "font-size:13px; background:pink; color:#bf2c9f;",
        res
      );
      storageSession.setItem("role", {
        role: res
      });
    });
}

const onLogin = (): void => {
  // storageSession.setItem("info", {
  //   username: "admin",
  //   accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
  // });
  let data = reactive({
    username: user.value,
    password: pwd.value
  });
  useUserStoreHook()
    .loginByUsername(data)
    .then(() => {
      console.log("登录成功");
      initRouter(useUserStoreHook().id).then(() => {});
      getCurRole(useUserStoreHook().id);
      router.push("/");
    })
    .catch(() => {
      console.log("登录失败");
    });
};

function onUserFocus() {
  addClass(document.querySelector(".user"), "focus");
}

function onUserBlur() {
  if (user.value.length === 0)
    removeClass(document.querySelector(".user"), "focus");
}

function onPwdFocus() {
  addClass(document.querySelector(".pwd"), "focus");
}

function onPwdBlur() {
  if (pwd.value.length === 0)
    removeClass(document.querySelector(".pwd"), "focus");
}
</script>

<template>
  <img :src="bg" class="wave" />
  <div class="login-container">
    <div class="img">
      <illustration />
    </div>
    <div class="login-box">
      <div class="login-form">
        <avatar class="avatar" />
        <h2
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 100
            }
          }"
        >
          COVID-19 PREVENTION
        </h2>
        <div
          class="input-group user focus"
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
          <div class="icon">
            <IconifyIconOffline icon="fa-user" width="14" height="14" />
          </div>
          <div>
            <h5>用户名</h5>
            <input
              type="text"
              class="input"
              v-model="user"
              @focus="onUserFocus"
              @blur="onUserBlur"
            />
          </div>
        </div>
        <div
          class="input-group pwd focus"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 300
            }
          }"
        >
          <div class="icon">
            <IconifyIconOffline icon="fa-lock" width="14" height="14" />
          </div>
          <div>
            <h5>密码</h5>
            <input
              type="password"
              class="input"
              v-model="pwd"
              @focus="onPwdFocus"
              @blur="onPwdBlur"
            />
          </div>
        </div>
        <button
          class="btn"
          v-motion
          :initial="{
            opacity: 0,
            y: 10
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 400
            }
          }"
          @click="onLogin"
        >
          登录
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");
</style>
