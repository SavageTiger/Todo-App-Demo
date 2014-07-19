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

    /**
     * Removed tasks that can be recovered
     *
     * @type {Array<{project: Y.TodoApp.Project, task: Y.TodoApp.Task}>}
     */
    _removedModels: null,

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
            this.after('todoListView:taskRemoved', this._handleTaskRemoved, this),
            this.after('todoListView:taskAdded', this._handleTaskAdded, this)
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
        Y.Array.each(this._removedModels, function (deletedTask) {
            deletedTask.task.destroy();
            deletedTask.task = null;
        });
        this._removedModels = null;

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
     * Persist changes; Permanently remove tasks
     *
     * @private
     */
    _saveProjects: function () {
        var projects = this._projectsView.get('model');

        // Persist changes
        projects.each(function (project) {
            project.save();
        });

        // Destroy removed tasks
        Y.Array.each(this._removedModels, function (deletedTask) {
            deletedTask.task.destroy({ remove: true });
            deletedTask.task = null;
        });

        this._removedModels = null;

        // Update the toolbar button status.
        this._handleTaskRemoved(null);
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
            var model = null;

            // Add project
            if (modelType === 'project') {
                var projectsModel = self._projectsView.get('model');

                // Create new project model
                model = new Y.TodoApp.Project({ name: value, modified: true });

                projectsModel.add(model);

                self._projectsView.render();
            }

            // Add task
            if (modelType === 'task') {
                var view    = self.get('activeView'),
                    project = view.get('model');

                // Create new task model
                model   = new Y.TodoApp.Task({ description: value });

                project.get('tasks').add(model);
                project.set('modified', true);

                view.render();
            }
        });
    },

    /**
     * Fired when a task is removed from the todoListView
     *
     * @param {EventFacade|null} e
     * @private
     */
    _handleTaskRemoved: function (e) {
        if (this._removedModels === null) {
            this._removedModels = [];
        }

        if (e) {
            this._removedModels.push({
                project: e.projectModel,
                task: e.taskModel
            });
        }

        if (this._removedModels !== null && this._removedModels.length > 0) {
            this.enableRestore();
        } else {
            this.disableRestore();
        }
    },

    /**
     * Fired when the restore task button is clicked in the toolbar
     *
     * @private
     */
    _handleRestore: function () {
        var view = this.get('activeView');

        if (this._removedModels !== null && this._removedModels.length > 0) {
            var deletedTask = this._removedModels.pop();

            deletedTask.project.get('tasks').add(
                deletedTask.task
            );

            // Only re-render the view if the project is on-screen.
            if (deletedTask.project.get('clientId') === view.get('model').get('clientId')) {
                view.render();
            }
        }

        // Update the toolbar button status.
        this._handleTaskRemoved(null);
    }


}, {
    ATTRS: {
    }
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('TodoApp').App = TodoApp;
