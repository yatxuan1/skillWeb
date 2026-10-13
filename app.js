"use strict";

/* ============================================================
   逻辑
   ------------------------------------------------------------
   数据在 data.js，必须先于本文件加载。
   ============================================================ */

const doc = document.getElementById("doc");
const nav = document.getElementById("nav");
const rail = document.getElementById("rail");
const qEl = document.getElementById("q");
const resEl = document.getElementById("results");

/* 侧栏与导语里的汇总数字取自 data.js 的 STATS，不写死 */
document.querySelectorAll("[data-stat]").forEach(el => {
  el.textContent = STATS[el.dataset.stat];
});

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* 把 {{token}} 换成 data.js 算出的数字，未识别的原样保留 */
function subst(s, extra){
  return String(s).replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if(extra && k in extra) return extra[k];
    return k in STATS ? STATS[k] : m;
  });
}

/* 判断一段内容该用哪种样式 */
function clsOf(v){
  if(v.startsWith("/")) return "cmd";
  if(/[/\\]/.test(v) || /\.[a-z0-9]{1,5}$/i.test(v)) return "path";
  return "id";
}

/* 把命令、路径、标识符渲染成可区分、可点击复制的行内元素。
   已包裹的片段先换成占位符，避免后续规则二次匹配。 */
