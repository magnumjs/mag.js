Aop = {
  // Apply around advice to all matching functions in the given namespaces
  around: function(pointcut, advice, namespaces) {
    // if no namespaces are supplied, use a trick to determine the global ns
    if (namespaces == undefined || namespaces.length == 0)
      namespaces = [ (function(){return this;}).call() ];
    // loop over all namespaces 
    for(var i in namespaces) {
      var ns = namespaces[i];
      for(var member in ns) {
        if(typeof ns[member] == 'function' && member.match(pointcut)) {
          (function(fn, fnName, ns) {
             // replace the member fn slot with a wrapper which calls
             // the 'advice' Function
             ns[fnName] = function() {
               return advice.call(ns, { fn: fn,
                                          fnName: fnName,
                                          arguments: arguments });
             };
           })(ns[member], member, ns);
        }
      }
    }
  },

  next: function(f) {
    return f.fn.apply(this, f.arguments);
  }
};



Aop.before = function(pointcut, advice, namespaces) {
  Aop.around(pointcut,
             function(f) {
               advice.apply(this, f.arguments);
               return Aop.next(f)
             },
             namespaces);
};

Aop.after = function(pointcut, advice, namespaces) {
  Aop.around(pointcut,
             function(f) {
               var ret = Aop.next(f);
               advice.apply(this, f.arguments);
               return ret;
             },
             namespaces);
};
