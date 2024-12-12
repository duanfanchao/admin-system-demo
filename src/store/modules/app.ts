import { defineStore } from "pinia";
import { appType } from '../types';
import { store } from "../../store";

declare const deviceDetection: () => boolean;

export const useAppStore = defineStore({
    id: "pure-app",
    state: (): appType => ({
        sidebar: {
            opened: true,
            withoutAnimation: false,
            isClickCollapse: false
        },
        device: "desktop",
        // device: deviceDetection() ? "mobile" : "desktop",
    }),
    getters: {
        getSidebarStatus(state) {
            return state.sidebar.opened;
        },
        getDevice(state) {
            return state.device;
        },
    },
    actions: {
        TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
            if (opened && resize) {
                this.sidebar.withoutAnimation = true;
                this.sidebar.opened = true;
                // layout.sidebarStatus = true;
            } else if (!opened && resize) {
                this.sidebar.withoutAnimation = true;
                this.sidebar.opened = false;
                // layout.sidebarStatus = false;
            } else if (!opened && !resize) {
                this.sidebar.withoutAnimation = false;
                this.sidebar.opened = !this.sidebar.opened;
                this.sidebar.isClickCollapse = !this.sidebar.opened;
                // layout.sidebarStatus = this.sidebar.opened;
            }
        },
        async toggleSideBar(opened?: boolean, resize?: string) {
            await this.TOGGLE_SIDEBAR(opened, resize);
        },
        toggleDevice(device: string) {
            this.device = device;
        },
    },

});

export function useAppStoreHook() {
    return useAppStore(store);
}