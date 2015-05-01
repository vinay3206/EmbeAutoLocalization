App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

var templateModel=Ember.Object.extend({

	input:'',
	output:'',
	helper:'loc',



});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return templateModel.create();
  }
});

App.IndexController=Ember.ObjectController.extend({

	localize:function(text){
		var val=$.trim(text);
		if(val && !this.isHandlebarExpression(val))
			return "{{loc "+text+"}}";
		return text;
	},

	isHandlebarExpression:function(text){
		// pass trimmed text
		if(/^[{{]/.test(text)){
			return true;
		}
		return false;
	},

	replace:function (node) {
		if(node.nodeType==node.Text_NODE){
			node.textContent=this.location(node.textContent);
		}
	    var nodes = node.childNodes;
	    for (var i = 0, m = nodes.length; i < m; i++) {
	        var n = nodes[i];
	        if (n.nodeType == n.TEXT_NODE) {
	            // do some swappy text to html here?
	            n.textContent = this.localize(n.textContent);
	        } else {
	            this.replace(n);
	        }
	    }
	},

	resetEmberAttributes:function(html){
		html=html.split('action=""').join('action');
		html=html.split('=""').join('');
		return html;
	},


	process:function(input){
		
		var nodes=$.parseHTML(input);
		nodes.forEach($.proxy(function(val){
			this.replace(val);
		},this));
		$('#jappendHtml').empty();
		var m=$('#jappendHtml').append(nodes);
		return this.resetEmberAttributes(m[0].innerHTML);
		
	},

	


	actions:{
		globalize:function(){
			//console.log(Handlebars.compile(this.get('input'))());
			if(this.get('helper')){
				this.set('showError',false);
				var output=this.process(this.get('input'));
				this.set('output',output);
			}
			else{
				this.set('showError',true);
			}
		}
	}


});




