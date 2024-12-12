import { ref, Ref } from 'vue';
import { useResize } from "./useResize";

export function useFormBtnStatus(total: number): Ref<boolean> {
    const bool = ref(false);
    useResize(document.body, (width, height) => {
        if (total > 5) {
            if (width >= 1200) {
                bool.value = total > 7;
            } else if (width >= 992) {
                bool.value = total > 5;
            } else if (width < 992) {
                bool.value = true;
            }
        } else {
            bool.value = false;
        }
    }, 300);

    return bool;
}