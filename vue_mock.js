var obj = {};
var methods = {};

function nodeContainer(node, vm, flag){
  console.log('node  11  ', node)
  var flag = flag || document.createDocumentFragment();

  var child;
  console.log('child', child, node.firstChild)
  while(child = node.firstChild){
    compile(child, vm);
    flag.appendChild(child);
    if(child.firstChild){
      nodeContainer(child, vm, flag);
    }
  }
  return flag;
}



//编译
function compile(node, vm){
  var reg = /\{\{(.*)\}\}/g;
  if(node.nodeType === 1){
    var attr = node.attributes;
    //解析节点的属性
    for(var i = 0;i < attr.length; i++){

      if(attr[i].nodeName == 'v-model'){
        var name = attr[i].nodeValue;
        node.addEventListener('input',function(e){
          vm[name] = e.target.value;
        });

        node.value = vm[name];//讲实例中的data数据赋值给节点
        node.removeAttribute('v-model');
        // 记得这里也声明成观察者模式
        new Watcher(vm,node,name);
      } else if (attr[i].nodeName == '@click') {
        console.log(attr[i].node)
        var name = attr[i].nodeValue;
        console.log(methods[name])
        node.addEventListener('click', methods[name], false);
        console.log(node)
        node.removeAttribute('@click');
      }
    }
  }
  //如果节点类型为text
  if(node.nodeType === 3){
    
    if(reg.test(node.nodeValue)){
      // console.dir(node);
      var name = RegExp.$1;//获取匹配到的字符串
      name = name.trim();
      // node.nodeValue = vm[name];
      new Watcher(vm,node,name);
    }
  }
}

function defineReactive (obj, key, value){
  var dep = new Dep();
  Object.defineProperty(obj,key,{
    get:function(){
      console.log(Dep.global);
      if(Dep.global){
        dep.add(Dep.global);
      }
      console.log("get了值"+value);
      return value;
    },
    set:function(newValue){
      if(newValue === value){
        return;
      }
      value = newValue;
      console.log("set了最新值"+value);
      dep.notify();
    }
  })
}

function observe (obj,vm){
  Object.keys(obj).forEach(function(key){
    defineReactive(vm,key,obj[key]);
  })
}

function Vue(options){
  console.log(options)
  this.data = options.data;
  var data = this.data;
  observe(data,this);
  methods = options.methods
  var id = options.el;
  var dom = nodeContainer(document.getElementById(id), this);
  document.getElementById(id).appendChild(dom);
}

function Dep(){
  this.subs = [];
}
Dep.prototype ={
  add:function(sub){
    this.subs.push(sub);
  },
  notify:function(){
    this.subs.forEach(function(sub){
      console.log(sub);
      sub.update();
    })
  }
}


function Watcher(vm,node,name){
  Dep.global = this;
  this.name = name;
  this.node = node;
  this.vm = vm;
  this.update();
  Dep.global = null;
}

Watcher.prototype = {
  update:function(){
    this.get();
    switch (this.node.nodeType) {
      case 1: 
        this.node.value = this.value;
        break;
      case 3:
        this.node.nodeValue = this.value;
        break;
      default: break;
    }
  },
  get:function(){
    this.value = this.vm[this.name];
  }
}
