# Ricejs
#### "Matches everything!"

## What I am?
Ricejs is a frontend integration framework for javascript applications. Its main feature is the architecture of the project, allowing the developer to work with any of the thousands of javascript frameworks on the internet.

Ricejs works in direct partnership with [Gulp](https://github.com/gulpjs/gulp), [Yeoman](https://github.com/yeoman/yeoman), [Babel](https://github.com/babel/babel) and [Browserify](https://github.com/substack/node-browserify).

## Install
### or Ricejs to Yeoman
```
npm install -g yo generator-ricejs && yo ricejs
```
### or Rice core
```
npm install ricejs
```

## Architecture
Ricejs guarantees a simple, intuitive and organized file architecture.

```
+-- app
|   +-- assets
|   +-- configs
|   +-- controllers
|   +-- libs
|   +-- services
|   +-- views
|   +-- app.js
+-- public
+-- node_modules
+-- gulpfiles.js
```

To start a project with ricejs, once installed, just run ricejs on the terminal. When everything is installed and completed, run gulp live to enable automatic scripting.

### Live reload
The [livereload](https://github.com/vohof/gulp-livereload) is responsible for dynamically updating web pages. You will need to install extensions for browsers. You can find these extensions at [livereload.com/extensions](http://livereload.com/extensions/).

## ECMAScript 6 e Node Modules 
Ricejs comes configured by default to work with *ECMAScript 6* carrying your built-in script to *ECMAScript 5*. He uses the *Babel* to do this task.

### Browserify
Browserify guarantees the use of npm modules in your application, learn more at [node-browserify] (https://github.com/substack/node-browserify)

## Config method's
The Ricejs settings handling method allows you to easily manipulate your application settings.
They come with an identifier called "String to tree object".

### String to tree object

Here is a demonstration of tree structure of a configuration object
```json
{
    "page": {
        "name" : "home"
    },
    "user": {
        "id": 123,
        "name": "Assis"
    }
}
```

Traditionally you would get the value of page.name so `config.page.name`, and this is how you will indicate the object to be handled (add, get, set) with the configuration methods.

### addConfig, getConfig, setConfig
#### add
Let's add some data to our configuration:
```javascript
 Rice.addConfig("page.name", "home")
 Rice.addConfig("user.name", "Assis")
```
#### set
Now, let's modify them
```javascript
 Rice.setConfig("page.name", "contact")
 Rice.setConfig("user.name", "Philippe")
```
#### get
In the end, let's get it.
```javascript
 Rice.getConfig("page.name") // contact
 Rice.setConfig("user.name") // Philippe
 Rice.setConfig() // Complete tree of the config object
```

## Controllers
All controllers must be available in `app / controllers`, using the suffix **Controller.js**.
Controllers are modules that allow you to organize your application by task groups.

To start a controller, simply declare `Rice.controller ('CONTROLLER_NAME')`.

## Services
The services must be available in `app/services`, using the suffix **Service.js**.
The services are modules intended to work with an application service.

Some methods must be available in this module, such as **start**, **stop**, **restart**, **reload**.
Its default structure is this:
```javascript
import Rice from 'ricejs'

exports function myService(){
    this.start = () => {/*...*/} // Required
    
    this.restart = () => {/*...*/} 
    
    this.reload = () => {/*...*/}
    
    this.stop = () => {/*...*/}
    
    return this;
}
```
The **start method** is required only one..

## All methods
 - **addConstructor(build)**: Adds a counter to start along with the rice. Used mainly for plugins.
 - **init()**: Rice builders start.
 - **addConfig(name, value)**: Add a setting.
 - **setConfig(name, value)**: Change a setting.
 - **getConfig()**: Get value of a setting.
 - **add(name, value)**: Adds a property to the root of the Rice object.
 - **build(name, build)**: To creation of plugins.
 - **cache(name, value)**: Specific for temporary data.
 - **global()**: Specific to global data that may be wanted throughout the application.
 - **import()**: Imports a library/module within the structure of rice.
 - **controller()**: Start a controller.
 - **service()**: Start a service.
 - **lib()**: Start a library.
 - **allServices(method)**: Would call one method on every imported service