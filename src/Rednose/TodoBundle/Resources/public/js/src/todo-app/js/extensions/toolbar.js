
var Toolbar = Y.Base.create('toolbar', Y.Base, [], {

    // -- Protected Properties -------------------------------------------------

    /**
     * @type {Rednose.Toolbar}
     */
    _toolbar: null,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        var node = this.get('toolbarContainer');

        var buttonGroups = [
            {
                buttons: [
                    { id: 'add', icon: 'icon-plus', title: 'Add task' }
                ]
            },

            {
                buttons: [
                    { id: 'restore', icon: 'icon-arrow-left', title: 'Recover deleted task', disabled: true }
                ]
            }
        ];

        this._toolbar = new Y.Rednose.Toolbar({
            container: node,
            groups   : buttonGroups
        });

//        this._attachToolbarEventHandles();

        this._toolbar.addTarget(this);
        this._toolbar.render();    },

    destructor: function () {
        this._toolbar.destroy();
        this._toolbar = null;
    }
});

Y.namespace('TodoApp').Toolbar = Toolbar;