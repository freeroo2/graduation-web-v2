import { defineStore } from "pinia";
import { store } from "/@/store";
import { addPcr, getVaccines, addVaccineRecord } from "/@/api/vaccine";
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
              res?.data
            );
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 通过用户ID添加核酸记录
    async ADD_PCR(param: object) {
      return new Promise<void>((resolve, reject) => {
        addPcr(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 通过用户ID添加疫苗接种记录
    async ADD_VACCINE_RECORD(param: object) {
      return new Promise<void>((resolve, reject) => {
        addVaccineRecord(param)
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

export function useVaccineStoreHook() {
  return useVaccineStore(store);
}
