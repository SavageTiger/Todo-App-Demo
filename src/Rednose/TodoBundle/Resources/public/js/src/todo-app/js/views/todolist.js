
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
