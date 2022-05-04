import { defineStore } from "pinia";
import { store } from "/@/store";
import { queryQuarantineAndContact } from "/@/api/echart";
import { storageSession } from "/@/utils/storage";
export const useEchartStore = defineStore({
  id: "pure-echart",
  state: () => ({
    quarantineNum: null,
    contactNum: null
  }),
  actions: {
    // 查询当前隔离人数和密接人数
    async QUERY_QUARANTINE_AND_CONTACT() {
      return new Promise<void>((resolve, reject) => {
        queryQuarantineAndContact()
          .then(res => {
            console.log(
              "%c [ res ]-17",
              "font-size:13px; background:pink; color:#bf2c9f;",
              res
            );
            this.quarantineNum = res?.data?.quarantineNum;
            this.contactNum = res?.data?.contactNum;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useEchartStoreHook() {
  return useEchartStore(store);
}
