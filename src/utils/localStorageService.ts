export class LocalStorageService {
    // 添加数据
    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // 获取数据
    getItem<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    // 删除数据
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    // 清空所有数据
    clear(): void {
        localStorage.clear();
    }

    // 检查某个键是否存在
    exists(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}
