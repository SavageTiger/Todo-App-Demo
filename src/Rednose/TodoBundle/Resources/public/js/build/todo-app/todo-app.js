YUI.add('todo-app', function (Y, NAME) {

/*global Routing */
/*jshint boss:true, expr:true, onevar:false */

var Navbar = Y.Base.create('navBar', Y.Base, [], {

    // -- Protected Properties -------------------------------------------------

    /**
     * @type {Rednose.Navbar}
     */
    _navbar: null,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        var node = this.get('navbarContainer');

        this._navbar = new Y.Rednose.Navbar({
            title       : APP_NAME,
            columnLayout: true,
            container   : node,

            menu        : [],
            menuSecondary: [
                {
                    title: 'Extra', items: [
                        { url  : Routing.generate('todo_app_projects_export'), title: 'Export', icon: 'icon-download' }
                    ]
                }
            ]
        });

        this._navbar.render();
    },

    destructor: function () {
        this._navbar.destroy();
        this._navbar = null;
    }
});

Y.namespace('TodoApp').Navbar = Navbar;/*jshint boss:true, expr:true, onevar:false */

var Toolbar = Y.Base.create('toolbar', Y.Base, [], {

    // -- Protected Properties -------------------------------------------------

    /**
     * Event reference container
     *
     * @type {Array}
     */
    _toolbarEvents: null,

    /**
     * @type {Rednose.Toolbar}
     */
    _toolbar: null,

    // -- Lifecycle Methods ----------------------------------------------------

    /**
     * Constructor
     */
    initializer: function () {
        var node = this.get('toolbarContainer');

        var buttonGroups = [
            {
                buttons: [
                    { id: 'addTask', value: 'Task', icon: 'icon-plus', title: 'Add task' },
                    { id: 'addProject', value: 'Project', icon: 'icon-plus', title: 'Add project' }
                ]
            },

            {
                buttons: [
                    { id: 'save', icon: 'icon-hdd', title: 'Commit changes' }
                ]
            },

            {
                buttons: [
                    { id: 'restore', icon: 'icon-arrow-left', title: 'Recover deleted task', disabled: true }
                ]
            }
        ];

        this._toolbar = new Y.Rednose.Toolbar({
            container: node,
            groups   : buttonGroups
        });

        this._attachToolbarEventHandles();

        this._toolbar.addTarget(this);
        this._toolbar.render();
    },

    /**
     * Destructor
     */
    destructor: function () {
        this._detachToolbarEvents();

        this._toolbar.destroy();
        this._toolbar = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
     * Enable restore button
     */
    enableRestore: function () {
        this._toolbar.getButtonById('restore').enable();
    },

    /**
     * Disable restore button
     */
    disableRestore: function () {
        this._toolbar.getButtonById('restore').disable();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Bind events
     *
     * @private
     */
    _attachToolbarEventHandles: function () {
        if (this._toolbarEvents === null) {
            this._toolbarEvents = [];
        }

        this._toolbarEvents.push(
            this.after({
                'toolbar:click#addTask'    : this._handleAddClicked,
                'toolbar:click#addProject' : this._handleAddClicked,
                'toolbar:click#save'       : this._saveProjects,
                'toolbar:click#restore'    : this._handleRestore
            })
        );
    },

    /**
     * Destroy events
     *
     * @private
     */
    _detachToolbarEvents: function () {
        (new Y.EventHandle(this._toolbarEvents)).detach();
    },

    /**
     * Fires when AddProject or AddTask is clicked
     *
     * @param {EventFacade} e
     * @private
     */
    _handleAddClicked: function (e) {
        if (e.button.get('id').indexOf('Project') !== -1) {
            this._handleAdd('project');
        } else {
            this._handleAdd('task');
        }
    }

});

Y.namespace('TodoApp').Toolbar = Toolbar;/*jshint boss:true, expr:true, onevar:false */

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
/*jshint boss:true, expr:true, onevar:false */

var ProjectsView;

var VIEW_TITLE = 'Projects';

ProjectsView = Y.Base.create('projectsView', Y.View, [ ], {

    // -- Public properties ----------------------------------------------------

    /**
     * Automagicly created events.
     *
     * @see {View}
     */
    events: {
        'a': {
            click: '_handleItemClicked'
        }
    },

    template: '<div><ul class="nav nav-tabs nav-stacked"></ul></div>',

    titleTemplate: '<h3>' + VIEW_TITLE + '</h3>',

    itemTemplate: '<li><a href="#"><i class="icon-tasks"></i>&nbsp;</a></li>',

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

    /**
     * (Re-)Render the view
     */
    render: function () {
        var container = this.get('container');

        container.all('*').remove();

        container.append(this.template);
        container.one('div').prepend(this.titleTemplate);

        this._renderProjectItems();
        this._openFirstProject();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Render a list of projects and add it to the container node
     *
     * @private
     */
    _renderProjectItems: function () {
        var self      = this,
            first     = true,
            container = this.get('container'),
            list      = container.one('ul'),
            projects  = this.get('model');

        Y.each(projects, function(project) {
            var item = Y.Node.create(self.itemTemplate),
                anchor = item.one('a');

            anchor.append(project.get('name'));
            anchor.setData('model', project);

            if (first) {
                item.addClass('active');

                first = false;
            }

            list.append(item);
        });
    },

    /**
     * Open the first project
     *
     * @private
     */
    _openFirstProject: function () {
        var container = this.get('container'),
            firstNode = container.one('ul').one('.active');

        if (firstNode) {
            this._handleItemClicked({ currentTarget: firstNode.one('a') });
        }
    },

    /**
     * Callback fired when a project is clicked
     *
     * @param {EventFacade} e
     * @private
     */
    _handleItemClicked: function (e) {
        var node  = e.currentTarget,
            model = node.getData('model');

        node.ancestor('ul').all('.active').removeClass('active');
        node.get('parentNode').addClass('active');

        this.fire('openProject', { model: model });
    }

}, {
    ATTRS: {
        /**
         * The projects model
         *
         * @attribute elementModel
         * @type {Y.TodoApp.Projects}
         */
        model: {
            value: null
        }
    }
});

Y.namespace('TodoApp').ProjectsView = ProjectsView;
/*jshint boss:true, expr:true, onevar:false */

var TodoListView;

var Micro = Y.Template.Micro;

TodoListView = Y.Base.create('todoListView', Y.View, [ ], {

    // -- Public properties ----------------------------------------------------

    /**
     * Automagicly created events.
     *
     * @see {View}
     */
    events: {
        'input[type=checkbox]': {
            click: '_handleStateClicked'
        },

        'i.icon-remove': {
            click: '_handleRemoveClicked'
        }
    },

    template:
        '<div>' +
            '<table class="table">' +
                '<thead>' +
                    '<tr>' +
                        '<th width="10%">Status</th>' +
                        '<th width="80%">Description</th>' +
                        '<th width="10%">Remove</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                '</tbody>' +
            '</table>' +
        '</div>',

    itemTemplate: Micro.compile(
        '<tr <% if (data.ready) { %> class="success" <% } %>>' +
            '<td><input type="checkbox" <% if (data.ready) { %> checked="checked" <% } %> /></td>' +
            '<td><%= data.description %></td>' +
            '<td><i class="icon-remove"></i></td>' +
        '</tr>'
    ),

    // -- Public Methods -------------------------------------------------------

    /**
     * (Re-)Render the view
     */
    render: function () {
        var container = this.get('container');

        // Clean view
        container.setHTML('');
        container.append(this.template);

        this._renderList();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Render a table container all the tasks in the
     * project model
     *
     * @private
     */
    _renderList: function () {
        var self      = this,
            container = this.get('container').one('tbody'),
            model     = this.get('model');

        Y.each(model.get('tasks'), function (task) {
            var record = Y.Node.create(
                self.itemTemplate(
                    task.getAttrs()
                )
            );

            record.setData('model', task);

            container.append(record);
        });
    },

    /**
     * Fired when a status checkbox is clicked
     *
     * @param {EventFacade} e
     * @private
     */
    _handleStateClicked: function (e) {
        var node  = e.currentTarget,
            model = node.ancestor('tr').getData('model');

        model.set('ready', node.get('checked'));

        this.render();
    },

    /**
     * Fired when a remove icon is clicked
     *
     * @param {EventFacade} e
     * @private
     */
    _handleRemoveClicked: function (e) {
        var node         = e.currentTarget,
            projectModel = this.get('model'),
            model        = node.ancestor('tr').getData('model');

        projectModel.get('tasks').remove(model);
        projectModel.set('modified', true);

        this.fire('taskRemoved', {
            projectModel: projectModel,
            taskModel: model
        });

        this.render();
    }


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

Y.namespace('TodoApp').TodoListView = TodoListView;


}, '@VERSION@', {
    "requires": [
        "node",
        "template-micro",
        "rednose-app",
        "rednose-navbar",
        "rednose-toolbar",
        "rednose-dialog",
        "todo-models"
    ],
    "skinnable": true
});
