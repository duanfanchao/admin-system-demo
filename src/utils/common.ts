import {
    type RouteRecordRaw,
} from "vue-router";

function Le(e: any) {
    let t = "^((https|http|ftp|rtsp|mms)?://)(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,5})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    return new RegExp(t, "ig").test(e);
}
function Mr(e: any, t?: any) {
    if (e.install = (n: any) => {
        for (let r of [e, ...Object.values(t ?? {})]) n.component(r.name, r);
    }, t) for (let [n, r] of Object.entries(t)) e[n] = r;
    return e;
};

function bt(e: any, t: any) {
    let n = Object.prototype.toString.call(e);
    return n !== Object.prototype.toString.call(t) ? false : n === "[object Object]" ? _e(e, t) : n === "[object Array]" ? yt(e, t) : n === "[object Function]" ? e === t ? true : e.toString() === t.toString() : e === t;
}

// var It = (e) => e.replace(/^\s*/, "");
// var $t = (e) => e.replace(/(\s*$)/g, "");
// var Ht = (e) => e.replace(/^\s*|\s*$/g, "");
// var Te = (e) => e.replace(/\s*/g, "");
var tt = Object.prototype.toString;
function N(e: any, t: any) {
    return tt.call(e) === `[object ${t}]`;
}

function X(e: any) {
    return N(e, "Number");
}

function Me(e: any) {
    return N(e, "Boolean");
}
var Q = class {
    constructor(t: any) {
        // __publicField(this, "storage");
        this.storage = t;
    }
    // setItem(t: any, n: any) {
    //     j(this.storage) || this.storage.setItem(t, JSON.stringify(n));
    // }
    // getItem(t: any) {
    //     if (!j(this.storage)) return JSON.parse(this.storage.getItem(t));
    // }
    // removeItem(t: any) {
    //     j(this.storage) || this.storage.removeItem(t);
    // }
    // clear() {
    //     j(this.storage) || this.storage.clear();
    // }
};
var le = class extends Q {
    constructor(t) {
        super(t);
    }
};
var ot = typeof window > "u";
var me = !ot;
var Nr = () => me ? new le(window.localStorage) : new le("");

function handleFirstMenu(routeList: RouteRecordRaw[]) {
    const res: RouteItem[] = [];
    let run = (data: any) => {
        data.forEach((ele: RouteItem) => {
            const subChildren = ele.children;
            const index = res.findIndex((item: RouteItem) => item.path === ele.path);
            if (subChildren && ele.meta.title === (subChildren as RouteItem[])[0].meta.title) {
                if (index < 0) res.push((subChildren as RouteItem[])[0]);
            } else {
                if (index < 0) res.push(ele);
                if (subChildren && subChildren.length > 1) {
                    run(subChildren);
                }
            }
        });
    }
    run(routeList);
    return res;
}

export {
    Le as isUrl,
    Mr as withInstall,
    bt as isEqual,
    X as isNumber,
    // W as debounce,
    Me as isBoolean,
    Nr as storageLocal,
    handleFirstMenu,
}