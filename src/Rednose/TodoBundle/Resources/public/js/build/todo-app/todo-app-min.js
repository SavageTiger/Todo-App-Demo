YUI.add("todo-app",function(e,t){var n=e.Base.create("navBar",e.Base,[],{_navbar:null,initializer:function(){var t=this.get("navbarContainer");this._navbar=new e.Rednose.Navbar({title:r,columnLayout:!0,container:t}),this._navbar.render()},destructor:function(){this._navbar.destroy(),this._navbar=null}});e.namespace("TodoApp").Navbar=n;var r="Todo App Demo",i=e.Base.create("todoApp",e.Rednose.App,[e.Rednose.View.Template.Navbar,e.Rednose.View.Template.MasterDetail,e.Rednose.View.Template.Toolbar,e.TodoApp.Navbar],{_events:null,_projectsView:null,initializer:function(){this._events=[],this._projectsView=new e.TodoApp.ProjectsView,this._projectsView.addTarget(this),this._events.push(this.after("projectsView:openProject",this._handleOpenProject,this)),this.after("ready",function(){this._projectsView.set("container",this.get("rightContainer")),this._loadProjects(),e.Rednose.App.setTitle(r,!1)}),i.superclass.initializer.apply(this,arguments)},destructor:function(){this.detach(this._events),this._events=null},_loadProjects:function(){var t=this,n=new e.TodoApp.Projects;n.load(function(){t._projectsView.set("model",n)})},_handleOpenProject:function(e){console.log(e)}},{ATTRS:{}});e.namespace("TodoApp").App=i;var s,o="Projects";s=e.Base.create("projectsView",e.View,[],{template:'<div><ul class="nav nav-tabs nav-stacked"></ul></div>',titleTemplate:"<h3>"+o+"</h3>",itemTemplate:'<li><a href="#"></a></li>',_events:null,initializer:function(){this._events=[],this._events.push(this.after("modelChange",this.render,this))},destructor:function(){this.detach(this._events),this.get("container").all("*").detachAll(),this._events=null},render:function(){var e=this.get("container");e.all("*").detach("click"),e.all("*").remove(),e.append(this.template),e.one("div").prepend(this.titleTemplate),this._renderProjectItems(),this._openFirstProject()},_renderProjectItems:function(){var t=this,n=!0,r=this.get("container"),i=r.one("ul"),s=this.get("model");e.each(s,function(r){var s=e.Node.create(t.itemTemplate),o=s.one("a");o.setHTML(r.get("name")),o.on("click",t._handleItemClicked,t),o.setData("model",r),n&&(s.addClass("active"),n=!1),i.append(s)})},_openFirstProject:function(){var e=this.get("container"),t=e.one("ul").one(".active");t&&this._handleItemClicked({currentTarget:t.one("a")})},_handleItemClicked:function(e){var t=e.currentTarget,n=t.getData("model");this.fire("openProject",{model:n})}},{ATTRS:{model:{value:null}}}),e.namespace("TodoApp").ProjectsView=s},"@VERSION@",{requires:["node","rednose-app","rednose-navbar","todo-models"],skinnable:!0});
