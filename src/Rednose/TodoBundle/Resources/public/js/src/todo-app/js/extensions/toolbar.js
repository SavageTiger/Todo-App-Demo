/*jshint boss:true, expr:true, onevar:false */

var Toolbar = Y.Base.create('toolbar', Y.Base, [], {

    // -- Protected Properties -------------------------------------------------

    /**
     * Event reference container
     *
     * @type {Array}
     */
    _toolbarEvents: null,

    /**
     * @type {Rednose.Toolbar}
     */
    _toolbar: null,

    // -- Lifecycle Methods ----------------------------------------------------

    /**
     * Constructor
     */
    initializer: function () {
        var node = this.get('toolbarContainer');

        var buttonGroups = [
            {
                buttons: [
                    { id: 'addTask', value: 'Task', icon: 'icon-plus', title: 'Add task' },
                    { id: 'addProject', value: 'Project', icon: 'icon-plus', title: 'Add project' }
                ]
            },

            {
                buttons: [
                    { id: 'save', icon: 'icon-hdd', title: 'Commit changes' }
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

        this._attachToolbarEventHandles();

        this._toolbar.addTarget(this);
        this._toolbar.render();
    },

    /**
     * Destructor
     */
    destructor: function () {
        this._detachToolbarEvents();

        this._toolbar.destroy();
        this._toolbar = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
     * Enable restore button
     */
    enableRestore: function () {
        this._toolbar.getButtonById('restore').enable();
    },

    /**
     * Disable restore button
     */
    disableRestore: function () {
        this._toolbar.getButtonById('restore').disable();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Bind events
     *
     * @private
     */
    _attachToolbarEventHandles: function () {
        if (this._toolbarEvents === null) {
            this._toolbarEvents = [];
        }

        this._toolbarEvents.push(
            this.after({
                'toolbar:click#addTask'    : this._handleAddClicked,
                'toolbar:click#addProject' : this._handleAddClicked,
                'toolbar:click#save'       : this._saveProjects,
                'toolbar:click#restore'    : this._handleRestore
            })
        );
    },

    /**
     * Destroy events
     *
     * @private
     */
    _detachToolbarEvents: function () {
        (new Y.EventHandle(this._toolbarEvents)).detach();
    },

    /**
     * Fires when AddProject or AddTask is clicked
     *
     * @param {EventFacade} e
     * @private
     */
    _handleAddClicked: function (e) {
        if (e.button.get('id').indexOf('Project') !== -1) {
            this._handleAdd('project');
        } else {
            this._handleAdd('task');
        }
    }

});

Y.namespace('TodoApp').Toolbar = Toolbar;