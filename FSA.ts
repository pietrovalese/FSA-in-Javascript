class GNode{
  label:number | string
  constructor(label:number | string){
    this.label=label
  }
}
class GEdge{
  from:GNode
  to:GNode
  constructor(from:GNode, to:GNode){
    this.from=from
    this.to=to
  }
}

class Graph{
  nodes:GNode[]
  edges:GEdge[]
  constructor(nodes:GNode[], edges:GEdge[]){
    this.nodes=nodes
    this.edges=edges
  }
}

function connectedright(G:Graph):boolean{
  let list:Object[]=[]
  list.push(G.edges[0].from)
  for(var i=0; i<G.edges.length;i++){
    for(var j=0; j<G.edges.length;j++){
      if(list[i]==G.edges[j].from){
        list.push(G.edges[j].to)
      }
    }
  }
  list=list.filter(function(ele,pos){
    return list.indexOf(ele)==pos
  })
  if(list.length==G.nodes.length){
    return true
  }
  else return false
}

function connectedleft(G:Graph):boolean{
  let list:Object[]=[]
  list.push(G.edges[0].to)
  for(var i=0; i<G.edges.length;i++){
    for(var j=0; j<G.edges.length;j++){
      if(list[i]==G.edges[j].to){
        list.push(G.edges[j].from)
      }
    }
  }
  list=list.filter(function(ele,pos){
    return list.indexOf(ele)==pos
  })
  if(list.length==G.nodes.length){
    return true
  }
  else return false
}

function connected(G:Graph):boolean{
  if(connectedright(G) || connectedleft(G)) return true
  else return false
}

class State extends GNode{
  final:boolean
  constructor(label:number | string, final:boolean=false){
    super(label)
    this.final=final
  }
}

class Transition <E> extends GEdge{
  evt:(e:E)=>boolean
  act:(()=>void) | undefined
  from:State
  to:State
  constructor(from:State, to:State, evt:(e:E)=>boolean, act?:(()=>void) | undefined){
    super(from,to)
    this.from=from
    this.to=to
    this.evt=evt
    this.act=act
  }
}

class Automata <E> extends Graph{
  initial:State
  state:State
  states:State[]
  transitions:Transition<E>[]
  constructor(nodes:State[], edges:Transition<E>[], initial:State){
    super(nodes,edges)
    this.states=nodes
    this.transitions=edges
    this.initial=initial
    this.state=initial
  }
  init(){
    this.state=this.initial
  }
  done(){
    if(this.state.final){return this.state.final}
    else return false
  }
  step(e:E){
    for(var i in this.transitions){
      if(this.transitions[i].evt(e) && this.transitions[i].from==this.state){
        this.transitions[i].act?.()
        this.state=this.transitions[i].to
        return true
      }
    }
    return false
  }
}

class Parser extends Automata <string> {
  constructor(nodes:State[], edges:Transition<string>[], initial:State){
    super(nodes, edges, initial)
  }
  accept(s:string){
    var array:string[]=s.split("")
    for(var i=0;i<array.length;i++){
      if(this.step(array[i])){
        if(this.done() && i!=array.length-1){this.init();return false}
      }
      else {this.init();return false}
    }
    if(this.done()) {this.init();return true}
    else {this.init();return false}
  }
}
