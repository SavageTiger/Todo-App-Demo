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