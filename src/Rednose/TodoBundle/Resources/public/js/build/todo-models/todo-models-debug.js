YUI.add('todo-models', function (Y, NAME) {

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
            value: false,
        }
    }
});

// --- Namespace ---------------------------------------------------------------

Y.namespace('TodoApp').Task = TaskModel;
var ProjectModel = Y.Base.create('projectModel', Y.Model, [], {

    initializer: function (data) {
        if (data.tasks) {
            this.set('tasks', data.tasks);
        }
    },

    _setTasks: function (tasks) {
        var buffer = [];

        Y.each(tasks, function (task) {
            if (Y.instanceOf(task, Y.TodoApp.Task)) {
                buffer.push(task);
            } else {
                buffer.push(new Y.TodoApp.Task(task));
            }
        });

        return buffer;
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

Y.namespace('TodoApp').Project = ProjectModel;
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
