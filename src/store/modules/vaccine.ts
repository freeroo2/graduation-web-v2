import { defineStore } from "pinia";
import { store } from "/@/store";
import { addPcr, getVaccines } from "/@/api/vaccine";
import { vaccineStoreType } from "./types";
export const useVaccineStore = defineStore({
  id: "pure-notice",
  state: (): vaccineStoreType => ({
    vaccines: []
  }),
  actions: {
    // 获取所有疫苗种类
    async GET_VACCINES() {
      return new Promise<void>((resolve, reject) => {
        getVaccines()
          .then((res: any) => {
            if (res) {
              this.vaccines = res?.data;
            }
            console.log(
              "%c [ res ]-44",
              "font-size:13px; background:pink; color:#bf2c9f;",
              res
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

export function useVaccineStoreHook() {
  return useVaccineStore(store);
}
