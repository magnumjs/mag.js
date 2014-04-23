Aop = {
  // Apply around advice to all matching functions in the given namespaces
  around: function(pointcut, namespace, advice) {
 
 var ns = namespace;    
    for(var member in namespace) {

        if(typeof ns[member] == 'function' && member.match(pointcut)) {
          
          (function(fn, fnName, ns) {
  
             ns[fnName] = function() {
               return advice.call(ns, { fn: fn,
                                          fnName: fnName,
                                          arguments: arguments });
             };
           })(ns[member], member, ns);
        }
      }
    
  },
  before : function(pointcut, namespace, advice) {
  Aop.around(pointcut,namespace,
             function(f) {
               advice.apply(this, f.arguments);
               return Aop.next(f)
             });
},
  after:function(pointcut, namespace,advice) {
  Aop.around(pointcut,namespace,
             function(f) {
               var ret = Aop.next(f);
               advice.apply(this, f.arguments);
               return ret;
             });
},
  next: function(f) {
    return f.fn.apply(this, f.arguments);
  }
};


var test={};

test.hello=function(name) { console.log('hello, ' + name); }
/* Aop.around('hello',test, function(f) {
 console.log('[before ' + f.fnName + ']');
 f.arguments[0]='yo';
 Aop.next(f);
 console.log('[after ' + f.fnName + ']');
 }); */

Aop.after('hello',test,function(){console.log(arguments)});

test.hello('Mike');
