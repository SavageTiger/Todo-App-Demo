YUI.add('todo-app', function (Y, NAME) {

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

    // -- properties properties ------------------------------------------------

    _projectsView: null,

    // -- Lifecycle methods ----------------------------------------------------

    /**
     * Constructor
     *
     * @param config
     */
    initializer: function () {
        this._projectsView = new Y.TodoApp.ProjectsView();

        this.after('ready', function () {
            this._projectsView.set('container', this.get('rightContainer'));

            this._loadProjects();

            Y.Rednose.App.setTitle(APP_NAME, false);
        });

        TodoApp.superclass.initializer.apply(this, arguments);
    },

    // -- Protected methods ----------------------------------------------------

    /**
     * Load the projects model
     *
     * @private
     */
    _loadProjects: function () {
        var self     = this,
            projects = new Y.TodoApp.Projects();

        projects.load(function() {
            self._projectsView.set('model', projects);
        });
    }

}, {
    ATTRS: {
    }
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('TodoApp').App = TodoApp;
var ProjectsView;

ProjectsView = Y.Base.create('projectsView', Y.View, [], {

    // -- Public properties ----------------------------------------------------

    template: '<ul class="nav nav-tabs nav-stacked"></ul>',

    itemTemplate: '<li></li>',

    // -- Protected Properties -------------------------------------------------

    /**
     * @type {Array}
     */
    _events: null,

    // -- Lifecycle Methods ----------------------------------------------------

    /**
     * Constructor
     */
    initializer: function () {
        this._events = [];

        this._events.push(
            this.after('modelChange', this.render, this)
        );
    },

    /**
     * Destructor
     */
    destructor: function () {
        this.detach(this._events);

        this._events = null;
    },

    // -- Public Methods -------------------------------------------------------

    render: function () {
        var self      = this,
            container = this.get('container'),
            list      = Y.Node.create(this.template),
            projects  = this.get('model');

        Y.each(projects, function(project) {
            var li = Y.Node.create(self.itemTemplate);

            li.setHTML(project.get('name'));

            list.append(li);
        });

        container.append(list);
    }

    // -- Protected Methods ----------------------------------------------------

    // Stub..

}, {
    ATTRS: {
        /**
         * The project model
         *
         * @attribute elementModel
         * @type {Y.TodoApp.Project}
         */
        model: {
            value: null
        }
    }
});

Y.namespace('TodoApp').ProjectsView = ProjectsView;

}, '@VERSION@', {"requires": ["node", "rednose-app", "todo-models"]});
