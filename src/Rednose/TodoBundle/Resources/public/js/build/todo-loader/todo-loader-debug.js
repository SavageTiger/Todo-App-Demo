YUI.add('todo-loader', function (Y, NAME) {

/* This file is auto-generated by (yogi loader --group todo --json false --tests false -js js/todo.js --yes --mix --start ../) */

/*jshint maxlen:900, eqeqeq: false */

/**
 * YUI 3 module metadata
 * @module loader
 * @submodule loader-yui3
 */
YUI.Env[Y.version].modules = YUI.Env[Y.version].modules || {};
Y.mix(YUI.Env[Y.version].modules, {
    "todo-app": {
        "group": "todo",
        "requires": [
            "node",
            "rednose-app",
            "todo-models"
        ]
    },
    "todo-models": {
        "group": "todo",
        "requires": [
            "model",
            "model-list",
            "io"
        ]
    }
});
YUI.Env[Y.version].md5 = '541256b9d0bce3bf75c445215605de61';


}, '@VERSION@');
