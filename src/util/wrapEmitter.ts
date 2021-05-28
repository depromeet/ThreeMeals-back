import { EventEmitter } from 'events';
import { AsyncResource } from 'async_hooks';

const isWrappedSymbol = Symbol('is-wrapped');
const wrappedSymbol = Symbol('wrapped-function');

type WrapEmitterMethods =
    'on' |
    'addListener' |
    'prependListener' |
    'off' |
    'removeListener';

const addMethods = [
    'on',
    'addListener',
    'prependListener',
];

const removeMethods = [
    'off',
    'removeListener',
];

const wrapEmitterMethod = (
    emitter: EventEmitter,
    method: WrapEmitterMethods,
    wrapper: (original: any, method: WrapEmitterMethods) => (name: symbol, handler: any) => any,
) => {
    if ((emitter[method] as any)[isWrappedSymbol]) {
        return;
    }

    const original = emitter[method];
    const wrapped = wrapper(original, method);
    (wrapped as any)[isWrappedSymbol] = true;
    emitter[method] = wrapped;

    return wrapped;
};

export const wrapEmitter = (emitter: EventEmitter, asyncResource: AsyncResource) => {
    for (const method of addMethods) {
        wrapEmitterMethod(emitter, <WrapEmitterMethods>method, (original) => (name, handler) => {
            handler[wrappedSymbol] = asyncResource.runInAsyncScope.bind(asyncResource, handler, emitter);
            return original.call(emitter, name, handler[wrappedSymbol]);
        });
    }

    for (const method of removeMethods) {
        wrapEmitterMethod(emitter, <WrapEmitterMethods>method, (original) => (name, handler) => {
            return original.call(emitter, name, handler[wrappedSymbol] || handler);
        });
    }
};
