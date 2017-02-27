"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __RiceData = {
    "_": {
        "services": {},
        "servicesLoaded": {},
        "globals": {},
        "cache": {},
        "constructors": [],
        "controllers": {},
        "config": {
            "test": {
                "ok": true
            }
        },
        "build": {}
    }
};

function mapping(obj, item, value) {
    if (typeof item == "string") {
        var item = item.split(".");
        var _this = obj;

        if (!value) {
            for (var i = 0; i < item.length; i++) {
                _this = _this[item[i]];
            }
        } else {
            item.reverse();
            var result = _defineProperty({}, item[0], value);

            for (var _i = 1; _i < item.length - 1; _i++) {
                result = _defineProperty({}, item[_i], result);
            }

            _this[item[item.length - 1]] = result;
        }

        return _this;
    }

    return obj;
}

module.exports = function () {
    var _this2 = this;

    var appPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "app";

    var rice = {};

    rice._getData = function () {
        return __RiceData;
    };

    rice.addConstructor = function (build) {
        __RiceData._.constructors.push(build);
    };

    rice.init = function () {
        for (var name in __RiceData._.constructors) {
            var _constructor = __RiceData._.constructors[name].call(rice);

            if (_constructor) {
                rice = _constructor;
            }
        }

        return rice;
    };

    rice.addConfig = function (name, value) {
        function addConfig(name, value) {
            if (mapping(__RiceData._.config, name)) {
                return console.error("There is already an item named \"" + name + "\" in config. To update this item use setConfig ()");
            }

            mapping(__RiceData._.config, name, value);
        }

        if ((typeof name === "undefined" ? "undefined" : _typeof(name)) == "object") {
            for (var key in name) {
                addConfig(key, name[key]);
            }
        } else {
            addConfig(name, value);
        }
    };

    rice.setConfig = function (name, value) {
        function setConfig(name, value) {
            mapping(__RiceData._.config, name, value);
        }

        if ((typeof name === "undefined" ? "undefined" : _typeof(name)) == "object") {
            for (var key in name) {
                setConfig(key, name[key]);
            }
        } else {
            setConfig(name, value);
        }
    };

    rice.getConfig = function (item) {
        return mapping(__RiceData._.config, item);
    };

    rice.add = function (name, value) {
        if (rice[name]) {
            return console.error("\"Rice." + name + "\" was not created. A key with this name already exists.");
        }

        rice[name] = value;
        return rice;
    };

    rice.build = function (name, build) {
        if (!__RiceData._.build[name]) {
            __RiceData._.build[name] = {};
        }

        var _rice = rice;

        _rice.addData = function (key, value) {
            if (!__RiceData._.build[name][key]) {
                return __RiceData._.build[name][key] = value;
            } else {
                console.error("rice-" + name + ": \"" + key + "\" was not created. A key with this name already exists.");
                return undefined;
            }
        };

        _rice.setData = function (key, value) {
            __RiceData._.build[name][key] = value;
        };

        _rice.getData = function (key) {
            return __RiceData._.build[name][key];
        };

        var done = build.apply(rice);

        if (done) {
            __RiceData._.constructors.push(done);
        }

        return rice;
    };

    rice.cache = function (name, value) {
        if (!value) {
            return __RiceData._.cache[name] ? __RiceData._.cache[name] : undefined;
        } else {
            __RiceData._.cache[name] = value;
        }
    };

    rice.global = function (name, value) {
        if (!value) {
            return __RiceData._.globals[name] ? __RiceData._.globals[name] : undefined;
        } else {
            __RiceData._.globals[name] = value;
        }
    };

    rice.import = function (path, name) {
        for (var _len = arguments.length, options = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            options[_key - 2] = arguments[_key];
        }

        var module = require("./" + appPath + "/" + path + "/" + name);
        return module[name].apply(_this2, options);
    };

    rice.controller = function (name) {
        for (var _len2 = arguments.length, options = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            options[_key2 - 1] = arguments[_key2];
        }

        var module = require("./" + appPath + "/controllers/" + name + "Controller.js");
        return module[name].apply(_this2, options);
    };

    rice.services = function (name) {
        for (var _len3 = arguments.length, options = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            options[_key3 - 1] = arguments[_key3];
        }

        var module = require("./" + appPath + "/services/" + name + "Service.js");
        return module[name].apply(_this2, options);
    };

    rice.libs = function (name) {
        for (var _len4 = arguments.length, options = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            options[_key4 - 1] = arguments[_key4];
        }

        var module = require("./" + appPath + "/libs/" + name + ".js");
        return module[name].apply(_this2, options);
    };

    return rice;
}();