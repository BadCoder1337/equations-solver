import { objects, Store } from './state/store';
import { ArrayPoint, SolvingMethod } from './types';

export default class Methods {
    public static [SolvingMethod.BISECT]([a, b]: ArrayPoint): number {
        const e = Store.get('eps');
        const F = (xx: number) => objects.evaluatex!({ x: xx });
        let x;
        do {
            const Fa = F(a);
            const Fb = F(b);
            if (Fa === 0) { return a; }
            if (Fb === 0) { return b; }
            x = (a + b) / 2;
            const Fx = F(x);
            Math.sign(Fa)
            !== Math.sign(Fx)
                ? b = x
                : a = x;
        } while (b - a > e);

        return x;
    }

    public static [SolvingMethod.ITERATION]([a, b]: ArrayPoint): number {
        console.log('iterations');
        const c = (a + b) / 2;
        return c;
    }

    public static [SolvingMethod.SECANT]([a, b]: ArrayPoint): number {
        console.log('newton');
        const c = (a + b) / 2;
        return c;
    }

    public static [SolvingMethod.CHORD]([a, b]: ArrayPoint): number {
        const e = Store.get('eps');
        const F = (xx: number) => objects.evaluatex!({ x: xx });
        let Fa = F(a);
        let Fb = F(b);
        let x = b;
        const S = Math.sign(Fa);
        while (b - a > e) {
            x = a - (b - a) / (Fb - Fa) * Fa;
            const R = F(x);
            if (Math.abs(R) < e) { break; }
            if (Math.sign(R) === S) {
                a = x;
                Fa = R;
            } else {
                b = x;
                Fb = R;
            }
        }
        return x;
    }
}
