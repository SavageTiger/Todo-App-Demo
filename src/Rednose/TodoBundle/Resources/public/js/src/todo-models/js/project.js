/*jshint onevar:false */

var ProjectModel = Y.Base.create('projectModel', Y.Model, [], {

    initializer: function (data) {
        if (data.tasks) {
            this.set('tasks', data.tasks);
        }
    },

    _setTasks: function (tasks) {
        var buffer = new Y.ModelList;

        Y.each(tasks, function (task) {
            if (Y.instanceOf(task, Y.TodoApp.Task)) {
                buffer.add(task);
            } else {
                buffer.add(new Y.TodoApp.Task(task));
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