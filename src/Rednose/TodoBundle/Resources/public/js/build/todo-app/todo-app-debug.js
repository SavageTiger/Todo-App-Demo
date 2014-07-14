YUI.add('todo-app', function (Y, NAME) {


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
            container   : node
        });

        this._navbar.render();
    },

    destructor: function () {
        this._navbar.destroy();
        this._navbar = null;
    }
});

Y.namespace('TodoApp').Navbar = Navbar;
var Toolbar = Y.Base.create('toolbar', Y.Base, [], {

    // -- Protected Properties -------------------------------------------------

    /**
     * @type {Rednose.Toolbar}
     */
    _toolbar: null,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        var node = this.get('toolbarContainer');

        var buttonGroups = [
            {
                buttons: [
                    { id: 'add', icon: 'icon-plus', title: 'Add task' }
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

//        this._attachToolbarEventHandles();

        this._toolbar.addTarget(this);
        this._toolbar.render();    },

    destructor: function () {
        this._toolbar.destroy();
        this._toolbar = null;
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
            this.after('projectsView:openProject', this._handleOpenProject, this)
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
    }

}, {
    ATTRS: {
    }
});

// -- Namespace ----------------------------------------------------------------
Y.namespace('TodoApp').App = TodoApp;

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

    itemTemplate: '<li><a href="#"><i class="icon-list-alt"></i>&nbsp;</a></li>',

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

var TodoListView;

var Micro = Y.Template.Micro;

TodoListView = Y.Base.create('projectsView', Y.View, [ ], {

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

    // -- Protected properties -------------------------------------------------

    /**
     * Removed tasks that can be recovered
     *
     * @type {Array<Y.TodoApp.Task>}
     */
    _removedModels: null,

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
        var node          = e.currentTarget,
            projectsModel = this.get('model'),
            model         = node.ancestor('tr').getData('model');

        if (this._removedModels === null) {
            this._removedModels = [];
        }
        this._removedModels.push(model);

        projectsModel.get('tasks').remove(model);

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


}, '@VERSION@', {"requires": ["node", "template-micro", "rednose-app", "rednose-navbar", "todo-models"], "skinnable": true});
