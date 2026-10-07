// Local tooling only. Node 24's built-in WebSocket keeps browser QA dependency-free.
export async function connect() {
  const targets=await (await fetch('http://127.0.0.1:9223/json')).json();
  const target=targets.find(t=>t.type==='page');
  if(!target) throw new Error('Start Chrome with --remote-debugging-port=9223 first.');
  const socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  let id=0;const pending=new Map(),listeners=new Map();
  socket.addEventListener('message',({data})=>{
    const message=JSON.parse(data);
    if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p.reject(new Error(JSON.stringify(message.error)));else p.resolve(message.result);}
    else for(const listener of listeners.get(message.method)||[])listener(message.params);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});
  const evaluate=async(expression)=>{
    const result=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  return {call,evaluate,on:(method,listener)=>{listeners.set(method,[...(listeners.get(method)||[]),listener]);},close:()=>socket.close()};
}
export const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
