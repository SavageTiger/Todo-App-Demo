YUI.add("todo-app",function(e,t){var n=e.Base.create("navBar",e.Base,[],{_navbar:null,initializer:function(){var t=this.get("navbarContainer");this._navbar=new e.Rednose.Navbar({title:i,columnLayout:!0,container:t}),this._navbar.render()},destructor:function(){this._navbar.destroy(),this._navbar=null}});e.namespace("TodoApp").Navbar=n;var r=e.Base.create("toolbar",e.Base,[],{_toolbarEvents:null,_toolbar:null,initializer:function(){var t=this.get("toolbarContainer"),n=[{buttons:[{id:"addTask",value:"Task",icon:"icon-plus",title:"Add task"},{id:"addProject",value:"Project",icon:"icon-plus",title:"Add project"}]},{buttons:[{id:"save",icon:"icon-hdd",title:"Commit changes"}]},{buttons:[{id:"restore",icon:"icon-arrow-left",title:"Recover deleted task",disabled:!0}]}];this._toolbar=new e.Rednose.Toolbar({container:t,groups:n}),this._attachToolbarEventHandles(),this._toolbar.addTarget(this),this._toolbar.render()},destructor:function(){this._detachToolbarEvents(),this._toolbar.destroy(),this._toolbar=null},enableRestore:function(){this._toolbar.getButtonById("restore").enable()},disableRestore:function(){this._toolbar.getButtonById("restore").disable()},_attachToolbarEventHandles:function(){this._toolbarEvents===null&&(this._toolbarEvents=[]),this._toolbarEvents.push(this.after({"toolbar:click#addTask":this._handleAddClicked,"toolbar:click#addProject":this._handleAddClicked,"toolbar:click#save":this._saveProjects,"toolbar:click#restore":this._handleRestore}))},_detachToolbarEvents:function(){(new e.EventHandle(this._toolbarEvents)).detach()},_handleAddClicked:function(e){e.button.get("id").indexOf("Project")!==-1?this._handleAdd("project"):this._handleAdd("task")}});e.namespace("TodoApp").Toolbar=r;var i="Todo App Demo",s=e.Base.create("todoApp",e.Rednose.App,[e.Rednose.View.Template.Navbar,e.Rednose.View.Template.MasterDetail,e.Rednose.View.Template.Toolbar,e.TodoApp.Navbar,e.TodoApp.Toolbar],{views:{todoListView:{type:"TodoApp.TodoListView"}},_events:null,_projectsView:null,_removedModels:null,initializer:function(){this._events=[],this._projectsView=new e.TodoApp.ProjectsView,this._projectsView.addTarget(this),this._events.push(this.after("projectsView:openProject",this._handleOpenProject,this),this.after("todoListView:taskRemoved",this._handleTaskRemoved,this),this.after("todoListView:taskAdded",this._handleTaskAdded,this)),this.after("ready",function(){this._projectsView.set("container",this.get("rightContainer")),this._loadProjects(),e.Rednose.App.setTitle(i,!1)}),s.superclass.initializer.apply(this,arguments)},destructor:function(){e.Array.each(this._removedModels,function(e){e.task.destroy(),e.task=null}),this._removedModels=null,this.detach(this._events),this._events=null},_loadProjects:function(){var t=this,n=new e.TodoApp.Projects;n.load(function(){t._projectsView.set("model",n)})},_saveProjects:function(){var t=this._projectsView.get("model");t.each(function(e){e.save()}),e.Array.each(this._removedModels,function(e){e.task.destroy({remove:!0})})},_handleOpenProject:function(e){this.showView("todoListView",{model:e.model})},_handleAdd:function(t){var n=this,r=new e.Rednose.Dialog;r.prompt({title:"Add new "+t,text:"Name"},function(r){var i=null;if(t==="project"){var s=n._projectsView.get("model");i=new e.TodoApp.Project({name:r,modified:!0}),s.add(i),n._projectsView.render()}if(t==="task"){var o=n.get("activeView"),u=o.get("model");i=new e.TodoApp.Task({description:r}),u.get("tasks").add(i),u.set("modified",!0),o.render()}})},_handleTaskRemoved:function(e){this._removedModels===null&&(this._removedModels=[]),e&&this._removedModels.push({project:e.projectModel,task:e.taskModel}),this._removedModels!==null&&this._removedModels.length>0?this.enableRestore():this.disableRestore()},_handleRestore:function(){var e=this.get("activeView");if(this._removedModels!==null&&this._removedModels.length>0){var t=this._removedModels.pop();t.project.get("tasks").add(t.task),t.project.get("clientId")===e.get("model").get("clientId")&&e.render()}this._handleTaskRemoved(null)}},{ATTRS:{}});e.namespace("TodoApp").App=s;var o,u="Projects";o=e.Base.create("projectsView",e.View,[],{events:{a:{click:"_handleItemClicked"}},template:'<div><ul class="nav nav-tabs nav-stacked"></ul></div>',titleTemplate:"<h3>"+u+"</h3>",itemTemplate:'<li><a href="#"><i class="icon-tasks"></i>&nbsp;</a></li>',_events:null,initializer:function(){this._events=[],this._events.push(this.after("modelChange",this.render,this))},destructor:function(){this.detach(this._events),this._events=null},render:function(){var e=this.get("container");e.all("*").remove(),e.append(this.template),e.one("div").prepend(this.titleTemplate),this._renderProjectItems(),this._openFirstProject()},_renderProjectItems:function(){var t=this,n=!0,r=this.get("container"),i=r.one("ul"),s=this.get("model");e.each(s,function(r){var s=e.Node.create(t.itemTemplate),o=s.one("a");o.append(r.get("name")),o.setData("model",r),n&&(s.addClass("active"),n=!1),i.append(s)})},_openFirstProject:function(){var e=this.get("container"),t=e.one("ul").one(".active");t&&this._handleItemClicked({currentTarget:t.one("a")})},_handleItemClicked:function(e){var t=e.currentTarget,n=t.getData("model");t.ancestor("ul").all(".active").removeClass("active"),t.get("parentNode").addClass("active"),this.fire("openProject",{model:n})}},{ATTRS:{model:{value:null}}}),e.namespace("TodoApp").ProjectsView=o;var a,f=e.Template.Micro;a=e.Base.create("todoListView",e.View,[],{events:{"input[type=checkbox]":{click:"_handleStateClicked"},"i.icon-remove":{click:"_handleRemoveClicked"}},template:'<div><table class="table"><thead><tr><th width="10%">Status</th><th width="80%">Description</th><th width="10%">Remove</th></tr></thead><tbody></tbody></table></div>',itemTemplate:f.compile('<tr <% if (data.ready) { %> class="success" <% } %>><td><input type="checkbox" <% if (data.ready) { %> checked="checked" <% } %> /></td><td><%= data.description %></td><td><i class="icon-remove"></i></td></tr>'),render:function(){var e=
this.get("container");e.setHTML(""),e.append(this.template),this._renderList()},_renderList:function(){var t=this,n=this.get("container").one("tbody"),r=this.get("model");e.each(r.get("tasks"),function(r){var i=e.Node.create(t.itemTemplate(r.getAttrs()));i.setData("model",r),n.append(i)})},_handleStateClicked:function(e){var t=e.currentTarget,n=t.ancestor("tr").getData("model");n.set("ready",t.get("checked")),this.render()},_handleRemoveClicked:function(e){var t=e.currentTarget,n=this.get("model"),r=t.ancestor("tr").getData("model");n.get("tasks").remove(r),n.set("modified",!0),this.fire("taskRemoved",{projectModel:n,taskModel:r}),this.render()}},{ATTRS:{model:{value:null}}}),e.namespace("TodoApp").TodoListView=a},"@VERSION@",{requires:["node","template-micro","rednose-app","rednose-navbar","rednose-toolbar","rednose-dialog","todo-models"],skinnable:!0});
