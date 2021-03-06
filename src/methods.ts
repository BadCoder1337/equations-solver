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
        const c = (a + b) / 2;
        // const e = Store.get('eps');
        // const F = (xx: number) => objects.evaluatex!({ x: xx });
        return c;
    }

    public static [SolvingMethod.TANGENT]([a, b]: ArrayPoint): number {
        const e = Store.get('eps');
        const F = (xx: number) => objects.evaluatex!({ x: xx });
        let i = 0;
        while (Math.abs(b - a) > e) {
            a = b - F(b) / Methods.derivative(b);
            b = a;
            if (i > 10) { return b; }
            i++;
        }
        return b;
    }

    public static [SolvingMethod.CHORD]([a, b]: ArrayPoint): number {
        const e = Store.get('eps');
        const F = (xx: number) => objects.evaluatex!({ x: xx });
        while (Math.abs(b - a) > e) {
            a = b - (b - a) * F(b) / (F(b) - F(a));
            b = a + (a - b) * F(a) / (F(a) - F(b));
        }
        return b;
    }

    public static derivative(x: number) {
        const e = Store.get('eps');
        const F = (xx: number) => objects.evaluatex!({ x: xx });
        return (F(x + e) - F(x)) / e;
    }
}
