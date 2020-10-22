// function pad(n) {
//     return n < 10 ? '0' + n.toString(10) : n.toString(10);
//   }
//   function timestamp() {
//     var d = new Date();
//     var time = [pad(d.getHours()),
//                 pad(d.getMinutes()),
//                 pad(d.getSeconds())].join(':');
//     return [d.getDate(), d.getMonth(), time].join(' ');
//   }
  
  var old_log = console.log;
  console.log = function() {
    let new_args = Array.from(arguments);
    var d = new Date();
    new_args.unshift(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
    old_log.apply(null,new_args)
  };
  

  console.log('POOP');