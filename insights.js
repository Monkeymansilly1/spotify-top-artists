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

/* External genre inference: MusicBrainz, not Spotify and not a paid LLM.
   Two MusicBrainz calls per artist, globally queued at >=1.2s apart.
   Genre assignments are best-effort and never fabricated if no match is found. */
const mbKey=()=> "spotify-genre-mb-v2:"+(accountId||"anonymous");
function mbCache(){try{const v=JSON.parse(localStorage.getItem(mbKey())||"{}");return v&&typeof v==="object"?v:{}}catch(e){return {}}}
function saveMbCache(value){try{localStorage.setItem(mbKey(),JSON.stringify(value))}catch(e){/* storage disabled */}}
const mbGenreAliases=[
  [/jump.?up|jump up drum|jump-up drum/i,"Jump-up DnB"],
  [/liquid (drum|dnb)|liquid funk/i,"Liquid DnB"],
  [/jungle/i,"Jungle"],
  [/drum.?and.?bass|drum.?&.?bass|drum.?n.?bass|\bdnb\b/i,"Drum & Bass"],
  [/\bgrime\b/i,"Grime"],
  [/uk drill|british drill/i,"UK Drill"],
  [/\bdrill\b/i,"Drill"],
  [/uk garage|2.step|speed garage/i,"UK Garage"],
  [/\bdubstep\b/i,"Dubstep"],
  [/\btech house\b/i,"Tech House"],
  [/\bhouse\b/i,"House"],
  [/\btechno\b/i,"Techno"],
  [/\btrance\b/i,"Trance"],
  [/uk hip hop|british hip hop|uk rap|british rap/i,"UK Rap"],
  [/hip.hop/i,"Hip-Hop"],
  [/\brap\b/i,"Rap"],
  [/afrobeats|afrobeat/i,"Afrobeats"],
  [/dancehall/i,"Dancehall"],
  [/reggae/i,"Reggae"],
  [/rhythm and blues|\br&b\b/i,"R&B"],
  [/\bsoul\b/i,"Soul"],
  [/\bindie\b/i,"Indie"],
  [/\bmetal\b/i,"Metal"],
  [/\brock\b/i,"Rock"],
  [/\bpop\b/i,"Pop"],
  [/electronic|electronica/i,"Electronic"],
  [/\bjazz\b/i,"Jazz"],
  [/\bclassical\b/i,"Classical"]
];
function normaliseMbGenre(name){
  const found=mbGenreAliases.find(v=>v[0].test(name));
  return found?found[1]:null;
}
let lastMbRequest=0, mbRequestQueue=Promise.resolve();
function musicBrainz(url){
  const job=mbRequestQueue.catch(()=>{}).then(async()=>{
    const wait=Math.max(0,1200-(Date.now()-lastMbRequest));
    if(wait)await new Promise(resolve=>setTimeout(resolve,wait));
    lastMbRequest=Date.now();
    const response=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!response.ok)throw new Error("MusicBrainz request failed ("+response.status+")");
    return response.json();
  });
  mbRequestQueue=job.catch(()=>{});
  return job;
}
const artistNameKey=name=>String(name).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g,"");


/* Multi-source genre evidence: artist metadata, not audio AI.
   Last.fm is opt-in because its API requires a developer key. */
