"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// "test.coisa.toda",10

/**
 * Localiza/criar chaves em um objeto, lendo uma rota (em string) separada por pontos.
 * Ler: ({"test": {"ok": "no"}}).mapping("test.ok") // no
 * Escreve: ({"test": {"ok": "yes"}}).mapping("test.ok", false) // yes
 */
Object.prototype.mapping = function (item, value) {
    if (typeof item == "string") {
        var item = item.split(".");
        var _this = this;

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

    return this;
};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

String.prototype.replaceRecursive = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;

    if (Array.isArray(search)) {
        for (var key in search) {
            target = target.replaceRecursive(search[key], replacement);
        }

        return target;
    } else if ((typeof search === 'undefined' ? 'undefined' : _typeof(search)) == 'object') {
        for (var key in search) {
            target = target.replaceRecursive(key, search[key]);
        }

        return target;
    } else {
        return target.replaceRecursive(key, search[key]);
    }
};

String.prototype.replaceVar = function (search, replacement, suffix) {
    var target = this;

    if (!suffix) {
        suffix = "%";
    }

    if (Array.isArray(search)) {
        for (var key in search) {
            target = target.replaceAll(suffix + search[key] + suffix, replacement);
        }

        return target;
    } else if ((typeof search === 'undefined' ? 'undefined' : _typeof(search)) == 'object') {
        for (var key in search) {
            target = target.replaceAll(suffix + key + suffix, search[key]);
        }

        return target;
    } else {
        return target.replaceAll(suffix + key + suffix, search[key]);
    }
};
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Rice = function () {
    var rice = {
        "service": {},
        "controller": {},
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

    rice.name = "Rice!";

    rice.addConstructor = function (build) {
        rice._.constructors.push(build);
    };

    rice.init = function () {
        for (var name in rice._.constructors) {
            var _constructor = rice._.constructors[name].call(rice);

            if (_constructor) {
                rice = _constructor;
            }
        }

        return rice;
    };

    rice.addConfig = function (name, value) {
        function addConfig(name, value) {
            if (rice._.config.mapping(name)) {
                return console.error("There is already an item named \"" + name + "\" in config. To update this item use setConfig ()");
            }

            rice._.config.mapping(name, value);
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
            rice._.config.mapping(name, value);
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
        return rice._.config.mapping(item);
    };

    rice.add = function (name, value) {
        if (rice[name]) {
            return console.error("\"Rice." + name + "\" was not created. A key with this name already exists.");
        }

        rice[name] = value;
        return rice;
    };

    rice.build = function (name, build) {
        rice._.build[name] = {};

        var done = build.apply(rice);

        if (done) {
            return window.rice = done;
        }

        return rice;
    };

    rice.cache = function (name, value) {
        if (!value) {
            return rice._.cache[name] ? rice._.cache[name] : undefined;
        } else {
            rice._.cache[name] = value;
        }
    };

    rice.global = function (name, value) {
        if (!value) {
            return rice._.globals[name] ? rice._.globals[name] : undefined;
        } else {
            rice._.globals[name] = value;
        }
    };

    rice.addService = function (name, value) {
        if (rice._.services[name]) {
            return console.error("Can not create the \"" + name + "\" service. Another service with this name already exists");
        }

        rice._.services[name] = value;
    };

    rice.initService = function (name) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (!rice._.services[name]) {
            return console.error("There is no registered service called \"" + name + "\"");
        }

        rice.service[name] = rice._.services[name].apply(null, args);

        if (rice.service[name].init) {
            rice.service[name].init();
        }
    };

    rice.initAllServices = function () {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        for (var name in rice._.services) {
            var arg = [name];

            if (args[name]) {
                if (Array.isArray(args[name])) {
                    args[name].map(function (item) {
                        arg.push(args[item]);
                    });
                } else {
                    arg.push(args[name]);
                }
            }

            rice.initService.apply(null, arg);
        }
    };

    rice.stopService = function (name) {
        if (rice.service[name]) {
            if (rice.service[name].stop) {
                rice.service[name].stop(function () {
                    delete rice.service[name];
                });
            } else {
                delete rice.service[name];
            }

            delete rice._.services[name];
        }
    };

    rice.stopAllServices = function (name) {
        for (var _name in rice.service) {
            rice.stopService(_name);
        }
    };

    rice.addController = function (name, controller) {
        rice._.controllers[name] = controller;
    };

    rice.controller = function (name) {
        try {
            var control = rice._.controllers[name];

            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return control.apply(null, args);
        } catch (e) {
            if (!rice._.controllers[name]) {
                return console.error("The controller \"" + name + "\" has not been registered. Use Rice.addController(\"" + name + "\", function(){...}) to register it.");
            } else {
                console.error(e);
            }
        }
    };

    return rice;
}();