function idify(text){
  const stash = [];
  const keep = html => `\u0001${stash.push(html) - 1}\u0001`;
  const wrap = (cls, raw) => keep(
    `<span class="${cls}" data-copy="${raw}" title="点击复制">${raw}</span>`);

  let s = esc(text);

  /* 放行少量内联标签，其余一律当纯文本 */
  s = s.replace(/&lt;code&gt;([\s\S]*?)&lt;\/code&gt;/g, (m, a) => wrap(clsOf(a), a));
  s = s.replace(/&lt;(\/?)(b|em|strong)&gt;/g, "<$1$2>");

  /* 反引号包裹的按内容判类型 */
  s = s.replace(/`([^`]+)`/g, (m, a) => wrap(clsOf(a), a));

  /* 家目录、绝对路径、点开头的隐藏目录 */
  s = s.replace(/(~\/[^\s，。、）)「」\]]+)/g, (m, a) => wrap("path", a));
  s = s.replace(/(^|[\s（(「｜])(\/(?:Users|private|tmp|etc|var|opt)\/[^\s，。、）)「」\]]*)/g,
                (m, pre, a) => pre + wrap("path", a));
  s = s.replace(/(^|[\s（(「｜])(\.[a-z][a-z0-9-]*\/[^\s，。、）)「」\]]*)/g,
                (m, pre, a) => pre + wrap("path", a));
  /* 文件名 */
  s = s.replace(/(^|[\s（(「｜])(\.?[A-Za-z0-9_一-鿿-]+\.(?:md|json|js|css|html|py|ico|svg|ya?ml|tsx?|java|xml|toml|txt))\b/g,
                (m, pre, a) => pre + wrap("path", a));

  /* 斜杠命令 */
  s = s.replace(/(^|[\s（(「｜])(\/[a-z][a-z0-9-]{1,40})(?![\/\w-])/g,
                (m, pre, a) => pre + wrap("cmd", a));

  /* 余下的按标识符处理 */
  s = s.replace(/\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/g, (m, a) => wrap("id", a));
  s = s.replace(/\b([a-z]+(?:-[a-z0-9]+){1,})\b/g, (m, a) => wrap("id", a));

  return s.replace(/\u0001(\d+)\u0001/g, (m, i) => stash[Number(i)]);
}

/* 表格行 → 详情 key。返回 null 表示该行没有详情。 */
const QUICK_KEY = {
  "Playwright MCP":"playwright",
  "CodeGraph MCP":"codegraph",
  "document-skills 的 xlsx·docx·pptx·pdf":"xlsx"
};

function keyFor(secId, row){
  if(secId === "quick"){
    const raw = row[1];
    return QUICK_KEY[raw] || raw.split(" · ")[0].replace(/^\//,"").trim();
  }
  if(secId === "plugins" || secId === "skills" || secId === "agents") return row[0];
  if(secId === "mcp") return row[0].split(" / ")[0].trim();
  return null;
}

function renderBlock(b, secId){
  if(b.t === "h3") return `<h3>${esc(subst(b.x, {rows: b.n}))}</h3>`;
  if(b.t === "p")  return `<p>${idify(b.x)}</p>`;
  if(b.t === "ul") return `<ul class="plain">${b.items.map(i => `<li>${idify(i)}</li>`).join("")}</ul>`;
  if(b.t === "note") return `<div class="note">${idify(b.x)}</div>`;
  if(b.t === "agents") return `<div id="agentdir"></div>`;
  if(b.t === "table"){
    const head = b.head.map(h => `<th>${esc(h)}</th>`).join("");
    const rows = b.rows.map(r => {
      const tds = r.map((c,i) => {
        const cls = i === 0 ? "name" : (i === r.length - 1 && r.length > 2 ? "wide" : "");
        return `<td class="${cls}">${idify(c)}</td>`;
      }).join("");
      const k = keyFor(secId, r);
      return k ? `<tr data-key="${esc(k)}">${tds}</tr>` : `<tr>${tds}</tr>`;
    }).join("");
    return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
  }
  return "";
}

SECTIONS.forEach(sec => {
  const el = document.createElement("section");
  el.id = sec.id;
  el.innerHTML = `<h2 id="${sec.id}-h"><span class="num">${sec.num}</span>${esc(sec.title)}</h2>`
    + sec.blocks.map(b => renderBlock(b, sec.id)).join("");
  doc.appendChild(el);
});

/* 目录：等折叠容器建好之后再生成，见下方「折叠」一节 */

/* ---- 子代理目录 ---- */
const AGENT_PREFIX_MAP = {
  academic:"学术", accounts:"财务", agentic:"智能体", agents:"智能体", automation:"自动化",
  blender:"3D", blockchain:"区块链", compliance:"合规", corporate:"企业", data:"数据",
  design:"设计", engineering:"工程", finance:"财务", game:"游戏", gaokao:"教育",
  godot:"Godot", government:"政务", healthcare:"医疗", hospitality:"酒店", hr:"人力",
  identity:"身份", language:"语言", legal:"法律", level:"游戏", livestock:"农业",
  loan:"金融", lsp:"工具链", macos:"平台", marketing:"营销", narrative:"叙事",
  paid:"投放", product:"产品", project:"项目", prompt:"提示词", real:"地产",
  recruitment:"招聘", report:"运营", retail:"零售", roblox:"Roblox", sales:"销售",
  specialized:"专业", study:"教育", supply:"供应链", support:"职能", technical:"技术美术",
  terminal:"工具链", testing:"测试", unity:"Unity", unreal:"Unreal",
  visionos:"平台", xr:"XR", zk:"知识管理"
};

(function renderAgents(){
  const host = document.getElementById("agentdir");
  if(!host) return;

  const groups = new Map();
  AGENTS.forEach(([file, cn, desc]) => {
    const p = file.split("-")[0];
    const label = AGENT_PREFIX_MAP[p] || "其他";
    if(!groups.has(label)) groups.set(label, []);
    groups.get(label).push([file, cn, desc]);
  });

  const big = [...groups.entries()].filter(([,v]) => v.length >= 3).sort((a,b) => b[1].length - a[1].length);
  const small = [...groups.entries()].filter(([,v]) => v.length < 3).flatMap(([,v]) => v);
  if(small.length) big.push(["其他", small.sort((a,b) => a[0].localeCompare(b[0]))]);

  host.innerHTML = big.map(([label, list]) => `
    <h3 class="agroup">${esc(label)}　<span class="cnt">${list.length}</span></h3>
    <table class="agtable"><tbody>
      ${list.map(([file, cn, desc]) => `
        <tr data-key="${esc(file)}">
          <td class="name" style="width:15em">${esc(cn)}</td>
          <td style="width:22em"><span class="id" data-copy="${esc(file)}" title="点击复制文件名">${esc(file)}</span></td>
          <td class="wide">${esc(desc)}</td>
        </tr>`).join("")}
    </tbody></table>`).join("");

  host.insertAdjacentHTML("afterbegin",
    `<p class="hint">共 ${AGENTS.length} 个，按用途分组。点文件名可复制，直接说「用 <b>最小变更工程师</b>」或 <b>@</b> 唤起即可调用。</p>`);
})();

/* ============================================================
   折叠
   ============================================================ */

const FOLD_MAP = new Map();

function setUpFold(heading){
  // 只遇到同级或更高级的标题才停，否则 h2 会被紧跟其后的 h3 立刻截断
  const level = Number(heading.tagName[1]);

  // 把标题之后、下一个同级标题之前的兄弟节点收进一个容器
  const body = document.createElement("div");
  body.className = "foldbody";
  let node = heading.nextSibling;
  while(node){
    const next = node.nextSibling;
    if(node.nodeType === 1 && /^H[1-6]$/.test(node.tagName) && Number(node.tagName[1]) <= level) break;
    body.appendChild(node);
    node = next;
  }
  if(!body.firstChild) return;
  body.id = `fold-${FOLD_MAP.size}`;
  heading.parentNode.insertBefore(body, heading.nextSibling);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "foldbtn";
  btn.setAttribute("aria-expanded", "true");
  btn.setAttribute("aria-controls", body.id);
  btn.innerHTML = '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';
  while(heading.firstChild) btn.appendChild(heading.firstChild);
  heading.appendChild(btn);

  btn.addEventListener("click", () => toggleFold(heading, undefined));
  FOLD_MAP.set(body, {heading, btn});
}

function toggleFold(heading, force){
  const body = heading.nextElementSibling;
  if(!body || !body.classList.contains("foldbody")) return;
  const expanded = force === undefined ? body.classList.contains("collapsed") : force;
  body.classList.toggle("collapsed", !expanded);
  const entry = FOLD_MAP.get(body);
  if(!entry) return;
  entry.btn.setAttribute("aria-expanded", String(expanded));
  /* 左栏目录跟着一起开关，两边状态不能对不上 */
  if(entry.navBtn){
    entry.navBtn.setAttribute("aria-expanded", String(expanded));
    if(entry.navSub) entry.navSub.classList.toggle("collapsed", !expanded);
  }
}

/* 先处理 h2，再处理 h3，这样 h3 的容器会正确嵌在 h2 容器里 */
doc.querySelectorAll("h2").forEach(setUpFold);
doc.querySelectorAll("h3").forEach(setUpFold);

/* ============================================================
   左栏目录：章节 + 小节两级
   ============================================================ */

SECTIONS.forEach(sec => {
  const el = document.getElementById(sec.id);
  const subs = [...el.querySelectorAll("h3:not(.agroup)")];

  const group = document.createElement("div");
  group.className = "navgroup";

  const row = document.createElement("div");
  row.className = "navrow";

  let navBtn = null;
  if(subs.length){
    navBtn = document.createElement("button");
    navBtn.type = "button";
    navBtn.className = "navchev";
    navBtn.setAttribute("aria-expanded", "true");
    navBtn.setAttribute("aria-label", `展开或折叠「${sec.title}」`);
    navBtn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';
    row.appendChild(navBtn);
  } else {
    const pad = document.createElement("span");
    pad.className = "navchev pad";
    row.appendChild(pad);
  }

  const link = document.createElement("a");
  link.href = `#${sec.id}`;
  link.dataset.sec = sec.id;
  link.innerHTML = `<span class="n">${sec.num}</span><span>${esc(sec.title)}</span>`;
  row.appendChild(link);
  group.appendChild(row);

  let subBox = null;
  if(subs.length){
    subBox = document.createElement("div");
    subBox.className = "navsub";
    subs.forEach((h, i) => {
      if(!h.id) h.id = `${sec.id}-sub-${i}`;
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.dataset.sub = h.id;
      a.dataset.sec = sec.id;
      a.textContent = h.textContent.trim().split("（")[0].trim();
      subBox.appendChild(a);
    });
    group.appendChild(subBox);
  }

  nav.appendChild(group);

  /* 把左栏的三角和正文该节的折叠容器绑到一起 */
  if(navBtn){
    const foldBody = el.querySelector(":scope > .foldbody");
    const entry = foldBody && FOLD_MAP.get(foldBody);
    if(entry){
      entry.navBtn = navBtn;
      entry.navSub = subBox;
      navBtn.addEventListener("click", () => toggleFold(entry.heading, undefined));
    }
  }
});

