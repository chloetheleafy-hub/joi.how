(function(){
var UA='JoiHow/1.0 (by Chloetheleafy-hub on GitHub)';
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
 if(!isE(u))return F.apply(this,arguments);
 if(typeof r==='string'&&!(o&&o.headers instanceof Headers)){
  o=Object.assign({},o);o.headers=Object.assign({},o.headers,{'User-Agent':UA});
 }
 var res=await F.call(this,r,o);
 try{
  var t=await res.clone().text(),j=JSON.parse(t);
  if(!Array.isArray(j))return res;
  return new Response(JSON.stringify(conv(j)),{status:res.status,statusText:res.statusText,headers:{'Content-Type':'application/json'}});
 }catch(e){return res}
};
var XO=window.XMLHttpRequest;
window.XMLHttpRequest=function(){
 var x=new XO(),url='',op=x.open;
 x.open=function(m,u){url=String(u);return op.apply(x,arguments)};
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
