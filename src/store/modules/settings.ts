import { defineStore } from "pinia";
import { setType } from '../types';
import { getConfig } from '../utils';
import { store } from "../index";

export const useSettingStore = defineStore({
    id: "pure-setting",
    state: (): setType => ({
        title: getConfig().Title,
        fixedHeader: getConfig().FixedHeader,
        hiddenSideBar: getConfig().HiddenSideBar
    }),
    getters: {
        getTitle(state) {
            return state.title;
        },
        getFixedHeader(state) {
            return state.fixedHeader;
        },
        getHiddenSideBar(state) {
            return state.hiddenSideBar;
        }
    },
    actions: {
        CHANGE_SETTING({ key, value }: { key: keyof setType; value: any }) {
            if (Reflect.has(this, key)) {
                this[key] = value;
            }
        },
        changeSetting(data: any) {
            this.CHANGE_SETTING(data);
        }
    }
});

export function useSettingStoreHook() {
    return useSettingStore(store);
}