/* 跳转前先把沿途收起的层级展开，否则目标藏在折叠区里 */
function reveal(el){
  for(let p = el.parentElement; p; p = p.parentElement){
    if(p.classList.contains("foldbody") && p.classList.contains("collapsed")){
      const entry = FOLD_MAP.get(p);
      if(entry) toggleFold(entry.heading, true);
    }
  }
}

document.getElementById("foldall").addEventListener("click", () => {
  FOLD_MAP.forEach(entry => toggleFold(entry.heading, false));
});
document.getElementById("unfoldall").addEventListener("click", () => {
  FOLD_MAP.forEach(entry => toggleFold(entry.heading, true));
});

/* ============================================================
   索引（供搜索）
   ============================================================ */

/* [元素, 所属章节标题, 展示文本] */
const INDEX = [];

const CAT_LABEL = {
  quick:"场景", plugins:"插件", skills:"技能", agents:"子代理",
  mcp:"MCP", hooks:"Hooks", perms:"权限", env:"环境", files:"目录"
};

function indexNode(el, cat, secTitle, text, key){
  if(!text || !text.trim()) return;
  INDEX.push({el, cat, secTitle, key:key || null, text:text.replace(/\s+/g," ").trim()});
}

doc.querySelectorAll("section").forEach(sec => {
  const h2 = sec.querySelector("h2");
  const secTitle = h2 ? h2.textContent.trim() : "";
  sec.querySelectorAll("h2,h3,tr,li").forEach(el => {
    if(el.tagName === "TR"){
      const tds = [...el.querySelectorAll("td")];
      if(!tds.length) return;
      indexNode(el, sec.id, secTitle, tds.map(t => t.textContent).join(" ｜ "), el.dataset.key);
    } else if(el.tagName === "LI"){
      indexNode(el, sec.id, secTitle, el.textContent, null);
    } else if(el.tagName === "H3"){
      indexNode(el, sec.id, secTitle, el.textContent, null);
    }
  });
});

