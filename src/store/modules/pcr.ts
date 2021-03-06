import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  findPcrs,
  createPcr,
  editPcr,
  pcrDelete,
  findPcrsWithCid
} from "/@/api/pcr";
import { useRoleStoreHook } from "./role";
import { storageSession } from "/@/utils/storage";
export const usePcrStore = defineStore({
  id: "pure-pcr",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: []
  }),
  actions: {
    // 查找用户姓名对应所有pcr检测记录
    async FIND_PCRS(params: object) {
      return new Promise<void>((resolve, reject) => {
        useRoleStoreHook()
          .GET_CUR_ROLE(storageSession.getItem("info")?.id)
          .then(role => {
            // 若为管理员，则获取当前管理员所在小区的所有用户
            if (Number(role) === 1) {
              const param = {
                ...params,
                cid: storageSession.getItem("info")?.cid
              };
              findPcrsWithCid(param).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员，则获取所有用户
              findPcrs(params).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 添加pcr检测记录
    async PCR_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        createPcr(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 编辑pcr检测记录
    async PCR_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        editPcr(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 删除pcr检测记录
    async DELETE_PCR(param: object) {
      return new Promise<void>((resolve, reject) => {
        pcrDelete(param)
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

export function usePcrStoreHook() {
  return usePcrStore(store);
}
