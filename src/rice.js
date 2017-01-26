var Rice = (function() {
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
            "build":{}
        }
    }

    rice.name = "Rice!"

    rice.addConstructor = (build) => {
        rice._.constructors.push(build);
    };

    rice.init = () => {
        for (let name in rice._.constructors) {
            let constructor = rice._.constructors[name].call(rice);

            if (constructor) {
                rice = constructor;
            }
        }

        return rice;
    }

    rice.addConfig = (name, value) => {
        function addConfig(name, value) {
            if (rice._.config.mapping(name)) {
                return console.error(`There is already an item named "${name}" in config. To update this item use setConfig ()`)
            }

            rice._.config.mapping(name, value)
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
            rice._.config.mapping(name, value)
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
        return rice._.config.mapping(item)
    }

    rice.add = (name, value) => {
        if (rice[name]) {
            return console.error(`"Rice.${name}" was not created. A key with this name already exists.`)
        }

        rice[name] = value;
        return rice;
    }

    rice.build = (name, build) => {
        rice._.build[name] = {}
        
        var done = build.apply(rice)
        
        if(done){
            return window.rice = done;
        }
        
        return rice;
    }

    rice.cache = (name, value) => {
        if (!value) {
            return rice._.cache[name] ? rice._.cache[name] : undefined;
        }
        else {
            rice._.cache[name] = value;
        }
    }

    rice.global = (name, value) => {
        if (!value) {
            return rice._.globals[name] ? rice._.globals[name] : undefined;
        }
        else {
            rice._.globals[name] = value;
        }
    }

    rice.addService = (name, value) => {
        if (rice._.services[name]) {
            return console.error(`Can not create the "${name}" service. Another service with this name already exists`)
        }

        rice._.services[name] = value;
    }

    rice.initService = (name, ...args) => {
        if (!rice._.services[name]) {
            return console.error(`There is no registered service called "${name}"`)
        }

        rice.service[name] = rice._.services[name].apply(null, args);

        if (rice.service[name].init) {
            rice.service[name].init();
        }
    }

    rice.initAllServices = (args = {}) => {
        for (let name in rice._.services) {
            var arg = [name]

            if (args[name]) {
                if (Array.isArray(args[name])) {
                    args[name].map((item) => {
                        arg.push(args[item])
                    })
                }
                else {
                    arg.push(args[name])
                }
            }

            rice.initService.apply(null, arg)
        }
    }

    rice.stopService = (name) => {
        if (rice.service[name]) {
            if (rice.service[name].stop) {
                rice.service[name].stop(() => {
                    delete rice.service[name];
                })
            }
            else {
                delete rice.service[name]
            }

            delete rice._.services[name]
        }
    }

    rice.stopAllServices = function(name) {
        for (let name in rice.service) {
            rice.stopService(name)
        }
    }

    rice.addController = function(name, controller) {
        rice._.controllers[name] = controller;
    }

    rice.controller = function(name, ...args) {
        try {
            var control = rice._.controllers[name]
            return control.apply(null, args);
        }
        catch (e) {
            if (!rice._.controllers[name]) {
                return console.error(`The controller "${name}" has not been registered. Use Rice.addController("${name}", function(){...}) to register it.`)
            }
            else {
                console.error(e)
            }
        }
    }

    return rice;
})()