/* 分类筛选按钮 */
const chipsEl = document.getElementById("chips");
let activeCat = "";

/* 按钮上的数字是「该分类下可被搜索到的条数」，不是条目数——
   它要回答的是「点下去能搜到多少」，所以按索引条目算。含义放在 title 里说清。 */
const chipTitle = (name, n) => `${name}分类，共 ${n} 条可被搜索的内容`;

chipsEl.innerHTML =
  `<button data-cat="" class="on" title="${chipTitle("全部", INDEX.length)}">全部<span class="c">${INDEX.length}</span></button>`
  + SECTIONS.map(s => {
      const n = INDEX.filter(r => r.cat === s.id).length;
      return `<button data-cat="${s.id}" title="${chipTitle(CAT_LABEL[s.id], n)}">`
        + `${esc(CAT_LABEL[s.id])}<span class="c">${n}</span></button>`;
    }).join("");

chipsEl.addEventListener("click", e => {
  const b = e.target.closest("button[data-cat]");
  if(!b) return;
  activeCat = b.dataset.cat;
  [...chipsEl.querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
  search(qEl.value);
});

function resetChips(){
  activeCat = "";
  [...chipsEl.querySelectorAll("button")].forEach((x,i) => x.classList.toggle("on", i === 0));
}

/* ============================================================
   搜索
   ============================================================ */

let matches = [];
let cursor = -1;

function hl(text, q){
  const e = esc(text);
  if(!q) return e;
  const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return e.replace(re, "<mark>$1</mark>");
}

function search(qRaw){
  const q = qRaw.trim().toLowerCase();
  closeDrawer();
  if(!q && !activeCat) return closeResults();

  matches = INDEX.filter(r =>
    (!activeCat || r.cat === activeCat) &&
    (!q || r.text.toLowerCase().includes(q))
  );
  cursor = -1;

  doc.style.display = "none";
  resEl.style.display = "block";
  window.scrollTo(0,0);

  if(!matches.length){
    resEl.innerHTML = `<p class="rsum">没有匹配的内容。</p>
      <p class="rempty">换个词试试，或点「全部」取消分类筛选。常见入口：提交、浏览器、测试、小红书、PDF、搜索词、绩效。</p>`;
    return;
  }

  const scope = (activeCat ? `，限「${esc(CAT_LABEL[activeCat])}」` : "")
              + (q ? `，匹配「${esc(qRaw)}」` : "");

  resEl.innerHTML = `<p class="rsum">共 <b>${matches.length}</b> 条${scope}　<span style="font-size:13px">↑ ↓ 选择，Enter 看详情</span></p>
    <ul class="rlist" id="rlist">${matches.map((m,i) => `
      <li><button data-i="${i}">
        <span class="rsec">${esc(m.secTitle)}</span>
        <div class="rtxt">${hl(m.text, qRaw)}</div>
      </button></li>`).join("")}</ul>`;
}

function closeResults(){
  resEl.style.display = "none";
  resEl.innerHTML = "";
  doc.style.display = "";
  matches = [];
  cursor = -1;
  syncNav();
}

function moveCursor(d){
  if(!matches.length) return;
  cursor = Math.max(0, Math.min(matches.length - 1, cursor + d));
  const btns = resEl.querySelectorAll(".rlist button");
  btns.forEach((b,i) => b.classList.toggle("cursor", i === cursor));
  if(btns[cursor]) btns[cursor].scrollIntoView({block:"nearest"});
}

function jump(i){
  const m = matches[i];
  if(!m) return;
  qEl.value = "";
  closeResults();
  requestAnimationFrame(() => {
    reveal(m.el);
    m.el.scrollIntoView({block:"center", behavior:"smooth"});
    m.el.classList.add("flash");
    setTimeout(() => m.el.classList.remove("flash"), 1200);
  });
}

/* ============================================================
   详情抽屉
   ============================================================ */

const drawer = document.createElement("aside");
drawer.id = "drawer";
drawer.className = "drawer";
drawer.setAttribute("role", "dialog");
drawer.setAttribute("aria-label", "条目详情");
document.body.appendChild(drawer);

/* 每个 key 在正文里的第一个落点 */
const BY_KEY = new Map();
INDEX.forEach(r => { if(r.key && !BY_KEY.has(r.key)) BY_KEY.set(r.key, r.el); });

function copyText(t){
  navigator.clipboard.writeText(t.dataset.copy).then(() => {
    t.classList.add("flash");
    setTimeout(() => t.classList.remove("flash"), 900);
  }).catch(() => {});
}

function links(arr, cls){
  return `<div class="${cls}">${arr.map(([k,t]) => {
    if(!DETAIL[k]) return `<span class="id" data-copy="${esc(k)}" title="点击复制">${esc(k)}</span>`;
    const nm = DETAIL[k].title || k;
    return `<button data-goto="${esc(k)}">${esc(nm)}${t ? `<em>${esc(t)}</em>` : ""}</button>`;
  }).join("")}</div>`;
}

function field(label, html){
  return html ? `<div class="dfield"><h4>${label}</h4>${html}</div>` : "";
}

function openDrawer(key){
  const d = DETAIL[key];
  if(!d) return false;
  const kind = KIND[d.k] || {src:""};
  const parts = [];
  if(d.intro) parts.push(`<p class="dlead">${idify(d.intro)}</p>`);
  if(d.when)  parts.push(field("何时用它", `<p>${idify(d.when)}</p>`));
  if(d.how && d.how.length) parts.push(field("调用方式",
    `<div class="dhow">${d.how.map(([l,c,cp]) =>
      `<div class="row"><span class="lbl">${esc(l)}</span>` +
      (cp === false
        ? `<span class="howtext">${esc(c)}</span>`
        : `<span class="${clsOf(c)}" data-copy="${esc(c)}" title="点击复制">${esc(c)}</span>`) +
      `</div>`).join("")}</div>`));
  parts.push(field("安装与启用", `<p>${idify(INSTALL[d.k] || "")}</p>`));
  if(d.pair && d.pair.length) parts.push(field("搭配推荐", links(d.pair, "dlinks")));
  if(d.note) parts.push(field("注意事项", `<p>${idify(d.note)}</p>`));
  if(d.rel && d.rel.length)  parts.push(field("相关条目", links(d.rel, "dlinks")));

  drawer.innerHTML =
    `<div class="dhead">
       <div style="flex:1;min-width:0">
         <div class="dtitle">${esc(d.title || key)}</div>
         <div class="dmeta">${esc(kind.src + (d.p ? "　" + d.p : ""))}</div>
       </div>
       <button class="dclose" aria-label="关闭详情">✕</button>
     </div>
     <div class="dbody">${parts.join("")}</div>
     <div class="dfoot">
       <button class="primary" data-jump="${esc(key)}">在正文中定位</button>
       <button class="dclose">关闭</button>
     </div>`;
  drawer.classList.add("open");
  drawer.querySelector(".dbody").scrollTop = 0;
  return true;
}

function closeDrawer(){ drawer.classList.remove("open"); }

function jumpToKey(key){
  const el = BY_KEY.get(key);
  closeDrawer();
  qEl.value = "";
  resetChips();
  closeResults();
  if(!el) return;
  requestAnimationFrame(() => {
    reveal(el);
    el.scrollIntoView({block:"center", behavior:"smooth"});
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1200);
  });
}

