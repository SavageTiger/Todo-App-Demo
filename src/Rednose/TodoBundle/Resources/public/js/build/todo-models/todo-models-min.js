YUI.add("todo-models",function(e,t){var n=e.Base.create("taskModel",e.Model,[],{sync:function(t){t==="delete"&&this.get("id")&&e.io(Routing.generate("todo_app_task_remove",{id:this.get("id")}),{method:"POST"})}},{ATTRS:{description:{value:""},ready:{value:!1}}});e.namespace("TodoApp").Task=n;var r=e.Base.create("projectModel",e.Model,[],{initializer:function(e){e.tasks&&this.set("tasks",e.tasks)},sync:function(t,n,r){var i=!1,s;this.get("tasks").each(function(e){e.isModified()&&(i=!0)}),this.get("modified")===!0&&(i=!0);if(i===!1)return;s=Routing.generate("todo_app_project_update"),(t==="create"||t==="update")&&e.io(s,{method:"POST",data:e.JSON.stringify(this.getAttrs(["id","name","tasks"])),on:{success:function(t,n){r(null,e.JSON.parse(n.responseText))}}})},_setTasks:function(t){var n=new e.ModelList;return n.comparator=this._taskComparator,e.each(t,function(t){e.instanceOf(t,e.TodoApp.Task)?n.add(t):n.add(new e.TodoApp.Task(t))}),n},_taskComparator:function(e){var t=e.get("clientId");return t=t.substring(t.indexOf("_")+1),t=parseInt(t,8),t}},{ATTRS:{name:{value:""},tasks:{value:null,setter:"_setTasks"},modified:{value:!1}}});e.namespace("TodoApp").Project=r;var i=e.Base.create("projectsModel",e.ModelList,[],{model:e.TodoApp.Project,sync:function(t,n,r){t==="read"&&e.io(Routing.generate("todo_app_projects_read"),{method:"GET",on:{success:function(t,n){r(null,e.JSON.parse(n.responseText))}}})}});e.namespace("TodoApp").Projects=i},"@VERSION@",{requires:["model","model-list","io"]});
