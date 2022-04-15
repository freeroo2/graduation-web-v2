import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  getVaccines,
  addVaccineRecord,
  editVaccineRecord,
  deleteVaccineRecord,
  findVaccineRecords
} from "/@/api/vaccine";
export const useVaccineStore = defineStore({
  id: "pure-vaccine",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: [],
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
    // 查找用户姓名对应所有疫苗接种记录
    async FIND_VACCINE_RECORDS(params: object) {
      return new Promise<void>((resolve, reject) => {
        findVaccineRecords(params)
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
    },
    // 编辑疫苗接种记录
    async EDIT_VACCINE_RECORD(data: object) {
      return new Promise<void>((resolve, reject) => {
        editVaccineRecord(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 删除疫苗接种记录
    async DELETE_VACCINE_RECORD(param: object) {
      return new Promise<void>((resolve, reject) => {
        deleteVaccineRecord(param)
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
