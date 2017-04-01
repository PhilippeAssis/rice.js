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
}

function RiceCore() {
	var rice = {
		"service": {},
		"controller": {}
	}

	rice.name = "Rice!"

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
		} else {
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
		} else {
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
			} else {
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
			return Rice = done;
		}

		return rice;
	}

	rice.setCache = (name, value) => {
		var id = uuid();
		__RiceData._.cache[`${id}_${name}`] = value;
		return id;
	}

	rice.getCache = (id, name) => {
		if (name) {
			return __RiceData._.cache[`${id}_${name}`];
		}

		return __RiceData._.cache[id];
	}

	rice.removeCache = (id, name) => {
		if (name) {
			delete __RiceData._.cache[`${id}_${name}`];
			return;
		}

		delete __RiceData._.cache[id];
	}

	rice.global = (name, value) => {
		if (value == undefined) {
			return __RiceData._.globals[name] ? __RiceData._.globals[name] : undefined;
		} else {
			__RiceData._.globals[name] = value;
		}
	}

	rice.addService = (name, value) => {
		if (__RiceData._.services[name]) {
			return console.error(`Can not create the "${name}" service. Another service with this name already exists`)
		}

		__RiceData._.services[name] = value;
	}

	rice.initService = (name, ...args) => {
		if (!__RiceData._.services[name]) {
			return console.error(`There is no registered service called "${name}"`)
		}

		rice.service[name] = __RiceData._.services[name].apply(null, args);

		if (rice.service[name].init) {
			rice.service[name].init();
		}
	}

	rice.initAllServices = (args = {}) => {
		for (let name in __RiceData._.services) {
			var arg = [name]

			if (args[name]) {
				if (Array.isArray(args[name])) {
					args[name].map((item) => {
						arg.push(args[item])
					})
				} else {
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
			} else {
				delete rice.service[name]
			}

			delete __RiceData._.services[name]
		}
	}

	rice.stopAllServices = function (name) {
		for (let name in rice.service) {
			rice.stopService(name)
		}
	}

	rice.addController = function (name, controller) {
		__RiceData._.controllers[name] = controller;
	}

	rice.controller = function (name, ...args) {
		try {
			var control = __RiceData._.controllers[name]
			return control.apply(null, args);
		} catch (e) {
			if (!__RiceData._.controllers[name]) {
				return console.error(`The controller "${name}" has not been registered. Use Rice.addController("${name}", function(){...}) to register it.`)
			} else {
				console.error(e)
			}
		}
	}

	return rice;
}

if (typeof module == "object" && typeof module.exports == "object") {
	module.exports = new RiceCore();
} else {
	var Rice = new RiceCore();
}
