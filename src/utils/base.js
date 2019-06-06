export default class Base {
    constructor() {

    }
    isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }
    /**
	 * Convert a value to a string that is actually rendered.
	 */
    toString(val) {
        return val == null ?
            '' :
            typeof val === 'object' ?
                JSON.stringify(val, null, 2) :
                String(val)
    }
    toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n
    }
    /**
         * Remove an item from an array
         */
    remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }
    hasOwn(obj, key) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        return hasOwnProperty.call(obj, key)
    }
    cloneJson(obj) {
        if (this.isObject(obj)) {
            return JSON.parse(JSON.stringify(obj))
        } else {
            console.warn("data not is object or array")
            return obj
        }
    }
    setOption(options, data) {
        /* 改变对象中的参数 */
        if (!this.isObject(options)) {
            return console.warn("参数不是对象")
        } else {
            for (let key in data) {
                if (this.hasOwn(options, key)) {
                    options[key] = data[key]
                }
            }
        }
    }
}