import { defineStore } from "pinia";
import { store } from "/@/store";

export const useCourtStore = defineStore({
  // 唯一ID
  id: "pure-court",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    courts: [],
    nameToId: new Map(),
    idToName: new Map()
  }),
  getters: {},
  actions: {
    // // 获取所有小区
    // getCourts() {
    //   return new Promise((resolve, reject) => {
    //     api
    //       .get("/courts", {
    //         params: {
    //           currentPage: this.currentPage,
    //           pageSize: this.pageSize
    //         }
    //       })
    //       .then(res => {
    //         this.total = res.data.data.total;
    //         this.courts = res.data.data.records;
    //         console.log(this.courts);
    //         for (const i in this.courts) {
    //           // console.log(this.courts[i].courtName)
    //           this.nameToId.set(this.courts[i].courtName, this.courts[i].id);
    //           this.idToName.set(this.courts[i].id, this.courts[i].courtName);
    //         }
    //         // for (let [key, value] of this.idToName) {
    //         //     console.log(key + ' = ' + value)
    //         // }
    //         resolve(res.data.data.records);
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // }
  }
});
export function useCourtStoreHook() {
  return useCourtStore(store);
}
