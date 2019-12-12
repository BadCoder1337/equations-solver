import { objects, Store } from './state/store';
import { ArrayPoint, SolvingMethod } from './types';

export default class Methods {
    public static [SolvingMethod.DICHOTOMY]([a, b]: ArrayPoint): number {
        const c = (a + b) / 2;
        if (b - a > Store.get('eps')) {
            const B = objects.evaluatex!({ x: b });
            const C = objects.evaluatex!({ x: c });
            return C === 0
                ? c
                : C * B < 0
                    ? Methods[SolvingMethod.DICHOTOMY]([c, b])
                    : Methods[SolvingMethod.DICHOTOMY]([a, c]);
        } else {
            return c;
        }
    }

    public static [SolvingMethod.ITERATION]([a, b]: ArrayPoint): number {
        console.log('iterations');
        const c = (a + b) / 2;
        return c;
    }

    public static [SolvingMethod.NEWTON]([a, b]: ArrayPoint): number {
        console.log('newton');
        const c = (a + b) / 2;
        return c;
    }

    public static [SolvingMethod.SECANT]([a, b]: ArrayPoint): number {
        console.log('secant');
        const c = (a + b) / 2;
        return c;
    }
}
