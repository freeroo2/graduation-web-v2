import { defineStore } from "pinia";
import { store } from "/@/store";
import { findCourts } from "/@/api/court";
import { courtsType } from "./types";

export const useCourtStore = defineStore({
  // 唯一ID
  id: "pure-court",
  state: () => ({
    courts: [] as courtsType[],
    nameToId: new Map(),
    idToName: new Map()
  }),
  getters: {},
  actions: {
    // 获取所有小区
    getCourts() {
      return new Promise<void>((resolve, reject) => {
        findCourts()
          .then(res => {
            this.courts = res.data;
            console.log(
              "%c [ res.data.data ]-21",
              "font-size:13px; background:pink; color:#bf2c9f;",
              res.data
            );

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});
export function useCourtStoreHook() {
  return useCourtStore(store);
}
