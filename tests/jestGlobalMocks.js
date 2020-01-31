import "mutationobserver-shim"

const storageMock = () => {
    let storage = {};
    return {
        getItem: key => key in storage ? storage[key] : null,
        setItem: (key, value) => storage[key] = value || '',
        removeItem: key => delete storage[key],
        clear: () => storage = {},
    };
};

Object.defineProperty(window, 'localStorage', { value: storageMock() });
Object.defineProperty(window, 'sessionStorage', { value: storageMock() });
Object.defineProperty(window, 'MutationObserver', { value: MutationObserver });
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ['-webkit-appearance'],
});