(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rbac"] = factory();
	else
		root["rbac"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var RBAC = (function () {
    function RBAC(config) {
        this.users = {};
        this.roles = {};
        this.debug = (typeof config.debug === 'undefined') ? true : config.debug;
        this.roles = config.rolesConfig.reduce(function (accumulator, item) {
            for (var i = 0; i < item.roles.length; i++) {
                accumulator[item.roles[i]] = item.permissions;
            }
            return accumulator;
        }, {});
    }
    RBAC.prototype.generateError = function (msg) {
        if (this.debug) {
            console.warn(msg);
        }
        return new Error(msg);
    };
    RBAC.prototype.getUserRoles = function (userId) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }
        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId];
        }
        else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.addUserRoles = function (userId, roles) {
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            return this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }
        for (var i = 0; i < roles.length; i++) {
            if (typeof this.roles[roles[i]] !== 'undefined') {
                if (this.users[userId]) {
                    if (!this.users[userId].includes(roles[i])) {
                        this.users[userId].push(roles[i]);
                    }
                }
                else {
                    this.users[userId] = [roles[i]];
                }
            }
            else {
                return this.generateError(roles[i] + ' role is not defined in initial config');
            }
        }
    };
    RBAC.prototype.removeUserRoles = function (userId, roles) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }
        if (this.users[userId]) {
            if (typeof roles === 'undefined') {
                delete this.users[userId];
            }
            else {
                for (var i = 0; i < roles.length; i++) {
                    var roleIndex = this.users[userId].indexOf(roles[i]);
                    if (roleIndex + 1) {
                        this.users[userId].splice(roleIndex, 1);
                    }
                }
            }
        }
        else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.isAllowed = function (userId, permissionId) {
        var _this = this;
        if (typeof userId === 'undefined' || typeof permissionId === 'undefined') {
            return this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }
        var user = this.users[userId];
        if (typeof user !== 'undefined') {
            return user.some(function (userRole) { return _this.roles[userRole].includes(permissionId); });
        }
        else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.extendRole = function (role, extendingRoles) {
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            return this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }
        if (typeof this.roles[role] !== 'undefined') {
            for (var i = 0; i < extendingRoles.length; i++) {
                if (this.roles[extendingRoles[i]]) {
                    this.roles[role] = this.roles[role]
                        .concat(this.roles[extendingRoles[i]]);
                }
                else {
                    return this.generateError(role + ' role is not defined in initial config');
                }
            }
        }
        else {
            return this.generateError(role + ' role is not defined in initial config');
        }
    };
    RBAC.prototype.middleware = function (params, error, success) {
        if (typeof params === 'undefined' ||
            typeof error === 'undefined' ||
            typeof success === 'undefined') {
            error();
            return this.generateError('one of incoming parameters is not defined, expected 3 arguments');
        }
        if (this.isAllowed(params.userId, params.permissionId)) {
            success();
        }
        else {
            error();
        }
    };
    return RBAC;
}());
exports["default"] = RBAC;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0MTY3Y2VkNWVhMDIyM2Q2NTM0MiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzlCQTtJQUtJLGNBQVksTUFBZTtRQUhuQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFVBQUssR0FBVyxFQUFFLENBQUM7UUFHdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRXpFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQ2xDLFVBQUMsV0FBZ0IsRUFBRSxJQUFrQjtZQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFN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QUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJyYmFjXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJiYWNcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQxNjdjZWQ1ZWEwMjIzZDY1MzQyIiwiaW50ZXJmYWNlIElVc2VycyB7XG4gICAgW3VzZXJJZDogc3RyaW5nXTogc3RyaW5nW11cbn1cblxuaW50ZXJmYWNlIElSb2xlcyB7XG4gICAgW3Blcm1pc3Npb25JZDogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJvbGVzQ29uZmlnIHtcbiAgICByb2xlczogc3RyaW5nW10sXG4gICAgcGVybWlzc2lvbnM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1pZGRsZXdhcmUge1xuICAgIChwYXJhbXM6IHsgdXNlcklkOiBzdHJpbmc7IHBlcm1pc3Npb25JZDogc3RyaW5nOyB9LCBlcnJvcjogKCkgPT4gdm9pZCwgc3VjY2VzczogKCkgPT4gdm9pZCk6IHZvaWQgfCBFcnJvcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUkJBQyB7XG4gICAgZ2V0VXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcpID0+IHN0cmluZ1tdIHwgRXJyb3I7XG4gICAgcmVtb3ZlVXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcsIHJvbGU/OiBzdHJpbmdbXSkgPT4gdm9pZCB8IEVycm9yO1xuICAgIGFkZFVzZXJSb2xlczogKHVzZXJJZDogc3RyaW5nLCByb2xlOiBzdHJpbmdbXSkgPT4gdm9pZCB8IEVycm9yO1xuICAgIGlzQWxsb3dlZDogKHVzZXJJZDogc3RyaW5nLCBwZXJtaXNzaW9uSWQ6IHN0cmluZykgPT4gYm9vbGVhbiB8IEVycm9yO1xuICAgIGV4dGVuZFJvbGU6IChyb2xlOiBzdHJpbmcsIGV4dGVuZGluZ1JvbGVzOiBzdHJpbmdbXSkgPT4gdm9pZCB8IEVycm9yO1xuICAgIG1pZGRsZXdhcmU6IElNaWRkbGV3YXJlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElDb25maWcge1xuICAgIHJvbGVzQ29uZmlnOiBJUm9sZXNDb25maWdbXTtcbiAgICBkZWJ1Zz86IGJvb2xlYW47XG59XG5cbmNsYXNzIFJCQUMgaW1wbGVtZW50cyBJUkJBQyB7XG4gICAgcHJpdmF0ZSBkZWJ1ZzogYm9vbGVhbjtcbiAgICBwcml2YXRlIHVzZXJzOiBJVXNlcnMgPSB7fTtcbiAgICBwcml2YXRlIHJvbGVzOiBJUm9sZXMgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUNvbmZpZykge1xuICAgICAgICB0aGlzLmRlYnVnID0gKHR5cGVvZiBjb25maWcuZGVidWcgPT09ICd1bmRlZmluZWQnKSA/IHRydWUgOiBjb25maWcuZGVidWc7XG5cbiAgICAgICAgdGhpcy5yb2xlcyA9IGNvbmZpZy5yb2xlc0NvbmZpZy5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjdW11bGF0b3I6IGFueSwgaXRlbTogSVJvbGVzQ29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLnJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yW2l0ZW0ucm9sZXNbaV1dID0gaXRlbS5wZXJtaXNzaW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUVycm9yKG1zZzogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKG1zZyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VzZXJJZCBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMSBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy51c2Vyc1t1c2VySWRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcnNbdXNlcklkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IodXNlcklkICsgJyB1c2VySWQgaXMgbm9yIGRlZmluZWQsIHBsZWFzZSBhZGQgdXNlciB0byB0aGUgcmJhYyB1c2luZyBhZGRVc2VyUm9sZXMgbWV0aG9kJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkVXNlclJvbGVzKHVzZXJJZDogc3RyaW5nLCByb2xlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiByb2xlcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcm9sZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3Igcm9sZXMgaXMgbm90IGRlZmluZWQsIG9yIHJvbGVzLmxlbmd0aCA9PT0gMCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9sZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yb2xlc1tyb2xlc1tpXV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlcnNbdXNlcklkXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlcnNbdXNlcklkXS5pbmNsdWRlcyhyb2xlc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcnNbdXNlcklkXS5wdXNoKHJvbGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcnNbdXNlcklkXSA9IFtyb2xlc1tpXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGVzW2ldICsgJyByb2xlIGlzIG5vdCBkZWZpbmVkIGluIGluaXRpYWwgY29uZmlnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHB1YmxpYyByZW1vdmVVc2VyUm9sZXModXNlcklkOiBzdHJpbmcsIHJvbGVzPzogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDEgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2Vyc1t1c2VySWRdKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvbGVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnVzZXJzW3VzZXJJZF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9sZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm9sZUluZGV4ID0gdGhpcy51c2Vyc1t1c2VySWRdLmluZGV4T2Yocm9sZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm9sZUluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51c2Vyc1t1c2VySWRdLnNwbGljZShyb2xlSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcih1c2VySWQgKyAnIHVzZXJJZCBpcyBub3IgZGVmaW5lZCwgcGxlYXNlIGFkZCB1c2VyIHRvIHRoZSByYmFjIHVzaW5nIGFkZFVzZXJSb2xlcyBtZXRob2QnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIGlzQWxsb3dlZCh1c2VySWQ6IHN0cmluZywgcGVybWlzc2lvbklkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwZXJtaXNzaW9uSWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3IgcGVybWlzc2lvbklkIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAyIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMudXNlcnNbdXNlcklkXTtcblxuICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zb21lKHVzZXJSb2xlID0+IHRoaXMucm9sZXNbdXNlclJvbGVdLmluY2x1ZGVzKHBlcm1pc3Npb25JZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcih1c2VySWQgKyAnIHVzZXJJZCBpcyBub3IgZGVmaW5lZCwgcGxlYXNlIGFkZCB1c2VyIHRvIHRoZSByYmFjIHVzaW5nIGFkZFVzZXJSb2xlcyBtZXRob2QnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBleHRlbmRSb2xlKHJvbGU6IHN0cmluZywgZXh0ZW5kaW5nUm9sZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygcm9sZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGV4dGVuZGluZ1JvbGVzID09PSAndW5kZWZpbmVkJyB8fCBleHRlbmRpbmdSb2xlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ3JvbGUgb3IgZXh0ZW5kaW5nUm9sZXMgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucm9sZXNbcm9sZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4dGVuZGluZ1JvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm9sZXNbZXh0ZW5kaW5nUm9sZXNbaV1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9sZXNbcm9sZV0gPSB0aGlzLnJvbGVzW3JvbGVdXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRoaXMucm9sZXNbZXh0ZW5kaW5nUm9sZXNbaV1dKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGUgKyAnIHJvbGUgaXMgbm90IGRlZmluZWQgaW4gaW5pdGlhbCBjb25maWcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGUgKyAnIHJvbGUgaXMgbm90IGRlZmluZWQgaW4gaW5pdGlhbCBjb25maWcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBtaWRkbGV3YXJlKHBhcmFtczogeyB1c2VySWQ6IHN0cmluZzsgcGVybWlzc2lvbklkOiBzdHJpbmc7IH0sIGVycm9yOiAoKSA9PiB2b2lkLCBzdWNjZXNzOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIGVycm9yID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHN1Y2Nlc3MgPT09ICd1bmRlZmluZWQnXG4gICAgICAgICkge1xuICAgICAgICAgICAgZXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ29uZSBvZiBpbmNvbWluZyBwYXJhbWV0ZXJzIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAzIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBbGxvd2VkKHBhcmFtcy51c2VySWQsIHBhcmFtcy5wZXJtaXNzaW9uSWQpKSB7XG4gICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSQkFDO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=