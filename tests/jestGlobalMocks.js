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
jest.useFakeTimers();

const cancelAnimationFrameMock = () => id => clearTimeout(id)
const requestAnimationFrameMock = ()=> cb => setTimeout(cb, 1000 / 60)


Object.defineProperty(window, 'cancelAnimationFrame', { value: cancelAnimationFrameMock() });
Object.defineProperty(window, 'requestAnimationFrame', { value: requestAnimationFrameMock() });
Object.defineProperty(window, 'localStorage', { value: storageMock() });
Object.defineProperty(window, 'sessionStorage', { value: storageMock() });
Object.defineProperty(window, 'MutationObserver', { value: MutationObserver });
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ['-webkit-appearance'],
});