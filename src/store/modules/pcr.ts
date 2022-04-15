import { defineStore } from "pinia";
import { store } from "/@/store";
import { findPcrs, createPcr, editPcr, pcrDelete } from "/@/api/pcr";
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
        findPcrs(params)
          .then((res: any) => {
            if (res) {
              this.pageData = res?.data?.records;
              this.total = res?.data?.total;
            }
            console.log(
              "%c [ res ]-44",
              "font-size:13px; background:pink; color:#bf2c9f;",
              res
            );
            resolve(res);
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