const lastFmKey=()=>sessionStorage.getItem("soundprint-lastfm-key")||"";
const genreCacheVersion=()=> "spotify-genre-evidence-v3:"+(accountId||"anonymous");
const genreCache=()=>{try{return JSON.parse(localStorage.getItem(genreCacheVersion())||"{}")}catch(e){return {}}};
const saveGenreCache=v=>{try{localStorage.setItem(genreCacheVersion(),JSON.stringify(v))}catch(e){}};
const validGenreCache=item=>item && Date.now()-item.time < (item.genre?30:1)*86400000;
const genreNorm=text=>String(text||"").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g,"");
const musicTypes=/musician|singer|rapper|record producer|dj\b|band\b|music group|musical artist|songwriter|electronic music|hip hop|drum and bass|grime|drill music/i;
async function publicJson(url){
  const response=await fetch(url,{headers:{Accept:"application/json"}});
  if(!response.ok)throw Error("Public music source returned "+response.status);
  const data=await response.json();
  if(data.error)throw Error(data.info||data.error.message||"Public music source error");
  return data;
}
const votesFromTags=(list,source,scale=1)=>list.map(t=>({
  genre:normaliseMbGenre(t.name||""),
  weight:Math.min(12,Math.max(1,Number(t.count)||1))*scale,
  source
})).filter(t=>t.genre);
async function musicBrainzVotes(artist){
  const query='artist:"'+artist.name.replace(/["\\]/g," ")+'"';
  const search=await musicBrainz("https://musicbrainz.org/ws/2/artist?fmt=json&limit=20&query="+encodeURIComponent(query));
  const matches=(search.artists||[]).filter(x=>genreNorm(x.name)===genreNorm(artist.name)&&Number(x.score||0)>=90);
  if(!matches.length)return [];
  // Restrict homonyms: a name collision without a unique metadata-bearing candidate is unsafe.
  const tagged=matches.filter(x=>(x.tags||[]).length||(x.genres||[]).length);
  const candidate=matches.length===1?matches[0]:tagged.length===1?tagged[0]:null;
  if(!candidate)return [];
  const genres=[...(candidate.genres||[]).map(t=>({...t,count:Math.max(1,t.count||0)*2})),...(candidate.tags||[])];
  if(genres.length)return votesFromTags(genres,"MusicBrainz",2);
  const full=await musicBrainz("https://musicbrainz.org/ws/2/artist/"+encodeURIComponent(candidate.id)+"?inc=genres%2Btags&fmt=json");
  return votesFromTags([...(full.genres||[]).map(t=>({...t,count:Math.max(1,t.count||0)*2})),...(full.tags||[])],"MusicBrainz",2);
}
async function lastFmVotes(artist){
  const key=lastFmKey();
  if(!key)return [];
  const params=new URLSearchParams({method:"artist.gettoptags",artist:artist.name,api_key:key,format:"json",autocorrect:"0"});
  const data=await publicJson("https://ws.audioscrobbler.com/2.0/?"+params);
  return votesFromTags((data.toptags?.tag||[]).filter(t=>Number(t.count)>=5).slice(0,20),"Last.fm",2);
}
async function wikiArtist(artist){
  // Obtain Wikipedia categories and linked Wikidata ID, using MediaWiki's browser CORS.
  const params=new URLSearchParams({action:"query",generator:"search",gsrsearch:'"'+artist.name.replace(/["\\]/g," ")+'" musician',gsrlimit:"8",prop:"pageprops|categories|extracts",cllimit:"40",exintro:"1",explaintext:"1",format:"json",origin:"*"});
  const data=await publicJson("https://en.wikipedia.org/w/api.php?"+params);
  const pages=Object.values(data.query?.pages||{});
  const candidates=pages.filter(p=>{
    const title=String(p.title||"");
    const titleMatch=genreNorm(title.replace(/\s*\([^)]*\)\s*$/,""))===genreNorm(artist.name);
    const musical=musicTypes.test(String(p.extract||"").slice(0,420))||/\((musician|rapper|singer|band|dj|record producer)\)/i.test(title);
    return titleMatch && musical;
  });
  return candidates.length===1?candidates[0]:null;
}
async function wikipediaVotes(page){
  if(!page)return [];
  const tags=(page.categories||[]).map(c=>String(c.title||"").replace(/^Category:/,""));
  const evidence=[];
  for(const tag of tags){
    // Only use categories that explicitly describe musicians or music, not
    // genre words casually mentioned in someone's biography.
    if(/musicians|rappers|record producers|bands|musical groups|singers|music artists|djs\b/i.test(tag)){
      const found=normaliseMbGenre(tag);
      if(found)evidence.push({name:tag,count:2});
    }
  }
  return votesFromTags(evidence,"Wikipedia",1);
}
async function wikidataVotes(page){
  const id=page?.pageprops?.wikibase_item;
  if(!/^Q\d+$/.test(id||""))return [];
  const qs=new URLSearchParams({action:"wbgetentities",ids:id,props:"claims",format:"json",origin:"*"});
  const data=await publicJson("https://www.wikidata.org/w/api.php?"+qs);
  const claims=data.entities?.[id]?.claims?.P136||[];
  const ids=[...new Set(claims.map(c=>c.mainsnak?.datavalue?.value?.id).filter(q=>/^Q\d+$/.test(q||"")))].slice(0,30);
  if(!ids.length)return [];
  const ls=new URLSearchParams({action:"wbgetentities",ids:ids.join("|"),props:"labels",languages:"en",format:"json",origin:"*"});
  const labels=await publicJson("https://www.wikidata.org/w/api.php?"+ls);
  return votesFromTags(ids.map(q=>({name:labels.entities?.[q]?.labels?.en?.value||"",count:3})),"Wikidata",2);
}
function chooseGenre(votes){
  const scores=new Map();
  for(const v of votes){
    if(!scores.has(v.genre))scores.set(v.genre,{score:0,sources:new Set()});
    const entry=scores.get(v.genre);entry.score+=v.weight;entry.sources.add(v.source);
  }
  const ranked=[...scores].sort((a,b)=>b[1].score-a[1].score);
  if(!ranked.length)return {genre:null,source:"unmatched",confidence:"none"};
  const [genre,evidence]=ranked[0],second=ranked[1]?.[1]?.score||0;
  // At least two sources, or strong evidence from one, and avoid near ties.
  const confidence=evidence.sources.size>=2?"high":evidence.score>=8?"medium":"low";
  if(confidence==="low" || (second>0 && evidence.score<second*1.25))
    return {genre:null,source:"ambiguous",confidence:"low"};
  return {genre,source:[...evidence.sources].join(" + "),confidence};
}
async function inferArtistGenre(artist){
  const cache=genreCache(),old=cache[artist.id];
  if(validGenreCache(old))return old;
  const votes=[];
  let success=0,errors=0;
  async function collect(task){
    try{const found=await task();success++;votes.push(...found)}
    catch(e){errors++;}
  }
  // Avoid parallel MusicBrainz bursts; its helper already throttles requests.
  await collect(()=>musicBrainzVotes(artist));
  await collect(()=>lastFmVotes(artist));
  let page=null;
  try{page=await wikiArtist(artist);success++}catch(e){errors++}
  if(page){
    await collect(()=>wikipediaVotes(page));
    await collect(()=>wikidataVotes(page));
  }
  const picked=chooseGenre(votes);
  const result={...picked,time:Date.now(),errors};
  // Do not freeze a network outage or partial data for 30 days.
  if(errors && !result.genre){return result;}
  cache[artist.id]=result;saveGenreCache(cache);
  return result;
}
/* Spotify's /me/top/artists maximum page size is 50.
   Fetch offset 0 and 50 so genre analysis covers as many as 100. */
const genreArtistsCache=new Map();
async function genreArtists100(){
  const key=state.range;
  if(!genreArtistsCache.has(key)){
    const request=Promise.all([
      api("/me/top/artists?limit=50&offset=0&time_range="+encodeURIComponent(key)),
      api("/me/top/artists?limit=50&offset=50&time_range="+encodeURIComponent(key))
    ]).then(([first,second])=>[...(first.items||[]),...(second.items||[])])
      .catch(e=>{genreArtistsCache.delete(key);throw e});
    genreArtistsCache.set(key,request);
  }
  return genreArtistsCache.get(key);
}
let genreScanRunning=false, genreScanRange=null;
const genreProgress={done:0,total:0,found:0,failed:0,unmatched:0};
function countGenres(artists){
  const counts=new Map(), custom=taggedGenres(), inferred=genreCache();
  for(const a of artists){
    const source=custom[a.id] ? [custom[a.id]] : ((Array.isArray(a.genres)&&a.genres.length) ? a.genres : (inferred[a.id]?.genre ? [inferred[a.id].genre] : []));
    for(const g of source){
      const name=String(g).trim().toLowerCase();
      if(name)counts.set(name,(counts.get(name)||0)+1);
    }
  }
  return [...counts].sort((a,b)=>b[1]-a[1]);
}
function genreMessage(){
  if(genreScanRunning){
    return "Automatically checking "+genreProgress.done+" of "+genreProgress.total+
       " artists ("+genreProgress.found+" newly classified, "+genreProgress.unmatched+" no match, "+genreProgress.failed+" lookup errors). "+
      "Keep this page open to finish the first scan. Previous results are cached for 30 days.";
  }
  return "Automatic genre detection checks up to 100 of your top artists when you open this tab. "+
    "Unknown or ambiguous artists remain unclassified. Existing results are cached on this device.";
}
function drawGenres(artists){
  if(state.view!=="genres")return;
  const custom=taggedGenres(), inferred=genreCache();
  const genres=countGenres(artists).slice(0,state.n),el=document.querySelector("#genres");
  const automatic=artists.filter(a=>Array.isArray(a.genres)&&a.genres.length).length;
  const manual=artists.filter(a=>!!custom[a.id]).length;
  const detected=artists.filter(a=>!custom[a.id] && !(a.genres?.length) && inferred[a.id]?.genre).length;
  const classified=artists.filter(a=>!!custom[a.id] || !!a.genres?.length || !!inferred[a.id]?.genre).length;
  let html='<li class="insight"><h2>Your music genres</h2><p class="insight-note">Classified '+classified+' of '+artists.length+' artists · '+automatic+' Spotify genre-tagged · '+detected+' automatically classified · '+manual+' manually labelled. Genres are artist classifications, not exact listening percentages.</p><p class="insight-note" id="genre-scan-status" aria-live="polite">'+safe(genreMessage())+'</p></li>';
  if(genres.length){
    const max=genres[0][1];
    html+=genres.map((g,i)=>'<li class="genre"><span class="rank">'+(i+1)+'</span><div class="gbody"><b>'+safe(titleCase(g[0]))+'</b><div class="bar"><i style="width:'+(g[1]/max*100)+'%"></i></div></div><span class="gcount">'+g[1]+' artists</span></li>').join("");
  }else html+='<li class="insight-note">No supported genre tags yet. Automatic classification is running when connected, and unrecognised artists stay unclassified.</li>';
  html+='<li class="insight genre-editor"><h2>Correct a classification</h2><p class="insight-note">Optional: override any automatic result. Your changes are saved privately in this browser.</p><div class="genre-picker-list">'+artists.map(a=>{
    const img=a.images?.[2]?.url||a.images?.[0]?.url||"";
    const source=inferred[a.id]?.genre || (a.genres?.length ? a.genres[0] : "");
    return '<label class="genre-pick"><img src="'+safe(img)+'" alt=""><span>'+safe(a.name)+'</span><select data-artist-id="'+safe(a.id)+'" aria-label="Genre for '+safe(a.name)+'"><option value="">'+safe(source ? "Auto: "+source : "Not classified")+'</option>'+
    GENRE_OPTIONS.map(g=>'<option value="'+safe(g)+'"'+(custom[a.id]===g?' selected':'')+'>'+safe(g)+'</option>').join("")+'</select></label>';
  }).join("")+'</div><button id="clear-genre-tags" type="button">Clear my corrections</button></li>';
  el.innerHTML=html;
  el.querySelectorAll("select[data-artist-id]").forEach(select=>select.addEventListener("change",()=>{
    const values=taggedGenres();
    if(select.value)values[select.dataset.artistId]=select.value;
    else delete values[select.dataset.artistId];
    try{localStorage.setItem(customGenreKey(),JSON.stringify(values));}catch(e){err("Unable to save corrections in browser storage.");return;}
    drawGenres(artists);
  }));
  document.querySelector("#clear-genre-tags").onclick=()=>{
    localStorage.removeItem(customGenreKey());drawGenres(artists);
  };
}
async function scanGenres(artists){
  if(genreScanRunning)return;
  const range=state.range;
  genreScanRunning=true;genreScanRange=range;
  const cache=genreCache();
  const pending=artists.filter(a=>!(a.genres?.length) && !taggedGenres()[a.id] &&
    !validGenreCache(cache[a.id]));
  genreProgress.done=0;genreProgress.total=pending.length;genreProgress.found=0;genreProgress.failed=0;genreProgress.unmatched=0;
  drawGenres(artists);
  try{
    for(const artist of pending){
      // Do not keep scanning a stale time-range or after logout.
      if(!sessionStorage.getItem("token")||state.range!==range)break;
      try{
        const result=await inferArtistGenre(artist);
        if(result.genre)genreProgress.found++;
        else genreProgress.unmatched++;
      }catch(e){genreProgress.failed++;}
      genreProgress.done++;
      if(genreProgress.done%5===0 || genreProgress.done===pending.length)drawGenres(artists);
    }
  }finally{
    genreScanRunning=false;genreScanRange=null;
    if(state.view==="genres" && state.range===range) drawGenres(artists);
    else if(state.view==="genres") void renderGenres().catch(e=>err(e.message));
  }
}
async function renderGenres(){
  const range=state.range;
  const artists=await genreArtists100();
  if(state.view!=="genres"||state.range!==range)return;
  drawGenres(artists);
  // No click required; cached matches are skipped and scanning is rate limited.
  if(!genreScanRunning)void scanGenres(artists);
}
async function wrapped(){
  const [topTracks,topArtists,allGenreArtists]=await Promise.all([
    api("/me/top/tracks?limit=50&time_range="+state.range),
    rankedArtists(50),
    genreArtists100()
  ]);
  const tracks=topTracks.items||[], artists=topArtists||[], genres=countGenres(allGenreArtists);

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