import { objects, Store } from './state/store';
import { ArrayPoint, SolvingMethod } from './types';

export default class Methods {
    public static [SolvingMethod.BISECT]([xa, xb]: ArrayPoint): number {
        const e = Store.get('eps');
        let x;
        do {
            const Fa = objects.evaluatex!({ x: xa });
            const Fb = objects.evaluatex!({ x: xb });
            if (Fa === 0) { return xa; }
            if (Fb === 0) { return xb; }
            x = (xa + xb) / 2;
            const Fx = objects.evaluatex!({ x });
            Math.sign(Fa)
            !== Math.sign(Fx)
                ? xb = x
                : xa = x;
        } while (xb - xa > e);

        return x;
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
