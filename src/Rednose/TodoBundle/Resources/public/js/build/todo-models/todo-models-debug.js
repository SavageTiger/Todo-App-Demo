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
        return model.get('id');
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
        }
    }
});

// --- Namespace ---------------------------------------------------------------

Y.namespace('TodoApp').Project = ProjectModel;/*global Routing */
/*jshint onevar:false */

var ProjectsModel = Y.Base.create('projectsModel', Y.ModelList, [], {

    model: Y.TodoApp.Project,

    sync: function (action, options, callback) {
        switch (action) {
            case 'read':
                Y.io(Routing.generate('todo_app_projects_read'), {
                    method: 'GET',
                    on : {
                        success: function (tx, r) {
                            callback(null, Y.JSON.parse(r.responseText));
                        }
                    }
                });
                return;
        }
    }

});

// --- Namespace ---------------------------------------------------------------

Y.namespace('TodoApp').Projects = ProjectsModel;

}, '@VERSION@', {"requires": ["model", "model-list", "io"]});
