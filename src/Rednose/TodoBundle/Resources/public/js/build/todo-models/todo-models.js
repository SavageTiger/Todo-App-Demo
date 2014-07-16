YUI.add('todo-models', function (Y, NAME) {

/*jshint onevar:false */

var TaskModel = Y.Base.create('taskModel', Y.Model, [], {

}, {
    ATTRS: {
        /**
         * Task description
         *
         * @type {String}
         */
        description: {
            value: ''
        },

        /**
         * Ready state
         *
         * @type {boolean}
         */
        ready: {
            value: false
        }
    }
});

// --- Namespace ---------------------------------------------------------------

Y.namespace('TodoApp').Task = TaskModel;/*jshint onevar:false */

var ProjectModel = Y.Base.create('projectModel', Y.Model, [], {

    initializer: function (data) {
        if (data.tasks) {
            this.set('tasks', data.tasks);
        }
    },

    sync: function (action, options, callback) {
        var modified = false,
            route;

        // Are there any states changed?
        this.get('tasks').each(function (task) {
            if (task.isModified()) {
                modified = true;
            }
        })

        // Are there tasks added or removed?
        if (this.get('modified') === true) {
            modified = true;
        }

        if (modified === false) {
            return;
        }

        if (action === 'create') {
            route = Routing.generate('todo_app_project_create');
        } else if (action === 'update') {
            route = Routing.generate('todo_app_project_update', { id: this.get('id') });
        }

        Y.io(route, {
            method: 'POST',
            data: Y.JSON.stringify(
                this.getAttrs(['name', 'tasks'])
            ),
            on : {
                success: function (tx, r) {
                    this.set('modified', false);

                    callback(null, Y.JSON.parse(r.responseText));
                }
            }
        });
    },

    _setTasks: function (tasks) {
        var buffer = new Y.ModelList();

        // Set sort function
        buffer.comparator = this._taskComparator;

        Y.each(tasks, function (task) {
            if (Y.instanceOf(task, Y.TodoApp.Task)) {
                buffer.add(task);
            } else {
                buffer.add(new Y.TodoApp.Task(task));
            }
        });

        return buffer;
    },

    /**
     * Sort tasks
     *
     * @see {Y.ModelList}
     * @param model
     * @returns integer
     */
    _taskComparator: function (model) {
        var clientId = model.get('clientId');

        clientId = clientId.substring(clientId.indexOf('_') + 1);
        clientId = parseInt(clientId, 8);

        return clientId;
    }

}, {
    ATTRS: {
        /**
         * The project name
         *
         * @type {String}
         */
        name: {
            value: ''
        },

        /**
         * Tasks
         *
         * @type {Y.ModelList<Y.TodoApp.Task>}
         */
        tasks: {
            value: null,
            setter: '_setTasks'
        },

        /**
         * Modified status (not isModified)
         *
         * @type {Boolean}
         */
        modified: {
            value: false
        }
    }
});

// --- Namespace ---------------------------------------------------------------

Y.namespace('TodoApp').Project = ProjectModel;/*global Routing */
/*jshint onevar:false */

var ProjectsModel = Y.Base.create('projectsModel', Y.ModelList, [], {

    model: Y.TodoApp.Project,

    sync: function (action, options, callback) {
        if (action === 'read') {
            Y.io(Routing.generate('todo_app_projects_read'), {
                method: 'GET',
                on : {
                    success: function (tx, r) {
                        callback(null, Y.JSON.parse(r.responseText));
                    }
                }
            });
        }
    }

});

// --- Namespace ---------------------------------------------------------------

Y.namespace('TodoApp').Projects = ProjectsModel;

}, '@VERSION@', {"requires": ["model", "model-list", "io"]});
