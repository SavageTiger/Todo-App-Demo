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