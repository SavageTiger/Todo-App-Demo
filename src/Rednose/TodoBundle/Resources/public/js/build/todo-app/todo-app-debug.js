YUI.add('todo-app', function (Y, NAME) {

/*jshint boss:true, expr:true, onevar:false */

/**
 * Todo App
 *
 * @class TodoApp
 * @namespace TodoApp
 * @constructor
 * @extends Rednose.App
 */
var TodoApp = Y.Base.create('todoApp', Y.Rednose.App, [], {

    // -- Lifecycle methods ----------------------------------------------------

    /**
     * Constructor
     *
     * @param config
     */
    initializer: function (config) {
        TodoApp.superclass.initializer.apply(this, arguments);
    }

}, {
    ATTRS: {
    }
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('TodoApp').App = TodoApp;


}, '@VERSION@', {"requires": ["node", "rednose-app"]});
