#!/usr/bin/env python3
"""生成本机 Claude 能力的外部元数据 -> meta.gen.js（自动生成，勿手改）。

两部分，来源不同，脚本里分开处理：

  1. 联网  —— 从 GitHub API 取各插件所属仓库的 Star 数、最近提交时间、
              许可证、仓库官方简介。约 6 次请求，未认证配额 60/小时。
  2. 本地  —— 从 SKILL.md 与 agents/*.md 抽出正文开头的自述段落。
              这些是文件本来就有的内容，不需要联网。

取不到的字段一律留空，不编造。每条数据都在页面上标明来源。

用法：python3 build-meta.py
"""

import datetime
import json
import pathlib
import re
import shutil
import subprocess
import urllib.error
import urllib.request

HOME = pathlib.Path.home()
CLAUDE = HOME / ".claude"
PLUGIN_DIR = CLAUDE / "plugins"
OUT = pathlib.Path(__file__).with_name("meta.gen.js")

# agents/*.md 的来源仓库（这些文件是从该市场装到本机的）
AGENT_MARKET = "claude-code-workflows"

UA = {"User-Agent": "claude-capability-inventory"}


def load_json(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def fetch_repo(slug, cache, ttl_hours=6):
    """取一个 GitHub 仓库的元数据，失败返回 None。

    未认证配额只有 60/小时，而本脚本设计成可反复运行，所以带一层磁盘缓存。
    """
    hit = cache.get(slug)
    if hit:
        age = datetime.datetime.now().timestamp() - hit.get("_at", 0)
        if age < ttl_hours * 3600:
            print(f"  · {slug}（缓存，{age / 3600:.1f} 小时前）")
            return hit
    try:
        req = urllib.request.Request(f"https://api.github.com/repos/{slug}", headers=UA)
        with urllib.request.urlopen(req, timeout=15) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        print(f"  ! {slug}: HTTP {e.code}")
        return hit
    except Exception as e:
        print(f"  ! {slug}: {e}")
        return hit
    lic = d.get("license") or {}
    out = {
        "_at": datetime.datetime.now().timestamp(),
        "url": d.get("html_url"),
        "desc": (d.get("description") or "").strip(),
        "stars": d.get("stargazers_count"),
        "pushed": (d.get("pushed_at") or "")[:10],
        "license": lic.get("spdx_id") if lic else None,
        "archived": bool(d.get("archived")),
    }
    cache[slug] = out
    return out


def github_slug(text):
    """从任意 GitHub 链接里抠出 owner/repo。"""
    m = re.search(r"github\.com/([^/\s#?]+)/([^/\s#?]+)", text or "")
    if not m:
        return None
    return f"{m.group(1)}/{m.group(2).removesuffix('.git')}"


STRUCT = re.compile(r"^(#{1,6}\s|```|\||>|---|\*\*\*|<\w|\[\^)")
LIST = re.compile(r"^([-*+]|\d+\.)\s")


def first_paragraph(path, limit=170):
    """抽正文里第一段像是人话的内容，去掉 markdown 装饰。

    有些 SKILL.md 正文一上来就是表格或代码块，直接按空行分段会抓到
    「| Task | Approach |」这种东西。这里先跳过开头的一切结构行，
    直到遇见真正的散文或列表项；列表项只取一条，否则会把整串拍平成连珠。
    """
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return ""
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2]
    buf, started = [], False
    for raw in text.splitlines():
        s = raw.strip()
        if not started:
            if not s or STRUCT.match(s):
                continue
            started = True
        if not s or STRUCT.match(s):
            break
        if buf and LIST.match(s):
            break
        buf.append(s)
    para = " ".join(buf)
    para = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", para)      # 链接保留文字
    para = re.sub(r"^([-*+]|\d+\.)\s*", "", para)               # 去掉行首列表符号
    para = re.sub(r"[*_`>]", "", para)
    para = re.sub(r"\s+", " ", para).strip()
    if len(para) > limit:                                        # 截在句末，不切半句
        cut = max(para.rfind("。", 0, limit), para.rfind(". ", 0, limit), para.rfind("；", 0, limit))
        para = para[: cut + 1] if cut > limit * 0.6 else para[:limit].rstrip() + "…"
    return para


def probe_status(installed):
    """探测运行状态：MCP 连接情况 + 插件的运行时依赖。

    「已配置」和「能用」是两件事。这里只报事实，不做推断——
    探不到的就不写，宁可缺也不编。
    """
    st = {}

    if shutil.which("claude") is None:
        print("  ! 找不到 claude 命令，跳过 MCP 连接探测")
    else:
        try:
            r = subprocess.run(["claude", "mcp", "list"], capture_output=True, text=True, timeout=120)
            for line in r.stdout.splitlines():
                line = line.strip()
                if " - " not in line:
                    continue
                head, tail = line.rsplit(" - ", 1)
                name = head.split(": ", 1)[0]
                if name.startswith("plugin:"):          # plugin:claude-mem:mcp-search
                    name = name.split(":")[-1]
                ok = tail.lstrip().startswith("✔")
                st[name] = {
                    "ok": ok,
                    "kind": "mcp",
                    "reason": "" if ok else tail.lstrip("✘ ").strip(),
                }
        except Exception as e:
            print(f"  ! claude mcp list 失败：{e}")

    # 插件的运行时依赖：装了插件但依赖不在，等于没装
    # （installed 的键形如 pyright-lsp@claude-plugins-official，要比对去后缀的名字）
    installed_names = {k.split("@")[0] for k in installed}
    for plug, dep in {"pyright-lsp": "pyright"}.items():
        if plug in installed_names and shutil.which(dep) is None:
            st[plug] = {"ok": False, "kind": "plugin", "reason": f"依赖 {dep} 未安装，插件不生效"}

    return st


