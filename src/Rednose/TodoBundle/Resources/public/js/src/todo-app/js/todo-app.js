/*jshint boss:true, expr:true, onevar:false */

var APP_NAME = 'Todo App Demo';

/**
 * Todo App
 *
 * @class TodoApp
 * @namespace TodoApp
 * @constructor
 * @extends Rednose.App
 */
var TodoApp = Y.Base.create('todoApp', Y.Rednose.App, [
    Y.Rednose.View.Template.Navbar,
    Y.Rednose.View.Template.MasterDetail,
    Y.Rednose.View.Template.Toolbar
], {

    // -- Lifecycle methods ----------------------------------------------------

    /**
     * Constructor
     *
     * @param config
     */
    initializer: function (config) {
        TodoApp.superclass.initializer.apply(this, arguments);

        this.after('ready', function () {
            Y.Rednose.App.setTitle(APP_NAME, false);
        });
    }

}, {
    ATTRS: {
    }
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('TodoApp').App = TodoApp;
