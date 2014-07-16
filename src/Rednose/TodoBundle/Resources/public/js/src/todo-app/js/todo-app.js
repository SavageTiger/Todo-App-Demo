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
    Y.Rednose.View.Template.Toolbar,

    Y.TodoApp.Navbar,
    Y.TodoApp.Toolbar
], {

    // -- Public Properties ----------------------------------------------------

    /**
     * @see {App.Views}
     */
    views: {
        todoListView: {
            type: 'TodoApp.TodoListView'
        }
    },

    // -- Protected Properties -------------------------------------------------

    /**
     * @type {Array}
     */
    _events: null,

    /**
     * @type {Y.TodoApp.ProjectstView}
     */
    _projectsView: null,

    // -- Lifecycle methods ----------------------------------------------------

    /**
     * Constructor
     *
     * @param config
     */
    initializer: function () {
        this._events = [];

        this._projectsView = new Y.TodoApp.ProjectsView();
        this._projectsView.addTarget(this);

        this._events.push(
            this.after('projectsView:openProject', this._handleOpenProject, this),
            this.after('todoListView:taskRemoved', this._handleTaskRemoved, this)
        );

        this.after('ready', function () {
            this._projectsView.set('container', this.get('rightContainer'));

            this._loadProjects();

            Y.Rednose.App.setTitle(APP_NAME, false);
        });

        TodoApp.superclass.initializer.apply(this, arguments);
    },

    /**
     * Destructor
     */
    destructor: function () {
        this.detach(this._events);

        this._events = null;
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
    },

    /**
     * Open project
     *
     * @param {EventFacade} e
     * @private
     */
    _handleOpenProject: function (e) {
        this.showView('todoListView', {
            model: e.model
        });
    },

    /**
     * Fired when a task is removed from the todoListView
     *
     * @param {EventFacade} e
     * @private
     */
    _handleTaskRemoved: function (e) {
        if (e.queue) {
            this.enableRestore();
        } else {
            this.disableRestore();
        }
    },

    /**
     * Fired when the addTask or addProject button is clicked in the toolbar
     *
     * @param {string} modelType Expected 'project' or 'task'
     * @private
     */
    _handleAdd: function (modelType) {
        var self   = this,
            dialog = new Y.Rednose.Dialog();

        dialog.prompt({
            title: 'Add new ' + modelType,
            text: 'Name'
        }, function (value) {

            // Add project
            if (modelType === 'project') {
                var projectsModel = self._projectsView.get('model');

                var model = new Y.TodoApp.Project({ name: value });

                projectsModel.add(model);

                self._projectsView.render();
            }

            // Add task
            if (modelType === 'task') {
                var view    = self.get('activeView'),
                    project = view.get('model');

                var model   = new Y.TodoApp.Task({ description: value });

                project.get('tasks').add(model);

                view.render();
            }
        });
    },

    /**
     * Fired when the restore task button is clicked in the toolbar
     *
     * @private
     */
    _handleRestore: function () {
        var view = this.get('activeView');

        if (view && Y.instanceOf(view, Y.TodoApp.TodoListView)) {
            view.restoreItem();
        }
    }


}, {
    ATTRS: {
    }
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('TodoApp').App = TodoApp;