def main():
    installed = load_json(PLUGIN_DIR / "installed_plugins.json", {}).get("plugins", {})
    markets = load_json(PLUGIN_DIR / "known_marketplaces.json", {})
    market_repo = {k: github_slug(v.get("source", {}).get("repo", "")) or v.get("source", {}).get("repo")
                   for k, v in markets.items()}

    # ---- 插件 -> 仓库 ----
    plugin_repo = {}
    for pid, entries in installed.items():
        user = next((e for e in entries if e.get("scope") == "user"), entries[0] if entries else None)
        if not user:
            continue
        name = pid.split("@")[0]
        market = pid.split("@")[1] if "@" in pid else ""
        base = pathlib.Path(user.get("installPath", ""))
        pj = load_json(base / ".claude-plugin" / "plugin.json", {})
        slug = github_slug(pj.get("homepage", "")) or github_slug(pj.get("repository", ""))
        plugin_repo[name] = {"slug": slug or market_repo.get(market), "market": market}

    # ---- 技能 -> 自述（同时记下它属于哪个插件，好把仓库也带上） ----
    skill_blurb = {}
    skill_plugin = {}
    src_dirs = []
    for pid, entries in installed.items():
        user = next((e for e in entries if e.get("scope") == "user"), entries[0] if entries else None)
        if user:
            src_dirs.append((pid.split("@")[0], pathlib.Path(user.get("installPath", "")) / "skills"))
    for name, d in src_dirs:
        if not d.is_dir():
            continue
        for sk in sorted(d.iterdir()):
            f = sk / "SKILL.md"
            if f.is_file():
                skill_blurb[sk.name] = first_paragraph(f)
                skill_plugin[sk.name] = name
    # 用户自建技能：覆盖同名的插件技能，并且不继承插件归属
    # （anthropics/skills 里也有 skill-creator，若不覆盖会把它错算成那个仓库的）
    sk_dir = CLAUDE / "skills"
    if sk_dir.is_dir():
        for sk in sorted(sk_dir.iterdir()):
            f = sk / "SKILL.md"
            if f.is_file():
                skill_blurb[sk.name] = first_paragraph(f)
                skill_plugin.pop(sk.name, None)

    # ---- 代理 -> 自述 ----
    agent_blurb = {}
    adir = CLAUDE / "agents"
    if adir.is_dir():
        for f in sorted(adir.glob("*.md")):
            agent_blurb[f.stem] = first_paragraph(f)

    # ---- 联网取仓库元数据 ----
    slugs = sorted({v["slug"] for v in plugin_repo.values() if v.get("slug")}
                   | {market_repo.get(AGENT_MARKET)})
    slugs = [s for s in slugs if s]
    cache_path = OUT.with_name("meta.cache.json")
    cache = load_json(cache_path, {})
    print(f"读取 {len(slugs)} 个仓库：")
    repos = {}
    for s in slugs:
        d = fetch_repo(s, cache)
        if d:
            repos[s] = d
            print(f"  ✓ {s}  ★{d['stars']}  {d['pushed']}")
    cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")

    def clean(r):
        """缓存里的 _at 是时间戳，输出时换成可读日期。"""
        out = {k: v for k, v in r.items() if k != "_at"}
        out["fetched"] = datetime.datetime.fromtimestamp(r.get("_at", 0)).strftime("%Y-%m-%d")
        return out

    # ---- 运行状态探测 ----
    print("探测运行状态：")
    status = probe_status(installed)
    for k, v in sorted(status.items()):
        print(f"  {'✓' if v['ok'] else '✗'} {k}" + ("" if v["ok"] else f"  {v['reason']}"))

    # ---- 输出 ----
    payload = {
        "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        "status": status,
        "repos": {k: clean(v) for k, v in repos.items()},
        "pluginRepo": {k: v["slug"] for k, v in plugin_repo.items() if v.get("slug")},
        "agentRepo": market_repo.get(AGENT_MARKET),
        "skillBlurb": skill_blurb,
        "skillPlugin": skill_plugin,
        "agentBlurb": agent_blurb,
    }
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    OUT.write_text(
        '"use strict";\n'
        "/* 本文件由 build-meta.py 生成，请勿手改。重跑该脚本即可刷新。 */\n"
        f"const META = {body};\n",
        encoding="utf-8",
    )
    print(f"\n写出 {OUT.name}：{OUT.stat().st_size} 字节")
    print(f"  仓库 {len(repos)} 个、插件映射 {len(payload['pluginRepo'])} 条、"
          f"技能自述 {len(skill_blurb)} 条、代理自述 {len(agent_blurb)} 条")


if __name__ == "__main__":
    main()
