// noinspection JSUnusedLocalSymbols

import Logger from '../components/Logger';


/** Measures time that takes to execute a decorated function. */
export const measurePerformance = (message: string) => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const finish = performance.now();

        Logger.info(`Module { ${message} } took: ${finish - start} ms.`, 'hf');
        return result;
    };
}