/* ============================================================
   事件
   ============================================================ */

function activate(i){
  const m = matches[i];
  if(!m) return;
  if(m.key && DETAIL[m.key]) openDrawer(m.key);
  else jump(i);
}

qEl.addEventListener("input", e => search(e.target.value));
qEl.addEventListener("keydown", e => {
  if(e.key === "ArrowDown"){ e.preventDefault(); moveCursor(1); }
  else if(e.key === "ArrowUp"){ e.preventDefault(); moveCursor(-1); }
  else if(e.key === "Enter"){ e.preventDefault(); activate(cursor < 0 ? 0 : cursor); }
  else if(e.key === "Escape"){ qEl.value = ""; resetChips(); closeResults(); closeDrawer(); qEl.blur(); }
});

resEl.addEventListener("click", e => {
  const b = e.target.closest(".rlist button");
  if(b) activate(Number(b.dataset.i));
});

drawer.addEventListener("click", e => {
  if(e.target.closest(".dclose")) return closeDrawer();
  const g = e.target.closest("[data-goto]");
  if(g) return void openDrawer(g.dataset.goto);
  const j = e.target.closest("[data-jump]");
  if(j) return jumpToKey(j.dataset.jump);
  const cp = e.target.closest(".id,.cmd,.path");
  if(cp) copyText(cp);
});

