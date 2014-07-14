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
            "template-micro",
            "rednose-app",
            "rednose-navbar",
            "todo-models"
        ],
        "skinnable": true
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
YUI.Env[Y.version].md5 = '83d42dda975fa4bd8f27d9a47cc610f2';
