(function(){
var UA='JoiHow/1.0 (by Chloetheleafy-hub on GitHub)';
var q=[],box=document.createElement('pre');
box.style.cssText='position:fixed;left:0;right:0;bottom:0;max-height:35vh;overflow:auto;margin:0;padding:6px;font:11px monospace;background:#000c;color:#0f0;z-index:99999;white-space:pre-wrap;word-break:break-all;pointer-events:none';
function L(t){q.push(t);if(document.body){if(!box.parentNode)document.body.appendChild(box);box.textContent=q.slice(-30).join('\n');box.scrollTop=box.scrollHeight}}
document.addEventListener('DOMContentLoaded',function(){L('patch actif')});
window.addEventListener('error',function(e){L('ERR '+e.message)});
window.addEventListener('unhandledrejection',function(e){L('REJET '+e.reason)});
function conv(a){
 return{posts:a.map(function(p){
  var f=p.files||{},m=f.meta||{},o=f.original||{},pv=f.preview||{},sp=f.sample||{},h=p.has||{},s=p.stats||{};
  return{
   id:p.id,created_at:p.created_at,updated_at:p.updated_at,change_seq:p.change_seq,
   file:{width:o.width,height:o.height,ext:m.ext,size:m.size,md5:m.md5,url:o.url},
   preview:{width:pv.width,height:pv.height,url:pv.jpg||pv.webp||null},
   sample:{has:!!h.sample,width:sp.width,height:sp.height,url:sp.jpg||sp.webp||null},
   score:s.score||{up:0,down:0,total:0},
   tags:{general:Array.isArray(p.tags)?p.tags:[],species:[],character:[],artist:[],copyright:[],lore:[],meta:[],invalid:[]},
   locked_tags:p.locked_tags||[],flags:p.flags,rating:p.rating,fav_count:s.fav_count,
   sources:p.sources,pools:p.pools,relationships:p.relationships,approver_id:p.approver_id,
   uploader_id:p.uploader_id,description:p.description,comment_count:s.comment_count,
   is_favorited:s.is_favorited,has_notes:h.notes,duration:m.duration
  };
 })};
}
function fix(t){
 try{
  if(typeof t==='string'){var j=JSON.parse(t);return Array.isArray(j)?JSON.stringify(conv(j)):t}
  if(Array.isArray(t))return conv(t);
 }catch(e){}
 return t;
}
var isE=function(u){return /e621\.net\/posts\.json/.test(u)};
var F=window.fetch;
window.fetch=async function(r,o){
 var u=typeof r==='string'?r:((r&&r.url)||String(r));
 L('fetch '+u.slice(0,110));
 var res;
 try{
  if(isE(u)&&typeof r==='string'){
   var h={};
   if(o&&o.headers){if(o.headers.forEach&&!Array.isArray(o.headers))o.headers.forEach(function(v,k){h[k]=v});else Object.assign(h,o.headers)}
   h['User-Agent']=UA;o=Object.assign({},o,{headers:h});
  }
  res=await F.call(this,r,o);
 }catch(e){L('fetch ERREUR '+e);throw e}
 L('-> '+res.status);
 if(!isE(u))return res;
 try{
  var j=JSON.parse(await res.clone().text());
  if(!Array.isArray(j))return res;
  L('converti '+j.length+' posts');
  return new Response(JSON.stringify(conv(j)),{status:res.status,statusText:res.statusText,headers:{'Content-Type':'application/json'}});
 }catch(e){L('conv ERREUR '+e);return res}
};
var XO=window.XMLHttpRequest;
window.XMLHttpRequest=function(){
 var x=new XO(),url='',op=x.open;
 x.open=function(m,u){url=String(u);L('xhr '+url.slice(0,110));return op.apply(x,arguments)};
 x.addEventListener('loadend',function(){L('xhr -> '+x.status)});
 ['response','responseText'].forEach(function(k){
  var d=Object.getOwnPropertyDescriptor(x,k),p=XO.prototype;
  while(!d&&p){d=Object.getOwnPropertyDescriptor(p,k);p=Object.getPrototypeOf(p)}
  if(!d||!d.get)return;
  Object.defineProperty(x,k,{configurable:true,get:function(){var v=d.get.call(x);return isE(url)?fix(v):v}});
 });
 return x;
};
window.XMLHttpRequest.prototype=XO.prototype;
})();