document.addEventListener("keydown", e => {
  if(e.key === "Escape" && drawer.classList.contains("open")){ closeDrawer(); return; }
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){
    e.preventDefault(); rail.classList.add("open"); closeDrawer(); qEl.focus(); qEl.select();
  }
});

/* 点抽屉外面收起（移动端抽屉铺满，不会触发） */
document.addEventListener("click", e => {
  if(!drawer.classList.contains("open")) return;
  if(drawer.contains(e.target)) return;
  if(e.target.closest(".rlist button")) return;
  closeDrawer();
});

doc.addEventListener("click", e => {
  const t = e.target.closest(".id,.cmd,.path");
  if(t){ copyText(t); return; }
  const tr = e.target.closest("tr[data-key]");
  if(tr) openDrawer(tr.dataset.key);
});

/* ============================================================
   导航高亮 + 移动端抽屉
   ============================================================ */

const navLinks = [...nav.querySelectorAll(".navrow a")];
const subLinks = [...nav.querySelectorAll(".navsub a")];

function syncNav(){
  let cur = SECTIONS[0].id;
  for(const s of SECTIONS){
    const el = document.getElementById(s.id);
    if(el && el.getBoundingClientRect().top <= 90) cur = s.id;
  }
  navLinks.forEach(a => a.classList.toggle("on", a.dataset.sec === cur));

  /* 折叠起来的小节 offsetParent 是 null，不参与判定；
     每个小节只在自己所属章节是当前章节时才可能被选中 */
  let curSub = "";
  subLinks.forEach(a => {
    if(a.dataset.sec !== cur) return;
    const el = document.getElementById(a.dataset.sub);
    if(el && el.offsetParent !== null && el.getBoundingClientRect().top <= 90) curSub = a.dataset.sub;
  });
  subLinks.forEach(a => a.classList.toggle("on", a.dataset.sub === curSub));
}
let ticking = false;
window.addEventListener("scroll", () => {
  if(ticking) return;
  ticking = true;
  requestAnimationFrame(() => { if(doc.style.display !== "none") syncNav(); ticking = false; });
}, {passive:true});
syncNav();

nav.addEventListener("click", e => {
  /* 点进折叠着的章节或小节时先展开，避免落在空白上 */
  const secLink = e.target.closest(".navrow a");
  if(secLink){
    const fb = document.querySelector(`#${secLink.dataset.sec} > .foldbody`);
    const entry = fb && FOLD_MAP.get(fb);
    if(entry && fb.classList.contains("collapsed")) toggleFold(entry.heading, true);
  }
  const subLink = e.target.closest(".navsub a");
  if(subLink){
    const el = document.getElementById(subLink.dataset.sub);
    if(el) reveal(el);
  }
  if(e.target.closest("a")) rail.classList.remove("open");
});

const toggle = document.getElementById("railtoggle");
toggle.addEventListener("click", () => {
  const open = rail.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", e => {
  if(window.innerWidth > 900) return;
  if(!rail.classList.contains("open")) return;
  if(rail.contains(e.target) || toggle.contains(e.target)) return;
  rail.classList.remove("open");
});

/* ============================================================
   深浅色
   ============================================================ */

const themebtn = document.getElementById("themebtn");
const themelabel = document.getElementById("themelabel");

function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  themelabel.textContent = t === "dark" ? "浅色" : "深色";
}
themebtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try{ localStorage.setItem("cccap-theme", next); }catch(e){}
});
applyTheme(document.documentElement.getAttribute("data-theme") || "light");
