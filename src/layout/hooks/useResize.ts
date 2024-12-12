import { onMounted, onUnmounted, Ref } from 'vue';

export function useResize(element: Ref<HTMLElement | null> | HTMLElement, callback: (width: number, height: number) => void, delay: number = 300) {

    function debounce(fn: Function, delay: number) {
        let timer: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }
    const debouncedCallback = debounce((width: number, height: number) => {
        callback(width, height);
    }, delay);

    let resizeObserver: ResizeObserver | null = null;
    onMounted(() => {
        // 判断element的类型并获取targetElement
        const targetElement = (element as Ref<HTMLElement | null>).value || (element as HTMLElement);
        if (targetElement) {
            resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    if (entry.contentRect) {
                        debouncedCallback(entry.contentRect.width, entry.contentRect.height);
                    }
                }
            });
            resizeObserver.observe(targetElement);
        }
    })
    onUnmounted(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
    });
}