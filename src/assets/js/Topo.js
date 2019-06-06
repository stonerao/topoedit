(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.Topo = factory());
}(this, function () {
    'use strict';
    /*  */
    function isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }
    /**
	 * Convert a value to a string that is actually rendered.
	 */
    function toString(val) {
        return val == null ?
            '' :
            typeof val === 'object' ?
                JSON.stringify(val, null, 2) :
                String(val)
    }
    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n
    }
    /**
	 * Remove an item from an array
	 */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }
    /**
     * Check whether the object has the property.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }
    var LIFECYCLE_HOOKS = [
        'created',
        'mounted',
        'destroyed'
    ]
    /* config */
    var config = {

    }
    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isEdge = UA && UA.indexOf('edge/') > 0;
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
    if (!isChrome) {
        console.warn("not is chrome")
    }
    /* clone Json  */
    function cloneJson(obj) {
        if (isObject(obj)) {
            return JSON.parse(JSON.stringify(obj))
        } else {
            console.warn("data not is object or array")
            return obj
        }
    }
    /* Topo options */
    var options = {
        width: 1920,
        height: 1080
    }
    var camera, scene, renderer;
    var controls;
    var stats;
    function Topo() {
        this.option = [] 
    } 
    return Topo
}))

