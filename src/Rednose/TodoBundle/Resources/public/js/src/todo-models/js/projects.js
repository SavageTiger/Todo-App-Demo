/*global Routing */
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