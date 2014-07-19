/*global Routing */
/*jshint onevar:false */

var TaskModel = Y.Base.create('taskModel', Y.Model, [], {

    sync: function (action, options, callback) {
        if (action === 'delete') {

            // Only do an ajax call if I have an Id
            if (this.get('id')) {
                Y.io(Routing.generate('todo_app_task_remove', { id: this.get('id') }), {
                    method: 'POST'
                });
            }

        }
    }

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

Y.namespace('TodoApp').Task = TaskModel;