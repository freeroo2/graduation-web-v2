import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import {
  getLogin,
  refreshToken,
  findManagers,
  createManager,
  editManager,
  userDelete,
  managerCancle
} from "/@/api/user";
import { storageLocal, storageSession } from "/@/utils/storage";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const data = getToken();
let token = "";
let name = "";
let nickName = "";
let cid = null;
let id = null;
// let age = null;
// let phone = "";
// let address = "";
// let gender = null;
let status = null;
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    id = dataJson?.id;
    token = dataJson?.accessToken;
    name = dataJson?.name ?? "admin";
    nickName = dataJson?.nickName ?? "admin";
    cid = dataJson?.cid;
    status = dataJson?.status;
  }
}

type paramsMapType = {
  code: number;
  msg: string;
  data: any;
};

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    id,
    token,
    name,
    nickName,
    cid,
    // age,
    // gender,
    // phone,
    // address,
    status,
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: []
  }),
  actions: {
    SET_ID(id) {
      this.id = id;
    },
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(name) {
      this.name = name;
    },
    SET_NICKNAME(nickName) {
      this.nickName = nickName;
    },
    SET_CID(cid) {
      this.cid = cid;
    },
    // SET_AGE(age) {
    //   this.age = age;
    // },
    // SET_GENDER(gender) {
    //   this.gender = gender;
    // },
    // SET_PHONE(phone) {
    //   this.phone = phone;
    // },
    // SET_ADDRESS(address) {
    //   this.address = address;
    // },
    SET_STATUS(status) {
      this.status = status;
    },
    // 登入
    async loginByUsername(data) {
      return new Promise<void>((resolve, reject) => {
        getLogin(data)
          .then((backdata: paramsMapType) => {
            if (backdata) {
              const { data } = backdata;
              console.log(
                "%c [ data ]-91",
                "font-size:13px; background:pink; color:#bf2c9f;",
                data
              );

              setToken(data);
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出 清空缓存
    logOut() {
      this.token = "";
      this.name = "";
      removeToken();
      storageLocal.clear();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "首页",
            icon: "home-filled"
          }
        }
      ]);
      router.push("/login");
    },
    // 刷新token
    async refreshToken(data) {
      return refreshToken(data).then(data => {
        if (data) {
          setToken(data);
          return data;
        }
      });
    },
    async FIND_MANAGERS(params: object) {
      return new Promise<void>((resolve, reject) => {
        findManagers(params)
          .then((res: any) => {
            if (res) {
              this.pageData = res?.data?.records;
              this.total = res?.data?.total;
            }
            // console.log(
            //   "%c [ res ]-44",
            //   "font-size:13px; background:pink; color:#bf2c9f;",
            //   res
            // );
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async MANAGER_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        createManager(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async MANAGER_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        editManager(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async DELETE_USER(param: object) {
      return new Promise<void>((resolve, reject) => {
        userDelete(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async MANAGER_CANCLE(param: object) {
      return new Promise<void>((resolve, reject) => {
        managerCancle(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
