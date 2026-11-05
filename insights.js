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
css.textContent += "\n.genre-editor{display:block;flex-direction:column;align-items:stretch}.genre-editor h2{margin:0 0 4px}.genre-picker-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin:16px 0}.genre-pick{display:flex;gap:9px;align-items:center;background:rgba(255,255,255,.06);padding:8px;border-radius:12px}.genre-pick img{height:38px;width:38px;object-fit:cover;border-radius:8px}.genre-pick span{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis}.genre-pick select{min-width:106px;max-width:135px;border:1px solid #536a5e;border-radius:8px;background:#13251b;color:#fff;padding:7px}\n.wrapped-full{isolation:isolate;position:relative;overflow:hidden;min-height:585px;border-radius:22px;padding:25px;display:flex;flex-direction:column;color:#fff;box-shadow:0 22px 65px #0008;background:linear-gradient(145deg,#4616b7 0%,#1b1047 80%);animation:reveal .5s ease}.wrapped-full.lime{background:linear-gradient(145deg,#165c3b,#003023 85%)}.wrapped-full.orange{background:linear-gradient(145deg,#a64713,#3b1036 85%)}.wrapped-full.blue{background:linear-gradient(145deg,#0c59a1,#161442 85%)}.wrapped-full.pink{background:linear-gradient(145deg,#a92873,#311264 85%)}.wrapped-full::before{content:\"\";position:absolute;width:360px;height:360px;right:-150px;top:100px;border:55px solid #ffffff12;border-radius:50%;z-index:-1}.wrapped-topline,.wrapped-signoff{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:.72rem;font-weight:800;letter-spacing:.14em}.wrapped-progress{display:flex;gap:5px;margin:16px 0}.wrapped-dot{padding:0;min-width:0;flex:1;height:5px;background:#ffffff55;border-radius:4px}.wrapped-dot.active{background:white}.wrapped-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px}.wrapped-copy{position:relative;z-index:2}.wrapped-kicker{font-size:.85rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.wrapped-copy h2{font-size:clamp(2.6rem,7vw,5rem);line-height:1.03;letter-spacing:-.045em;margin:10px 0 15px;max-width:720px}.wrapped-art{width:min(280px,62%);aspect-ratio:1;background-color:#ffffff22;background-position:center;background-size:cover;border-radius:18px;box-shadow:12px 15px 0 #0003;transform:rotate(-4deg);margin:12px 0 15px}.wrapped-hero-text strong{font-size:clamp(2rem,6vw,4rem);line-height:1.05;letter-spacing:-.03em;display:block;overflow-wrap:anywhere}.wrapped-hero-text p{font-size:1.08rem}.wrapped-slide-list{display:grid;gap:10px;max-width:750px}.wrapped-list-item{display:flex;align-items:center;gap:15px;padding:8px 12px;background:#ffffff18;border-radius:12px}.wrapped-list-item>b{font-size:1.6rem;min-width:20px}.wrapped-list-item img{width:56px;height:56px;border-radius:9px;object-fit:cover}.wrapped-list-item span{font-size:clamp(1rem,3.5vw,1.4rem);font-weight:800;overflow-wrap:anywhere}.wrapped-genre-row{position:relative;display:flex;justify-content:space-between;gap:12px;padding:12px 15px 16px;border-radius:9px;background:#ffffff16;overflow:hidden;font-weight:700}.wrapped-genre-fill{position:absolute;bottom:0;left:0;height:5px;background:#fff}.wrapped-genre-row b{font-size:.8rem}.wrapped-footnote{font-size:.82rem;opacity:.9}.wrapped-signoff{margin-top:28px}.wrapped-signoff span{font-size:1.4rem}.wrapped-controls{margin:14px 0 10px}.wrapped-controls button{background:rgba(255,255,255,.15);border:1px solid #ffffff2d}.wrapped-controls button:disabled{opacity:.35;cursor:default}@media(min-width:700px){.wrapped-full{padding:34px 42px}.wrapped-full:has(.wrapped-art) .wrapped-art{position:absolute;right:8%;top:37%;width:240px;opacity:.83}.wrapped-full:has(.wrapped-art) .wrapped-copy,.wrapped-full:has(.wrapped-art) .wrapped-hero-text{max-width:60%;position:relative;z-index:2}}\n";
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

