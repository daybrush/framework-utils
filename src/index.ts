export function prefixNames(prefix: string, ...classNames: string[]) {
    return classNames.map(
        className => className.split(" ").map(name => name ? `${prefix}${name}` : "").join(" "),
    ).join(" ");
}

export function prefixCSS(prefix: string, css: string) {
    return css.replace(/([^}{]*){/mg, (_, selector) => {
        return `${selector.replace(/\.([^{,\s\d.]+)/g, `.${prefix}$1`)}{`;
    });
}

/* react */
export function ref(target: any, name: string) {
    return (e: any) => {
        e && (target[name] = e);
    };
}
export function refs(target: any, name: string, i: number) {
    return (e: any) => {
        e && (target[name][i] = e);
    };
}

/* Class Decorator */
export function Properties(properties: any[], action: (prototype: any, property: string) => any) {
    return (component: any) => {
        const prototype = component.prototype;

        properties.forEach(property => {
            action(prototype, property);
        });
    };
}

/* Property Decorator */
export function withMethods(methods: string[], duplicate: { [name: string]: string } = {}) {
    return (prototype: any, propertyName: string) => {
        methods.forEach(name => {
            const methodName = duplicate[name] || name;

            if (prototype[methodName]) {
                return;
            }
            prototype[methodName] = function(...args) {
                const result = this[propertyName][name](...args);

                if (result === this[propertyName]) {
                    return this;
                } else {
                    return result;
                }
            };
        });
    };
}

export type ParametersType<T, R> = T extends (...params: infer U) => any ? (...params: U) => R : never;
export type ExcludeInterface<T, U> = {
    [key in (Exclude<keyof T, keyof U>)]: T[key];
};
export type Entries<T extends { [key: string]: any }, U = keyof T> = U extends string ? [U, T[U]] : never;
export type ReverseKey<T extends string, U extends { [key: string]: any }, E = Entries<U>>
    = E extends [infer K, T] ? K : never;

export type MethodInterface<T, U extends T, R extends any, Duplicate extends { [key: string]: any } = {}> = {
    [key in keyof ExcludeInterface<T, Duplicate>]:
        T[key] extends (...params: any[]) => U ? ParametersType<T[key], R> : T[key];
} & {
    [key in Duplicate[keyof Duplicate]]:
        T[ReverseKey<key, Duplicate> & keyof T] extends (...params: any[]) => U
            ? ParametersType<T[ReverseKey<key, Duplicate> & keyof T], R>
            : T[ReverseKey<key, Duplicate> & keyof T];
};
