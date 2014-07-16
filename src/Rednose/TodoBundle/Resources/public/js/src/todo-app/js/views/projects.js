
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