const GENRE_OPTIONS=["Jump-up DnB","Drum & Bass","Liquid DnB","Jungle","Grime","UK Drill","Drill","UK Rap","Hip-Hop","Rap","Dubstep","Garage","UK Garage","House","Tech House","Techno","Trance","Pop","R&B","Soul","Afrobeats","Dancehall","Reggae","Rock","Indie","Metal","Electronic","Jazz","Classical","Other"];
const customGenreKey=()=> "spotify-artist-genre-v2:"+(accountId||"anonymous");
function taggedGenres(){
  try {const data=JSON.parse(localStorage.getItem(customGenreKey())||"{}");return data&&typeof data==="object"&&!Array.isArray(data)?data:{};}
  catch(e){return {};}
}
function countGenres(artists){
  const counts=new Map(), custom=taggedGenres();
  for(const a of artists){
    const source=custom[a.id] ? [custom[a.id]] : (Array.isArray(a.genres) ? a.genres : []);
    for(const g of source){
      const name=String(g).trim().toLowerCase();
      if(name)counts.set(name,(counts.get(name)||0)+1);
    }
  }
  return [...counts].sort((a,b)=>b[1]-a[1]);
}
async function renderGenres(){
  const artists=await rankedArtists(50), custom=taggedGenres();
  const genres=countGenres(artists).slice(0,state.n), el=document.querySelector("#genres");
  const automatic=artists.filter(a=>Array.isArray(a.genres)&&a.genres.length).length;
  const manual=artists.filter(a=>!!custom[a.id]).length;
  let html='<li class="insight"><h2>Your music genres</h2><p class="insight-note">Spotify no longer consistently supplies artist genre tags. '+automatic+' of your '+artists.length+' top artists have tags from Spotify; '+manual+' have your saved labels. Label the missing ones below to build your chart — these are your classifications, not Spotify-verified genres.</p></li>';
  if(genres.length){
    const max=genres[0][1];
    html+=genres.map((g,i)=>'<li class="genre"><span class="rank">'+(i+1)+'</span><div class="gbody"><b>'+safe(titleCase(g[0]))+'</b><div class="bar"><i style="width:'+(g[1]/max*100)+'%"></i></div></div><span class="gcount">'+g[1]+' artists</span></li>').join("");
  }else{
    html+='<li class="insight-note">No genre labels are available yet. Choose some below to start.</li>';
  }
  html+='<li class="insight genre-editor"><h2>Tag your top artists</h2><p class="insight-note">Choose a primary genre for each artist. Saved on this device and editable anytime.</p><div class="genre-picker-list">'+artists.map(a=>{
    const img=a.images?.[2]?.url||a.images?.[0]?.url||"";
    return '<label class="genre-pick"><img src="'+safe(img)+'" alt=""><span>'+safe(a.name)+'</span><select data-artist-id="'+safe(a.id)+'" aria-label="Genre for '+safe(a.name)+'"><option value="">'+(a.genres?.length?'Use Spotify tags':'Choose genre')+'</option>'+
    GENRE_OPTIONS.map(g=>'<option value="'+safe(g)+'"'+(custom[a.id]===g?' selected':'')+'>'+safe(g)+'</option>').join("")+'</select></label>';
  }).join("")+'</div><button id="clear-genre-tags" type="button">Clear my genre labels</button></li>';
  el.innerHTML=html;
  el.querySelectorAll("select[data-artist-id]").forEach(select=>select.addEventListener("change",()=>{
    const genres=taggedGenres();
    if(select.value)genres[select.dataset.artistId]=select.value;
    else delete genres[select.dataset.artistId];
    try{localStorage.setItem(customGenreKey(),JSON.stringify(genres));}catch(e){err("Browser storage is unavailable: labels cannot be saved.");return;}
    renderGenres().catch(e=>err(e.message));
  }));
  document.querySelector("#clear-genre-tags").onclick=()=>{
    localStorage.removeItem(customGenreKey());renderGenres().catch(e=>err(e.message));
  };
}
async function wrapped(){
  const [topTracks,topArtists]=await Promise.all([
    api("/me/top/tracks?limit=50&time_range="+state.range),
    rankedArtists(50)
  ]);
  const tracks=topTracks.items||[], artists=topArtists||[], genres=countGenres(artists);
  const art=x=>x?.images?.[0]?.url||"";
  const albumArt=x=>x?.album?.images?.[0]?.url||"";
  const top5=artists.slice(0,5);
  const stylePhoto=(url)=>url?' style="background-image:linear-gradient(0deg,rgba(0,0,0,.65),transparent 75%),url(&quot;'+safe(url)+'&quot;)"':"";
  const lineup=top5.map((a,i)=>'<div class="wrapped-list-item"><b>'+(i+1)+'</b><img src="'+safe(art(a))+'" alt=""><span>'+safe(a.name)+'</span></div>').join("");
  const trackLineup=tracks.slice(0,5).map((t,i)=>'<div class="wrapped-list-item"><b>'+(i+1)+'</b><img src="'+safe(albumArt(t))+'" alt=""><span>'+safe(t.name)+'</span></div>').join("");
  const genreList=genres.slice(0,5).map((g,i)=>'<div class="wrapped-genre-row"><span>'+safe(titleCase(g[0]))+'</span><b>'+g[1]+' artists</b><div class="wrapped-genre-fill" style="width:'+(100*g[1]/genres[0][1])+'%"></div></div>').join("");
  slides=[
    {kicker:"YOUR SOUND • "+rangeName(),title:"This is your listening era.",hero:state.name?state.name:"Your music",note:"Made from your Spotify top tracks and artists.",image:albumArt(tracks[0]),theme:"purple",kind:"hero"},
    {kicker:"THE MAIN CHARACTER",title:"Your #1 artist",hero:artists[0]?.name||"No artist data",note:"Your most highly ranked artist in this time range.",image:art(artists[0]),theme:"lime",kind:"hero"},
    {kicker:"ON REPEAT",title:"Your #1 track",hero:tracks[0]?.name||"No track data",note:tracks[0]?.artists?.map(a=>a.name).join(", ")||"",image:albumArt(tracks[0]),theme:"orange",kind:"hero"},
    {kicker:"THE TOP FIVE",title:"Your favourite artists",html:lineup||"<p>No artist data</p>",theme:"blue",kind:"list"},
    {kicker:"YOUR MUSIC DNA",title:"Genre breakdown",html:genreList||'<p>Genre tags unavailable. Go to Top genres and label your artists to build this chart.</p>',note:"Genres are tags among top artists, not actual listening percentages.",theme:"pink",kind:"list"},
    {kicker:"THE SOUNDTRACK",title:"Your top five tracks",html:trackLineup||"<p>No track data</p>",theme:"purple",kind:"list"},
    {kicker:"THAT'S YOUR SOUND",title:"The recap",hero:String(new Set(tracks.map(t=>t.album?.id).filter(Boolean)).size)+" albums",note:"Represented among your top 50 tracks. Not an album play count.",image:albumArt(tracks[1]||tracks[0]),theme:"lime",kind:"hero"}
  ];
  slideIndex=0;displaySlide();
}
function displaySlide(){
  const s=slides[slideIndex];if(!s)return;
  const dots=slides.map((_,i)=>'<button type="button" class="wrapped-dot '+(i===slideIndex?"active":"")+'" data-slide="'+i+'" aria-label="Go to slide '+(i+1)+'"></button>').join("");
  const body=s.kind==="hero"?'<div class="wrapped-art"'+(s.image?' style="background-image:url(&quot;'+safe(s.image)+'&quot;)"':'')+'></div><div class="wrapped-hero-text"><strong>'+safe(s.hero)+'</strong><p>'+safe(s.note)+'</p></div>':
    '<div class="wrapped-slide-list">'+s.html+'</div>'+(s.note?'<p class="wrapped-footnote">'+safe(s.note)+'</p>':"");
  document.getElementById("wrapped-content").innerHTML=
    '<div class="wrapped-full '+s.theme+'" aria-live="polite"><div class="wrapped-topline"><span>YOUR SPOTIFY RECAP</span><span>'+String(slideIndex+1).padStart(2,"0")+' / '+String(slides.length).padStart(2,"0")+'</span></div>'+
    '<div class="wrapped-progress">'+dots+'</div><div class="wrapped-body"><div class="wrapped-copy"><p class="wrapped-kicker">'+safe(s.kicker)+'</p><h2>'+safe(s.title)+'</h2></div>'+body+'</div><div class="wrapped-signoff">MY TOP SPOTIFY <span>✦</span> '+safe(rangeName()).toUpperCase()+'</div></div>'+
    '<div class="wrapped-controls"><button id="wrapped-prev" '+(!slideIndex?"disabled":"")+'>← Previous</button><button id="wrapped-next" '+(slideIndex===slides.length-1?"disabled":"")+'>Next →</button><button id="wrapped-share">Download recap card</button></div>'+
    '<p class="insight-note">This recap reflects your Spotify rankings, not full listening history or exact stream counts.</p>';
  document.getElementById("wrapped-prev").onclick=()=>{if(slideIndex>0){slideIndex--;displaySlide();}};
  document.getElementById("wrapped-next").onclick=()=>{if(slideIndex<slides.length-1){slideIndex++;displaySlide();}};
  document.querySelectorAll(".wrapped-dot").forEach(b=>b.onclick=()=>{slideIndex=Number(b.dataset.slide);displaySlide();});
  document.getElementById("wrapped-share").onclick=shareCard;
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
window.initializeListeningInsights=initializeAccount;
})();