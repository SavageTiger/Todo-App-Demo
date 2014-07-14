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

Y.namespace('TodoApp').Navbar = Navbar;/*jshint boss:true, expr:true, onevar:false */

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

    Y.TodoApp.Navbar
], {

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
     * @private
     */
    _handleOpenProject: function (e) {
        console.log(e);
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

    template: '<div><ul class="nav nav-tabs nav-stacked"></ul></div>',

    titleTemplate: '<h3>' + VIEW_TITLE + '</h3>',

    itemTemplate: '<li><a href="#"></a></li>',

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

        this.get('container').all('*').detachAll();

        this._events = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
     * (Re-)Render the view
     */
    render: function () {
        var container = this.get('container');

        container.all('*').detach('click');
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

            anchor.setHTML(project.get('name'));
            anchor.on('click', self._handleItemClicked, self);
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

        this.fire('openProject', { model: model });
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

Y.namespace('TodoApp').ProjectsView = ProjectsView;


}, '@VERSION@', {"requires": ["node", "rednose-app", "rednose-navbar", "todo-models"], "skinnable": true});
