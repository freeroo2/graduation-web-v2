import { defineStore } from "pinia";
import { store } from "/@/store";
import { getCurRole } from "/@/api/role";
export const useRoleStore = defineStore({
  id: "pure-role",
  state: () => ({
    role: null
  }),
  actions: {
    // 获取当前用户的角色
    GET_CUR_ROLE(id: number) {
      return new Promise<void>((resolve, reject) => {
        const params = {
          id: id
        };
        getCurRole(params)
          .then((res: any) => {
            if (res) {
              this.role = res?.data?.role;
            }
            resolve(res?.data?.role);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useRoleStoreHook() {
  return useRoleStore(store);
}
