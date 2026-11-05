/* Listening Insights: optional Spotify data, private per-device snapshots.
   Rankings are relative Spotify top-item positions, NOT streaming counts. */
(function(){
"use strict";
const extraViews=[["albums","Top albums"],["recent","Recently played"],["wrapped","My Wrapped"],["timeline","Timeline"]];
const tabs=document.querySelector(".views");
const shares=document.querySelector("#share");
extraViews.forEach(function(item){
  const b=document.createElement("button"); b.dataset.v=item[0]; b.textContent=item[1];
  tabs.insertBefore(b,shares);
  const section=document.createElement("section");section.id=item[0]+"-view";section.className="hide";
  section.innerHTML='<div id="'+item[0]+'-content"></div>';
  document.querySelector("#genres-view").after(section);
});
const css=document.createElement("style");
css.textContent='.insight{padding:20px;border-radius:18px;background:rgba(255,255,255,.07);margin:12px 0}.insight h2{margin:0 0 10px}.insight-note{color:var(--muted);font-size:.88rem;margin:10px 0 20px}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.stat{background:rgba(255,255,255,.08);padding:20px;border-radius:14px}.stat b{font-size:1.6rem;display:block;color:var(--accent)}.album-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:16px}.album-tile img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px}.album-tile a{color:inherit;text-decoration:none}.album-tile small,.rank-change{display:block;color:var(--muted)}.rank-change.up{color:#1ed760}.rank-change.down{color:#ffad70}.wrapped-slide{background:linear-gradient(135deg,#24205d,#116637);padding:35px 24px;border-radius:22px;min-height:235px;margin:14px 0;animation:reveal .5s ease both}.wrapped-slide h2{font-size:2rem}.wrapped-slide strong{font-size:clamp(1.5rem,5vw,3rem);display:block;overflow-wrap:anywhere}.wrapped-controls{display:flex;gap:10px;flex-wrap:wrap}.timeline-chart{width:100%;height:auto;max-height:310px}.timeline-dot{display:inline-block;width:11px;height:11px;border-radius:50%;background:var(--accent);margin-right:8px}@keyframes reveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(css);
const previousLoad=load;
const originalViewButtons=[...document.querySelectorAll(".views button[data-v]")];
const allViewButtons=[...originalViewButtons,...tabs.querySelectorAll("button[data-v]")].filter((v,i,a)=>a.indexOf(v)===i);
let generation=0, accountId=null, slides=[], slideIndex=0;
const safe=esc;
const rangeName=()=>RANGE_LABEL[state.range];
const snapshotKey=()=> "spotify-insights-v1:"+accountId+":"+state.range;
function getSnapshots(){
  if(!accountId)return [];
  try{const v=JSON.parse(localStorage.getItem(snapshotKey())||"[]");return Array.isArray(v)?v:[];}
  catch(e){return [];}
}
function storeSnapshot(items){
  if(!accountId||!items.length)return;
  const snapshots=getSnapshots(), day=new Date().toISOString().slice(0,10);
  const snapshot={day:day,artists:items.map(x=>({id:x.id,name:x.name}))};
  const old=snapshots.findIndex(s=>s.day===day);
  if(old>=0)snapshots[old]=snapshot;else snapshots.push(snapshot);
  localStorage.setItem(snapshotKey(),JSON.stringify(snapshots.slice(-365)));
}
async function rankedArtists(limit){
  const data=await api("/me/top/artists?limit=50&time_range="+state.range);
  if(accountId)storeSnapshot(data.items);
  return data.items.slice(0,limit);
}
function changeFromPrevious(artistId, position){
  const rows=getSnapshots();
  if(rows.length<2)return "";
  const prior=rows[rows.length-2].artists.findIndex(a=>a.id===artistId);
  if(prior<0)return '<span class="rank-change">New to chart</span>';
  const delta=prior+1-position;
  return '<span class="rank-change '+(delta>0?"up":delta<0?"down":"")+'">'+
    (delta>0?"↑ "+delta+" places":delta<0?"↓ "+(-delta)+" places":"— Unchanged")+'</span>';
}
async function initializeAccount(){
  try{const me=await api("/me"); accountId=me.id;}
  catch(e){ /* snapshots unavailable until profile access is granted */ }
}
function setViews(){
  allViewButtons.forEach(b=>b.classList.toggle("on",b.dataset.v===state.view));
  ["tracks","artists","genres","albums","recent","wrapped","timeline"].forEach(v=>{
    document.getElementById(v+"-view").classList.toggle("hide",state.view!==v);
  });
  document.getElementById("counts").classList.toggle("hide",["wrapped","timeline"].includes(state.view));
  document.querySelector(".tabs").classList.toggle("hide",state.view==="recent");
  document.getElementById("create-playlist").classList.toggle("hide",state.view!=="tracks");
}
function renderTrackRow(x,i,extra){
  const img=x.album?.images?.[1]?.url || x.album?.images?.[0]?.url || "";
  const url=x.external_urls?.spotify || "#";
  return '<li class="track"><a href="'+safe(url)+'" target="_blank" rel="noopener"><span class="rank">'+(i+1)+'</span>'+
    '<img src="'+safe(img)+'" alt=""><div><b>'+safe(x.name)+'</b><span>'+safe((x.artists||[]).map(a=>a.name).join(", "))+'</span>'+
    (extra?'<small class="rank-change">'+safe(extra)+'</small>':"")+'</div></a></li>';
}
async function albums(){
  const tracks=(await api("/me/top/tracks?limit=50&time_range="+state.range)).items;
  const groups=new Map();
  tracks.forEach((t,index)=>{
    if(!t.album)return;
    const id=t.album.id||t.album.name;
    if(!groups.has(id))groups.set(id,{album:t.album,count:0,best:index,artists:t.artists.map(a=>a.name)});
    groups.get(id).count++;
  });
  const result=[...groups.values()].sort((a,b)=>b.count-a.count||a.best-b.best).slice(0,state.n);
  document.getElementById("albums-content").innerHTML='<p class="insight-note">Estimated from your top 50 tracks for '+safe(rangeName())+'. Ranked by how many tracks from each album appear — not actual album play counts.</p>'+
    '<div class="album-grid">'+result.map((x,i)=>'<div class="album-tile"><a href="'+safe(x.album.external_urls?.spotify||"#")+'" target="_blank" rel="noopener"><img src="'+safe(x.album.images?.[0]?.url||"")+'" alt=""><b>'+(i+1)+'. '+safe(x.album.name)+'</b></a><small>'+safe(x.artists.join(", "))+' · '+x.count+' top track'+(x.count===1?"":"s")+'</small></div>').join("")+'</div>';
}
async function recent(){
  const data=await api("/me/player/recently-played?limit=50");
  const items=(data.items||[]).slice(0,state.n);
  document.getElementById("recent-content").innerHTML='<p class="insight-note">Your last '+items.length+' plays available from Spotify. Spotify limits how much recent history is returned; this is not a lifetime listening log.</p><ol>'+
    items.map((x,i)=>renderTrackRow(x.track,i,new Date(x.played_at).toLocaleString())).join("")+'</ol>';
}
async function renderArtists(){
  const items=await rankedArtists(state.n);
  document.getElementById("artists").innerHTML=items.map((x,i)=>
    '<a class="artist" href="'+safe(x.external_urls?.spotify||"#")+'" target="_blank" rel="noopener"><img src="'+safe(x.images?.[0]?.url||"")+'" alt=""><small>'+(i+1)+'</small>'+safe(x.name)+changeFromPrevious(x.id,i+1)+'</a>'
  ).join("");
  const note=document.getElementById("artist-rank-note")||document.createElement("p");
  note.id="artist-rank-note";note.className="insight-note";
  note.textContent="Ranking changes compare saved visits on different days in this browser. Visit again on another day to see movement; changes are not Spotify stream counts.";
  document.querySelector("#artists-view").prepend(note);
}
function countGenres(artists){
  const counts=new Map();
  for(const a of artists)for(const g of (Array.isArray(a.genres)?a.genres:[])){
    const name=String(g).trim().toLowerCase();
    if(name)counts.set(name,(counts.get(name)||0)+1);
  }
  return [...counts].sort((a,b)=>b[1]-a[1]);
}
async function renderGenres(){
  const artists=await rankedArtists(50);
  // Respect Spotify's current response; do not make 50 deprecated extra /artists calls.
  const genres=countGenres(artists).slice(0,state.n);
  const el=document.querySelector("#genres");
  if(!genres.length){
    el.innerHTML='<li class="insight">Spotify did not supply genre tags for these artists. Spotify has deprecated artist genre metadata, so reliable genres cannot be calculated from this API response. Your other rankings still work.</li>';
    return;
  }
  const max=genres[0][1];
  el.innerHTML=genres.map((g,i)=>'<li class="genre"><span class="rank">'+(i+1)+'</span><div class="gbody"><b>'+safe(titleCase(g[0]))+'</b><div class="bar"><i style="width:'+(g[1]/max*100)+'%"></i></div></div><span class="gcount">'+g[1]+' artists</span></li>').join("");
}
async function wrapped(){
  const results=await Promise.all([
    api("/me/top/tracks?limit=50&time_range="+state.range),
    rankedArtists(50)
  ]);
  const tracks=results[0].items, artists=results[1], genres=countGenres(artists);
  const albumsList=new Set(tracks.map(t=>t.album?.id).filter(Boolean));
  slides=[
    {title:"Your listening era",main:rangeName(),sub:"A snapshot of your Spotify top items — not exact stream counts."},
    {title:"Your #1 artist",main:artists[0]?.name||"No artist data",sub:"Your most highly ranked artist for this period."},
    {title:"Your #1 track",main:tracks[0]?.name||"No track data",sub:tracks[0]?.artists.map(a=>a.name).join(", ")||""},
    {title:"Your music mix",main:genres[0]?titleCase(genres[0][0]):"Genre data unavailable",sub:genres[0]?"Most common genre tag among your top artists.":"Spotify no longer consistently returns artist genres."},
    {title:"Your top artists",main:artists.slice(0,5).map((a,i)=>(i+1)+". "+a.name).join(" · ")||"No artist data",sub:"Your top five"},
    {title:"Your top-track collection",main:String(albumsList.size)+" albums",sub:"Distinct albums represented in your top 50 tracks (not all albums you listened to)."}
  ];
  slideIndex=0;displaySlide();
}
function displaySlide(){
  const s=slides[slideIndex];if(!s)return;
  document.getElementById("wrapped-content").innerHTML='<p class="insight-note">Your personal Spotify recap for '+safe(rangeName())+'.</p><div class="wrapped-slide" aria-live="polite"><small>SLIDE '+(slideIndex+1)+' / '+slides.length+'</small><h2>'+safe(s.title)+'</h2><strong>'+safe(s.main)+'</strong><p>'+safe(s.sub)+'</p></div>'+
    '<div class="wrapped-controls"><button id="wrapped-prev" '+(!slideIndex?"disabled":"")+'>Previous</button><button id="wrapped-next" '+(slideIndex===slides.length-1?"disabled":"")+'>Next</button><button id="wrapped-copy">Copy this slide</button></div>';
  document.getElementById("wrapped-prev").onclick=()=>{slideIndex--;displaySlide();};
  document.getElementById("wrapped-next").onclick=()=>{slideIndex++;displaySlide();};
  document.getElementById("wrapped-copy").onclick=async()=>{
    const text=s.title+": "+s.main+" — "+s.sub;
    try{await navigator.clipboard.writeText(text);err("Slide copied to clipboard.");}
    catch(e){err("Clipboard access unavailable in this browser.");}
  };
}
async function timeline(){
  await rankedArtists(50);
  const rows=getSnapshots();
  const el=document.getElementById("timeline-content");
  if(rows.length<2){
    el.innerHTML='<div class="insight"><h2>Listening timeline</h2><p>First snapshot saved'+(rows[0]?" on "+safe(rows[0].day):"")+'. Return on another day to see how your artist rankings change.</p><p class="insight-note">Snapshots are stored only in this browser for this Spotify account and selected time range. Clearing site data erases them.</p></div>';
    return;
  }
  const ids=[...new Set(rows.flatMap(r=>r.artists.slice(0,5).map(a=>a.id)))].slice(0,8);
  const names=new Map(rows.flatMap(r=>r.artists.map(a=>[a.id,a.name])));
  const colors=["#1ed760","#f9aa43","#b9a5ff","#63c8ff","#f983b5","#f6e66b","#c0f5a6","#ffa6a6"];
  const w=760,h=280,left=46,right=20,top=20,bottom=42,plotW=w-left-right,plotH=h-top-bottom;
  const maxRank=50;
  let svg='<svg class="timeline-chart" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Artist ranks over saved dates">';
  [1,10,20,30,40,50].forEach(rank=>{
    const y=top+(rank-1)/(maxRank-1)*plotH;
    svg+='<line x1="'+left+'" y1="'+y+'" x2="'+(w-right)+'" y2="'+y+'" stroke="#ffffff22"/><text x="6" y="'+(y+4)+'" fill="#b7d6c0" font-size="12">#'+rank+'</text>';
  });
  ids.forEach((id,i)=>{
    const points=[];
    rows.forEach((r,j)=>{const index=r.artists.findIndex(a=>a.id===id);if(index>=0)points.push([left+j/(rows.length-1)*plotW,top+index/(maxRank-1)*plotH]);else if(points.length){svg+='<polyline points="'+points.map(p=>p.join(",")).join(" ")+'" fill="none" stroke="'+colors[i]+'" stroke-width="3"/>';points.length=0;}});
    if(points.length)svg+='<polyline points="'+points.map(p=>p.join(",")).join(" ")+'" fill="none" stroke="'+colors[i]+'" stroke-width="3"/>';
  });
  svg+='<text x="'+left+'" y="'+(h-9)+'" fill="#b7d6c0" font-size="12">'+safe(rows[0].day)+'</text><text x="'+(w-right)+'" y="'+(h-9)+'" fill="#b7d6c0" text-anchor="end" font-size="12">'+safe(rows[rows.length-1].day)+'</text></svg>';
  el.innerHTML='<h2>Artist ranking timeline</h2><p class="insight-note">'+rows.length+' daily snapshots saved in this browser for '+safe(rangeName())+'. A lower rank number is better. Lines can have gaps when artists leave the top 50.</p>'+svg+
  '<div class="stats-grid">'+ids.map((id,i)=>'<div><span class="timeline-dot" style="background:'+colors[i]+'"></span>'+safe(names.get(id)||"Unknown")+'</div>').join("")+'</div>';
}
load=async function(){
  const ticket=++generation;
  setViews();err("");
  try{
    if(state.view==="albums")await albums();
    else if(state.view==="recent")await recent();
    else if(state.view==="wrapped")await wrapped();
    else if(state.view==="timeline")await timeline();
    else if(state.view==="artists")await renderArtists();
    else if(state.view==="genres")await renderGenres();
    else await previousLoad();
  }catch(e){
    if(ticket!==generation)return;
    if(state.view==="recent"&&/403|401|scope/i.test(e.message))
      err("Recently played requires new Spotify permission. Log out and log in again to approve it.");
    else err(e.message);
  }
};
allViewButtons.forEach(b=>b.onclick=()=>{state.view=b.dataset.v;load();});
initializeAccount().then(()=>{if(sessionStorage.getItem("token"))load();});
})();