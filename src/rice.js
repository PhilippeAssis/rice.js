var __RiceData = {
    "_": {
        "services": {},
        "servicesLoaded": {},
        "globals": {},
        "cache": {},
        "constructors": [],
        "controllers": {},
        "config": {},
        "build": {}
    }
}

function mapping(obj, item, value) {
    if (typeof item == "string") {
        var item = item.split(".")
        var _this = obj;

        if (!value) {
            for (let i = 0; i < item.length; i++) {
                _this = _this[item[i]]
            }
        }
        else {
            item.reverse();
            var result = {
                [item[0]]: value
            };

            for (let i = 1; i < (item.length - 1); i++) {
                result = {
                    [item[i]]: result
                }
            }

            _this[item[(item.length - 1)]] = result;
        }

        return _this;
    }

    return obj;
}

module.exports = (function(appPath = "app") {
    var rice = {};

    rice._getData = () => {
        return __RiceData;
    }

    rice.addConstructor = (build) => {
        __RiceData._.constructors.push(build);
    };

    rice.init = () => {
        for (let name in __RiceData._.constructors) {
            let constructor = __RiceData._.constructors[name].call(rice);

            if (constructor) {
                rice = constructor;
            }
        }

        return rice;
    }

    rice.addConfig = (name, value) => {
        function addConfig(name, value) {
            if (mapping(__RiceData._.config, name)) {
                return console.error(`There is already an item named "${name}" in config. To update this item use setConfig ()`)
            }

            mapping(__RiceData._.config, name, value)
        }

        if (typeof name == "object") {
            for (let key in name) {
                addConfig(key, name[key])
            }
        }
        else {
            addConfig(name, value)
        }
    }

    rice.setConfig = (name, value) => {
        function setConfig(name, value) {
            mapping(__RiceData._.config, name, value)
        }

        if (typeof name == "object") {
            for (let key in name) {
                setConfig(key, name[key])
            }
        }
        else {
            setConfig(name, value)
        }
    }

    rice.getConfig = (item) => {
        return mapping(__RiceData._.config, item)
    }

    rice.add = (name, value) => {
        if (rice[name]) {
            return console.error(`"Rice.${name}" was not created. A key with this name already exists.`)
        }

        rice[name] = value;
        return rice;
    }

    rice.build = (name, build) => {
        if (!__RiceData._.build[name]) {
            __RiceData._.build[name] = {}
        }

        var _rice = rice;

        _rice.addData = (key, value) => {
            if (!__RiceData._.build[name][key]) {
                return __RiceData._.build[name][key] = value;
            }
            else {
                console.error(`rice-${name}: "${key}" was not created. A key with this name already exists.`)
                return undefined;
            }
        }

        _rice.setData = (key, value) => {
            __RiceData._.build[name][key] = value;
        }

        _rice.getData = (key) => {
            return __RiceData._.build[name][key];
        }

        var done = build.apply(rice)

        if (done) {
            __RiceData._.constructors.push(done)
        }

        return rice;
    }

    rice.cache = (name, value) => {
        if (!value) {
            return __RiceData._.cache[name] ? __RiceData._.cache[name] : undefined;
        }
        else {
            __RiceData._.cache[name] = value;
        }
    }

    rice.global = (name, value) => {
        if (!value) {
            return __RiceData._.globals[name] ? __RiceData._.globals[name] : undefined;
        }
        else {
            __RiceData._.globals[name] = value;
        }
    }

    rice.import = (path, name, ...options) => {
        var module = require(`./${appPath}/${path}/${name}`)
        return module[name].apply(this, options)
    }

    rice.controller = (name, ...options) => {
        var module = require(`./${appPath}/controllers/${name}Controller.js`)
        return module[name].apply(this, options)
    }

    rice.service = (name, ...options) => {
        if (__RiceData._.servicesLoaded[name]) {
            return __RiceData._.servicesLoaded[name]
        }

        var module = require(`./${appPath}/services/${name}Service.js`)
        __RiceData._.servicesLoaded[name] = module[name].apply(this, options)
        return __RiceData._.servicesLoaded[name];
    }

    rice.lib = (name, ...options) => {
        var module = require(`./${appPath}/libs/${name}.js`)
        return module[name].apply(this, options)
    }
    
    rice.allServices = (method) => {
        for (let key in __RiceData._.servicesLoaded) {
            if (__RiceData._.servicesLoaded[key][method]) {
                __RiceData._.servicesLoaded[key][method]()
            }
            else{
                console.error(`The ${key} service does not contain the start method`)
            }
        }
    }

    return rice;
})()

