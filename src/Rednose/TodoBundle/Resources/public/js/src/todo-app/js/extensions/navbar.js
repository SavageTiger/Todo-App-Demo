/*global Routing */
/*jshint boss:true, expr:true, onevar:false */

var Navbar = Y.Base.create('navBar', Y.Base, [], {

    // -- Protected Properties -------------------------------------------------

    /**
     * @type {Rednose.Navbar}
     */
    _navbar: null,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        var node = this.get('navbarContainer');

        this._navbar = new Y.Rednose.Navbar({
            title       : APP_NAME,
            columnLayout: true,
            container   : node,

            menu        : [],
            menuSecondary: [
                {
                    title: 'Extra', items: [
                        { url  : Routing.generate('todo_app_projects_export'), title: 'Export', icon: 'icon-download' }
                    ]
                }
            ]
        });

        this._navbar.render();
    },

    destructor: function () {
        this._navbar.destroy();
        this._navbar = null;
    }
});

Y.namespace('TodoApp').Navbar = Navbar;