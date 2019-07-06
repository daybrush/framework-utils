export function prefixNames(prefix: string, ...classNames: string[]) {
    return classNames.map(className => className.split(" ").map(name => `${prefix}${name}`).join(" ")).join(" ");
}

export function prefixCSS(prefix: string, css: string) {
    return css.replace(/\.([^{,\s\d.]+)/g, `.${prefix}$1`);
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
