"use strict";
(function(){

        const EL_CSS = `
.el{--bg:#13171c;--surface:#1b2128;--raised:#252d36;--line:#333e4a;--text:#e8ebef;--muted:#98a3b0;--accent:#6fbf73;--warn:#e3b341;--err:#f0716a;--info:#7cb7f0;
font:14px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--text)}
.el,.el *,.el *::before,.el *::after{box-sizing:border-box}
.el-screen{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg);user-select:none;z-index:2147483000}
.el-card{width:min(460px,100%);display:flex;flex-direction:column;gap:20px}
.el-brand{display:flex;align-items:center;gap:16px}
.el-logo{width:56px;height:56px;flex:none;image-rendering:pixelated;border-radius:6px}
.el-title{margin:0;font-size:22px;font-weight:650;letter-spacing:-.01em;line-height:1.2}
.el-sub{margin:2px 0 0;color:var(--muted);font-size:13px}
.el-bar{display:grid;grid-template-columns:repeat(24,1fr);gap:3px;height:18px}
.el-seg{background:var(--raised);border-radius:2px;transition:background .15s}
.el-seg.on{background:var(--accent)}
.el-bar.fail .el-seg.on{background:var(--err)}
.el-bar.busy .el-seg{animation:el-pulse 1.5s ease-in-out infinite;animation-delay:calc(var(--i)*45ms)}
@keyframes el-pulse{0%,100%{background:var(--raised)}50%{background:#3b4d3f}}
.el-meta{display:flex;justify-content:space-between;gap:12px;color:var(--text);font-size:13px;font-variant-numeric:tabular-nums}
.el-pct{color:var(--muted)}
.el-detail{margin:-12px 0 0;color:var(--muted);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-height:18px}
.el-actions{display:flex;gap:8px;flex-wrap:wrap;min-height:36px}
.el-actions.end{justify-content:flex-end}
.el-btn{font:inherit;color:var(--text);background:var(--raised);border:1px solid var(--line);border-radius:6px;padding:6px 14px;cursor:pointer}
.el-btn:hover{background:#2e3844}
.el-btn:focus-visible,.el-chip:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.el-btn.primary{background:var(--accent);border-color:var(--accent);color:#0e1a0f;font-weight:600}
.el-btn.primary:hover{background:#85cd89}
.el-btn[disabled]{opacity:.45;cursor:default}
.el-btn[hidden]{display:none}
.el-card.err .el-title{color:var(--err)}
.el-modal-wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,10,13,.72);z-index:2147483100}
.el-modal{width:min(420px,100%);background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:12px}
.el-modal-title{margin:0;font-size:17px;font-weight:650}
.el-modal-body{margin:0 0 6px;color:var(--muted)}
.el-con{position:fixed;left:0;right:0;bottom:0;height:42vh;min-height:220px;display:none;flex-direction:column;background:rgba(19,23,28,.97);border-top:1px solid var(--line);z-index:2147483200}
.el-con.open{display:flex}
.el-con-bar{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.el-con-title{font-weight:650;margin-right:6px}
.el-chip{font:inherit;font-size:12.5px;color:var(--muted);background:none;border:1px solid transparent;border-radius:999px;padding:2px 10px;cursor:pointer}
.el-chip:hover{color:var(--text)}
.el-chip.on{color:var(--text);background:var(--raised);border-color:var(--line)}
.el-search{flex:1;min-width:120px;font:inherit;font-size:13px;color:var(--text);background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:3px 10px}
.el-search:focus{outline:2px solid var(--accent);outline-offset:-1px}
.el-log{flex:1;overflow:auto;padding:6px 0;font:12.5px/1.55 ui-monospace,"SF Mono",Menlo,Consolas,monospace;user-select:text}
.el-row{display:grid;grid-template-columns:64px 1fr;gap:10px;padding:1px 12px;border-left:3px solid transparent;white-space:pre-wrap;word-break:break-word}
.el-row.warn{border-left-color:var(--warn);background:rgba(227,179,65,.07)}
.el-row.error{border-left-color:var(--err);background:rgba(240,113,106,.08)}
.el-row.cmd .el-msg{color:var(--accent)}
.el-row.result .el-msg{color:var(--info)}
.el-time{color:var(--muted)}
.el-in{display:flex;align-items:center;gap:8px;padding:6px 12px;border-top:1px solid var(--line);font:12.5px ui-monospace,"SF Mono",Menlo,Consolas,monospace}
.el-in span{color:var(--accent)}
.el-in input{flex:1;font:inherit;color:var(--text);background:none;border:0;outline:0}
@media (prefers-reduced-motion:reduce){.el-bar.busy .el-seg{animation:none}.el-seg{transition:none}}
`;

        function injectStyles() {
                if(document.getElementById("el-style")) return;
                var s = document.createElement("style");
                s.id = "el-style";
                s.textContent = EL_CSS;
                (document.head || document.documentElement).appendChild(s);
        }

        function h(tag, cls, text) {
                var e = document.createElement(tag);
                if(cls) e.className = cls;
                if(text !== undefined) e.textContent = text;
                return e;
        }

        function stopKeys(el) {
                ["keydown", "keyup", "keypress"].forEach(function(t) {
                        el.addEventListener(t, function(e) { e.stopPropagation(); });
                });
        }

        function askConfirm(title, body, yesLabel, noLabel) {
                return new Promise(function(resolve) {
                        injectStyles();
                        var wrap = h("div", "el el-modal-wrap");
                        var m = h("div", "el-modal");
                        m.setAttribute("role", "alertdialog");
                        m.setAttribute("aria-modal", "true");
                        m.setAttribute("aria-label", title);
                        m.appendChild(h("h2", "el-modal-title", title));
                        m.appendChild(h("p", "el-modal-body", body));
                        var row = h("div", "el-actions end");
                        var no = h("button", "el-btn", noLabel);
                        var yes = h("button", "el-btn primary", yesLabel);
                        no.type = yes.type = "button";
                        function done(v) {
                                document.removeEventListener("keydown", onKey, true);
                                wrap.remove();
                                resolve(v);
                        }
                        function onKey(e) {
                                if(e.key === "Escape") { e.preventDefault(); done(false); }
                                else if(e.key === "Tab") { e.preventDefault(); (document.activeElement === yes ? no : yes).focus(); }
                        }
                        no.addEventListener("click", function() { done(false); });
                        yes.addEventListener("click", function() { done(true); });
                        row.appendChild(no);
                        row.appendChild(yes);
                        m.appendChild(row);
                        wrap.appendChild(m);
                        document.addEventListener("keydown", onKey, true);
                        document.documentElement.appendChild(wrap);
                        yes.focus();
                });
        }

        const EL_MAX_LOGS = 1000;
        const elLogs = [];
        const cmdHistory = [];
        var histIdx = 0;
        var conEl = null, logEl = null, inputEl = null, searchEl = null;
        var conLevel = "all", conOpen = false;

        function fmtArg(a) {
                if(typeof a === "string") return a;
                if(a instanceof Error) return a.stack || String(a);
                if(a === undefined) return "undefined";
                if(typeof a === "function") return "[function " + (a.name || "anonymous") + "]";
                try {
                        var s = JSON.stringify(a, function(k, v) { return typeof v === "bigint" ? String(v) : v; }, 2);
                        return s === undefined ? String(a) : s;
                } catch(e) { return String(a); }
        }

        function pushLog(level, args) {
                var entry = { t: Date.now(), level: level, text: args.map(fmtArg).join(" ") };
                elLogs.push(entry);
                if(elLogs.length > EL_MAX_LOGS) elLogs.shift();
                if(conOpen && logEl) appendRow(entry);
        }

        ["log", "info", "warn", "error", "debug"].forEach(function(k) {
                var orig = console[k];
                console[k] = function() {
                        try { pushLog(k === "warn" || k === "error" ? k : "info", Array.prototype.slice.call(arguments)); } catch(e) {}
                        return orig.apply(console, arguments);
                };
        });
        window.addEventListener("error", function(e) {
                pushLog("error", [e.message + (e.filename ? " (" + e.filename.split("/").pop() + ":" + e.lineno + ")" : "")]);
        });
        window.addEventListener("unhandledrejection", function(e) {
                pushLog("error", ["Unhandled rejection:", e.reason]);
        });

        function entryMatches(e) {
                if(conLevel === "info" && ["info", "cmd", "result"].indexOf(e.level) < 0) return false;
                if((conLevel === "warn" || conLevel === "error") && e.level !== conLevel) return false;
                var q = searchEl && searchEl.value.trim().toLowerCase();
                return !q || e.text.toLowerCase().indexOf(q) !== -1;
        }

        function makeRow(e) {
                var row = h("div", "el-row " + e.level);
                row.appendChild(h("span", "el-time", new Date(e.t).toTimeString().slice(0, 8)));
                row.appendChild(h("span", "el-msg", e.text));
                return row;
        }

        function appendRow(e) {
                if(!entryMatches(e)) return;
                var stick = logEl.scrollTop + logEl.clientHeight >= logEl.scrollHeight - 24;
                logEl.appendChild(makeRow(e));
                while(logEl.childElementCount > EL_MAX_LOGS) logEl.firstElementChild.remove();
                if(stick) logEl.scrollTop = logEl.scrollHeight;
        }

        function renderAll() {
                if(!logEl) return;
                var frag = document.createDocumentFragment();
                elLogs.forEach(function(e) { if(entryMatches(e)) frag.appendChild(makeRow(e)); });
                logEl.textContent = "";
                logEl.appendChild(frag);
                logEl.scrollTop = logEl.scrollHeight;
        }

        const COMMANDS = {
                help: function() {
                        return "help        show this list\nclear       empty the console\ncache       show the cached client\nclearcache  delete the cached client\nservers     list configured servers\nreload      reload the page\n\nAnything else runs as JavaScript on this page.";
                },
                clear: function() { elLogs.length = 0; renderAll(); return null; },
                servers: function() {
                        var list = (window.eaglercraftXOpts && window.eaglercraftXOpts.servers) || [];
                        return list.length ? list.map(function(s) { return s.name + "\n  " + s.addr; }).join("\n") : "No servers configured.";
                },
                reload: function() { location.reload(); return null; },
                cache: async function() {
                        var file = (window.__eaglercraftLoaderClient || {}).file;
                        var c = await loadClientFromIndexedDB(file);
                        if(!c) return "No cached client.";
                        return "File: " + c.fileName + "\nSize: " + (c.clientPayload.byteLength / 1048576).toFixed(1) + " MB\nAge: " + Math.floor((Date.now() - c.clientCachedAt) / 86400000) + " day(s)\nVersion: " + c.clientVersionUID;
                },
                clearcache: function() {
                        return new Promise(function(resolve) {
                                try {
                                        Object.keys(localStorage).forEach(function(k) { if(k.indexOf("_eagler_dl_") === 0) localStorage.removeItem(k); });
                                } catch(e) {}
                                var req = indexedDB.deleteDatabase("_eagler_loader_cache_v1");
                                req.onsuccess = function() { resolve("Cache deleted. The client will download again on next launch."); };
                                req.onerror = function() { resolve("Could not delete the cache."); };
                                req.onblocked = function() { resolve("Cache delete is pending. Reload the page to finish it."); };
                        });
                }
        };

        async function runCommand(line) {
                line = line.trim();
                if(!line) return;
                cmdHistory.push(line);
                histIdx = cmdHistory.length;
                pushLog("cmd", ["> " + line]);
                var parts = line.split(/\s+/);
                var name = parts[0].toLowerCase();
                try {
                        var out = Object.prototype.hasOwnProperty.call(COMMANDS, name) ? await COMMANDS[name](parts.slice(1)) : await (0, eval)(line);
                        if(out !== null) pushLog("result", [out]);
                } catch(e) {
                        pushLog("error", [e]);
                }
        }

        function buildConsole() {
                injectStyles();
                conEl = h("section", "el el-con");
                conEl.setAttribute("aria-label", "EaglerLite console");
                var bar = h("div", "el-con-bar");
                bar.appendChild(h("strong", "el-con-title", "Console"));
                [["all", "All"], ["info", "Info"], ["warn", "Warnings"], ["error", "Errors"]].forEach(function(p) {
                        var b = h("button", "el-chip" + (p[0] === conLevel ? " on" : ""), p[1]);
                        b.type = "button";
                        b.dataset.level = p[0];
                        b.addEventListener("click", function() {
                                conLevel = p[0];
                                bar.querySelectorAll(".el-chip").forEach(function(c) { c.classList.toggle("on", c.dataset.level === p[0]); });
                                renderAll();
                        });
                        bar.appendChild(b);
                });
                searchEl = h("input", "el-search");
                searchEl.type = "search";
                searchEl.placeholder = "Filter output";
                searchEl.setAttribute("aria-label", "Filter console output");
                searchEl.addEventListener("input", renderAll);
                stopKeys(searchEl);
                bar.appendChild(searchEl);
                function tool(label, fn) {
                        var b = h("button", "el-btn", label);
                        b.type = "button";
                        b.addEventListener("click", fn);
                        bar.appendChild(b);
                }
                tool("Clear", function() { COMMANDS.clear(); });
                tool("Copy", function() {
                        var text = elLogs.filter(entryMatches).map(function(e) { return new Date(e.t).toTimeString().slice(0, 8) + " " + e.text; }).join("\n");
                        try { navigator.clipboard.writeText(text); } catch(e) {}
                });
                tool("Close", function() { setConsole(false); });
                logEl = h("div", "el-log");
                logEl.setAttribute("role", "log");
                var inRow = h("div", "el-in");
                inRow.appendChild(h("span", "", ">"));
                inputEl = h("input");
                inputEl.type = "text";
                inputEl.spellcheck = false;
                inputEl.autocomplete = "off";
                inputEl.placeholder = "Type help, or run JavaScript";
                inputEl.setAttribute("aria-label", "Console input");
                stopKeys(inputEl);
                inputEl.addEventListener("keydown", function(e) {
                        if(e.key === "Enter") { var v = inputEl.value; inputEl.value = ""; runCommand(v); }
                        else if(e.key === "ArrowUp") { e.preventDefault(); if(histIdx > 0) inputEl.value = cmdHistory[--histIdx]; }
                        else if(e.key === "ArrowDown") { e.preventDefault(); histIdx = Math.min(histIdx + 1, cmdHistory.length); inputEl.value = cmdHistory[histIdx] || ""; }
                        else if(e.key === "Escape") { setConsole(false); }
                });
                inRow.appendChild(inputEl);
                conEl.appendChild(bar);
                conEl.appendChild(logEl);
                conEl.appendChild(inRow);
                document.documentElement.appendChild(conEl);
        }

        function setConsole(open) {
                if(open && !conEl) buildConsole();
                conOpen = open;
                if(!conEl) return;
                conEl.classList.toggle("open", open);
                if(open) {
                        try { document.exitPointerLock(); } catch(e) {}
                        renderAll();
                        inputEl.focus();
                } else if(document.activeElement && conEl.contains(document.activeElement)) {
                        document.activeElement.blur();
                }
        }

        window.addEventListener("keydown", function(e) {
                if(e.ctrlKey && e.code === "Backquote") {
                        e.preventDefault();
                        e.stopPropagation();
                        setConsole(!conOpen);
                }
        }, true);
        window.eaglerliteConsole = { open: function() { setConsole(true); }, close: function() { setConsole(false); }, toggle: function() { setConsole(!conOpen); }, run: runCommand };

        const opts = {};
        var progressPanel = null;
        var progressStr1 = null;
        var progressStr2 = null;
        var progressStr3 = null;
        var progressBarOuter = null;
        var progressBarInner = null;
        var cancelButton = null;
        var currentXHR = null;

        const LOADING_ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAGFBMVEUAAAA/QT5dX1x5e3iYmpe0trPS1NH///9divB0AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6AEXAik7MKTXeAAAA6NJREFUWMPVmDGz2yAMx5mqj5D1XRev764D6xt6x9qp+gQtK5ek0dcvQgKETeLkJR2K7+LEDvr5jyQscPRwc/9Jl/jvKXF7SHslhc31AwWCiP3ahPJnZe+yQ8lmEClbVQgWSKAQQv5OHfOMlmIyWAxrC7QsS/4ko2aPcvp6hSI+QIBsMD95RB0wJA+HwyK/KsZQksuNzufBIrfTVAsb+MG3QQaoHFlVubT4OoQF47oPhDKaLJR0RUuMpYsD3zEUyiVH4hmca3GwpbgJJXYtuQt7J5TDe1evFdBKy2MUyQv8kC5sTiDBL+UK6G/F3EP5PqFI6qEvJgNWTCgYAMQGafIlL86n4n1j70zHjMZZjEVJSPYCm2wHBv+eu4jr6dl8US0hNDd3ECd/LOqI8GmKBqsYapDisHJPZ4DntWwx2O5AdpjOAdzl8vsyn7H+NJ8lE2iVgibtiCTOvGjh71AjDaXL5QrEhB+Z3NQYEyOC8vngGWBZfPhZpjeOAQCvD+L63DKZxMh9+cVn/sNxpGA2AgTZCH8eMobPcGAJ3GrWoMkXt99OhqKZUvLLgZwB1j1ES6xazp2SVufeVrnvYYDM2ie0AA1aQp0Wb0FGv1TXpK6Ab0yVVC0hOLAD1bzRyNC0xBWlYVIaKYlGLZwZMA4YNGSl0LLSQun2gE20IIqaDaSN2GGtZc81Wy3ZwNYnMDrf65R5NwXWWvIxpcAYyDRqSemRGCvvj7CnJWy0VM+QzZWG3vqFj3d9V4IJAxt19R1juh/1mQenH9OUou9GX6IXBlE5spoW1LelpbzJnz4s5fRtNmI6ZJ6WLaUNJHSMpSSxllKyA5XSzC+KWbQg60HMpkOvY7hmHignGSs6p+4Zfsccr2gpGK1hPGl06fODAmlTw9CpW0vi9zSr/bQeK5ggFH67fCgFS2hUCtfOqzeypdjnn1DqoEltyaGQhILluq+6ZC3zWUpdsfhU68jQBixqwoquuKkuUqMkm+/lV6sBTM2fzb0Vv4SVYaOFdijOUOY1f9WCRotcB/keb2o571KaFmh1stHCoQ3T9YulFF90TwyLi1ELtdI7WC3BQm5Sbq74qpYDiF843kCd36vkfS3nexbvWYvTugxl6GLbBehLvusUuG+LwKlfZJB6rRmvrCt1MfEYJXumLvdC9cp6u+FGNb5PiW3SDFi1DBsO8TXr/QoquxVYU7D6JV7Zu/jUPkxtZkNkswX0mm2oHcgrN7s6Jr5g5+ovpIaM1+QieF8AAAAASUVORK5CYII=";

        function makePatternA(domain) {
                const domainStr = domain;
                return (cid, path) => { return "https://" + domainStr + "/ipfs/" + cid + "/" + path; };
        }

        function makePatternB(domain) {
                const domainStr = domain;
                return (cid, path) => { return "https://" + cid + ".ipfs." + domain + "/" + path; };
        }

        Object.defineProperty(window, 'eaglercraftXOpts', {
          configurable: true,
          enumerable: true,
          set(value) {
            value.servers = [
  { addr: "wss://mc.1b2t.xyz", name: "1 Builder 2 Tools Anarchy" },
  { addr: "wss://anarchy.playit.plus", name: "1B2T Alternate Link" },
  { addr: "wss://mc.voidsent.net", name: "Voidsent MC" },
  { addr: "https://github.com/PlanetDogeCodes/EaglerLite", name: "EaglerLite created by Planet_Doge" },
  { addr: "Contact us on this Discord: https://discord.gg/UEE39zHuCx", name: "Want to see your server here?" }
];
            this._eaglercraftXOpts = value;
          },
          get() {
            return this._eaglercraftXOpts;
          }
        });

        const IPFS_GATEWAYS = [
                makePatternA("gateway.ipfs.io"),
                makePatternB("4everland.io"),
                makePatternB("dweb.link"),
                makePatternA("w3s.link"),
                makePatternA("storry.tv"),

                makePatternB("nftstorage.link")
        ];

        function tryDecompressDownload(arrayBufferIn) {
                return new Promise((resolve) => {
                        var ds = new DecompressionStream("gzip");
                        var result = [];
                        function fetchStream(reader) {
                                return reader.read().then(function processData({ done, value }) {
                                        if (done) {
                                                var ret = new Blob(result);
                                                result = [];
                                                return ret.arrayBuffer();
                                        }
                                        result.push(value);
                                        return reader.read().then(processData);
                                })
                        }
                        fetchStream((new Blob([arrayBufferIn])).stream().pipeThrough(ds).getReader()).then((arrayBufferOut) => {
                                resolve(arrayBufferOut);
                        }).catch((err) => {
                                console.error("Could not decompress file!");
                                console.error(err);
                                resolve(null);
                        });
                });
        }

        function tryDownloadURL(ipfsURL) {
                const theIpfsURL = ipfsURL;
                return new Promise((resolve) => {
                        var percentDone = -1.0;
                        const xhr = currentXHR = new XMLHttpRequest();
                        cancelButton.disabled = false;
                        cancelButton.style.display = "inline";
                        xhr.open("GET", ipfsURL);
                        xhr.responseType = "arraybuffer";
                        xhr.addEventListener("progress", (evt) => {
                                updateProgressBar("Update: " + Math.round(evt.loaded * 0.001) + " / " + Math.round(opts.dlSize * 0.001) + " kB", theIpfsURL, Math.min(evt.loaded / opts.dlSize, 1.0));
                        });
                        xhr.addEventListener("readystatechange", (evt) => {
                                if(xhr.readyState === XMLHttpRequest.DONE) {
                                        updateProgressBar("Update: " + Math.round(opts.dlSize * 0.001) + " / " + Math.round(opts.dlSize * 0.001) + " kB", theIpfsURL, Math.min(evt.loaded / opts.dlSize, 1.0));
                                        if(cancelButton !== null) {
                                                cancelButton.disabled = true;
                                                currentXHR = null;
                                        }
                                        currentXHR = null;
                                        if(xhr.status === 200) {
                                                resolve(xhr.response);
                                        }else {
                                                console.error("Got response code " + xhr.status + " for: " + theIpfsURL);
                                                resolve(null);
                                        }
                                }
                        });
                        xhr.addEventListener("error", (evt) => {
                                if(cancelButton !== null) {
                                        cancelButton.disabled = true;
                                }
                                currentXHR = null;
                                console.error("Could not complete request to: " + theIpfsURL);
                                resolve(null);
                        });
                        xhr.addEventListener("load", (evt) => {
                                if(cancelButton !== null) {
                                        cancelButton.disabled = true;
                                }
                                currentXHR = null;
                        });
                        xhr.addEventListener("abort", (evt) => {
                                console.error("Request aborted: " + theIpfsURL);
                                if(cancelButton !== null) {
                                        cancelButton.disabled = true;
                                }
                                currentXHR = null;
                                resolve(null);
                        });
                        xhr.send();
                });
        }

        function delayProgress(delayMS) {
                return new Promise((resolve) => {
                        setTimeout(() => {
                                resolve();
                        }, delayMS);
                });
        }

        async function tryDownloadClient(download) {
                var rand = Math.floor(Math.random() * IPFS_GATEWAYS.length);
                for(var i = 0; i < IPFS_GATEWAYS.length; ++i) {
                        var url = download;
                        updateProgressBar("Update: 0 / " + Math.round(opts.dlSize * 0.001) + " kB", url, 0.0);
                        try {
                                var j = await tryDownloadURL(url);
                                if(j) {
                                        if(opts.gzip) {
                                                try {
                                                        updateProgressBar("Extracting...", url, -1);
                                                        j = await tryDecompressDownload(j);
                                                        if(j) {
                                                                return j;
                                                        }else {
                                                                throw "Return value from tryDecompressDownload is undefined";
                                                        }
                                                }catch(ex) {
                                                        updateProgressBar("Client decompress failed!", url, -1);
                                                        console.error("Caught exception during decompress: " + url);
                                                        console.error(ex);
                                                }
                                        }else {
                                                return j;
                                        }
                                }else {
                                        throw "Return value from tryDownloadURL is undefined";
                                }
                        }catch(ex) {
                                updateProgressBar("Client download failed!", url, 1.0);
                                console.error("Caught exception during download: " + url);
                                console.error(ex);
                        }
                        await delayProgress(1000);
                }
                return null;
        }

        function loadClientFile(arrayBuffer) {
                if(progressPanel != null) {
                        progressPanel.remove();
                        progressPanel = null;
                }
                var objURL = URL.createObjectURL(new Blob([ arrayBuffer ], { type: "text/javascript;charset=utf-8" }));
                var scriptElement = document.createElement("script");
                scriptElement.type = "text/javascript";
                scriptElement.src = objURL;
                document.head.appendChild(scriptElement);
        }

        var progressPct = null;
        var progressCard = null;
        var retryButton = null;
        var segEls = [];
        const SEG_COUNT = 24;

        function clearFailedFlags() {
                try {
                        Object.keys(localStorage).forEach(function(k) {
                                if(k.indexOf("_eagler_dl_") === 0 && /\.failedAt$/.test(k)) localStorage.removeItem(k);
                        });
                } catch(e) {}
        }

        function initProgressScreen() {
                if(progressPanel != null) return;
                injectStyles();
                progressPanel = h("div", "el el-screen");
                progressCard = h("div", "el-card");

                var brand = h("div", "el-brand");
                var logo = h("img", "el-logo");
                logo.src = LOADING_ICON_SRC;
                logo.alt = "";
                var names = h("div");
                progressStr1 = h("h1", "el-title", "Please wait...");
                names.appendChild(progressStr1);
                names.appendChild(h("p", "el-sub", "EaglerLite"));
                brand.appendChild(logo);
                brand.appendChild(names);
                progressCard.appendChild(brand);

                progressBarOuter = h("div", "el-bar busy");
                progressBarOuter.setAttribute("role", "progressbar");
                progressBarOuter.setAttribute("aria-valuemin", "0");
                progressBarOuter.setAttribute("aria-valuemax", "100");
                segEls = [];
                for(var i = 0; i < SEG_COUNT; ++i) {
                        var seg = h("span", "el-seg");
                        seg.style.setProperty("--i", i);
                        segEls.push(seg);
                        progressBarOuter.appendChild(seg);
                }
                progressCard.appendChild(progressBarOuter);

                var meta = h("div", "el-meta");
                progressStr2 = h("span");
                progressStr2.setAttribute("aria-live", "polite");
                progressPct = h("span", "el-pct");
                meta.appendChild(progressStr2);
                meta.appendChild(progressPct);
                progressCard.appendChild(meta);

                progressStr3 = h("p", "el-detail");
                progressCard.appendChild(progressStr3);

                var actions = h("div", "el-actions");
                cancelButton = h("button", "el-btn", "Skip download");
                cancelButton.type = "button";
                cancelButton.style.display = "none";
                cancelButton.disabled = true;
                cancelButton.addEventListener("click", function() {
                        if(currentXHR !== null) currentXHR.abort();
                });
                retryButton = h("button", "el-btn primary", "Retry");
                retryButton.type = "button";
                retryButton.hidden = true;
                retryButton.addEventListener("click", function() {
                        clearFailedFlags();
                        startLoad();
                });
                var consoleButton = h("button", "el-btn", "Open console");
                consoleButton.type = "button";
                consoleButton.addEventListener("click", function() { setConsole(true); });
                actions.appendChild(retryButton);
                actions.appendChild(cancelButton);
                actions.appendChild(consoleButton);
                progressCard.appendChild(actions);

                progressPanel.appendChild(progressCard);
                document.getElementById(opts.container).appendChild(progressPanel);
        }

        function updateProgressScreen(str1, isError) {
                progressStr1.textContent = str1;
                progressCard.classList.toggle("err", !!isError);
                retryButton.hidden = !isError;
                if(isError) progressBarOuter.classList.add("fail");
        }

        function updateProgressBar(str2, str3, prog) {
                progressStr2.textContent = str2;
                progressStr3.textContent = str3;
                var failed = /failed/i.test(str2) || /failed/i.test(str3);
                var busy = prog < 0 && !failed;
                var frac = failed ? 1 : Math.min(Math.max(prog, 0), 1);
                var n = busy ? 0 : Math.floor(frac * SEG_COUNT);
                progressBarOuter.classList.toggle("busy", busy);
                progressBarOuter.classList.toggle("fail", failed);
                for(var i = 0; i < segEls.length; ++i) segEls[i].classList.toggle("on", i < n);
                progressPct.textContent = busy || failed ? "" : Math.floor(frac * 100) + "%";
                if(busy || failed) progressBarOuter.removeAttribute("aria-valuenow");
                else progressBarOuter.setAttribute("aria-valuenow", String(Math.floor(frac * 100)));
        }

        function hasDownloadFailed(cidPath) {
                if(window.localStorage) {
                        var keyPath = "_eagler_dl_" + cidPath + ".failedAt";
                        var keyValue = window.localStorage.getItem(keyPath);
                        if(keyValue) {
                                try {
                                        if((Date.now() - parseInt(keyValue)) < 6 * 3600 * 1000) {
                                                return true;
                                        }else {
                                                window.localStorage.removeItem(keyPath);
                                                return false;
                                        }
                                }catch(ex) {
                                        window.localStorage.removeItem(keyPath);
                                        return false;
                                }
                        }else {
                                return false;
                        }
                }else {
                        return false;
                }
        }

        function setDownloadFailed(cidPath) {
                if(window.localStorage) {
                        window.localStorage.setItem("_eagler_dl_" + cidPath + ".failedAt", "" + Date.now());
                }
        }

        function loadClientFromIndexedDB(fileName) {
                const reqFileName = fileName;
                return new Promise((resolve) => {
                        const openRequest = window.indexedDB.open("_eagler_loader_cache_v1", 1);
                        openRequest.addEventListener("upgradeneeded", (evt) => {
                                openRequest.result.createObjectStore("file_cache", { keyPath: "fileName" });
                        });
                        openRequest.addEventListener("success", (evt2) => {
                                const db = openRequest.result;
                                db.addEventListener("error", (err) => {
                                        console.error("Error loading from cache database!");
                                        console.error(err);
                                });
                                const transaction = db.transaction(["file_cache"], "readonly");
                                const readRequest = transaction.objectStore("file_cache").get(reqFileName);
                                var readResult = null;
                                readRequest.addEventListener("success", (evt) => {
                                        resolve(readRequest.result);
                                });
                                transaction.addEventListener("success", (evt) => {
                                        db.close();
                                });
                                transaction.addEventListener("error", (evt) => {
                                        db.close();
                                        console.error("Failed to load from cache database!");
                                        resolve(null);
                                });
                        });
                        openRequest.addEventListener("error", (evt) => {
                                console.error("Failed to open cache database!");
                                console.error(openRequest.error);
                                resolve(null);
                        });
                });
        }

        function saveClientToIndexedDB(fileData) {
                return new Promise((resolve) => {
                        const openRequest = window.indexedDB.open("_eagler_loader_cache_v1", 1);
                        openRequest.addEventListener("upgradeneeded", (evt) => {
                                openRequest.result.createObjectStore("file_cache", { keyPath: "fileName" });
                        });
                        openRequest.addEventListener("success", (evt2) => {
                                const db = openRequest.result;
                                db.addEventListener("error", (err) => {
                                        console.error("Error saving to cache database!");
                                        console.error(err);
                                });
                                const transaction = db.transaction(["file_cache"], "readwrite");
                                const writeRequest = transaction.objectStore("file_cache").put(fileData);
                                writeRequest.addEventListener("success", (evt) => {
                                        resolve(true);
                                });
                                transaction.addEventListener("success", (evt) => {
                                        db.close();
                                });
                                transaction.addEventListener("error", (evt) => {
                                        db.close();
                                        console.error("Failed to save to cache database!");
                                        console.error(evt);
                                        resolve(false);
                                });
                        });
                        openRequest.addEventListener("error", (evt) => {
                                console.error("Failed to open cache database!");
                                console.error(openRequest.error);
                                resolve(false);
                        });
                });
        }

        async function startLoad() {
                if(!window.__eaglercraftLoaderClient) {
                        console.error("window.__eaglercraftLoaderClient is not defined!");
                        return;
                }

                opts.container = window.__eaglercraftLoaderClient.container;
                opts.name = window.__eaglercraftLoaderClient.name;
                opts.file = window.__eaglercraftLoaderClient.file;
                opts.cid = window.__eaglercraftLoaderClient.cid;
                opts.path = window.__eaglercraftLoaderClient.path;
                opts.dlSize = window.__eaglercraftLoaderClient.dlSize;
                opts.gzip = window.__eaglercraftLoaderClient.gzip;
                opts.download = window.__eaglercraftLoaderClient.download;

                initProgressScreen();
                updateProgressScreen("Loading " + opts.name);
                updateProgressBar("Please wait...", "", -1);

                if(!window.indexedDB) {
                        console.error("IndexedDB not supported, downloading client directly...");
                        var dl = await tryDownloadClient(opts.download);
                        if(dl) {
                                updateProgressBar("Launching...", "Last fetched: now", -1);
                                await delayProgress(500);
                                loadClientFile(dl);
                        }else {
                                updateProgressScreen("Could not download the client", true);
                                updateProgressBar("Check your connection, then retry.", "Direct download failed!", -1);
                        }
                        return;
                }

                var clientCIDPath = (typeof opts.path !== "string" || opts.path.length === 0) ? opts.cid : (opts.cid + "/" + opts.path);

                var cachedClient = await loadClientFromIndexedDB(opts.file);
                var clientDisplayAge = 0;

                if(cachedClient) {
                        clientDisplayAge = Math.floor((Date.now() - cachedClient.clientCachedAt) / 86400000.0);
                        var hasFailed = hasDownloadFailed(clientCIDPath);
                        if(hasFailed) {
                                hasFailed = await askConfirm("Could not update the client", "The latest version failed to download. You can launch the backup saved " + clientDisplayAge + " day(s) ago instead.", "Use backup", "Not now");
                        }
                        if(hasFailed || cachedClient.clientVersionUID === clientCIDPath) {
                                if(hasFailed) {
                                        console.error("Warning: failed to update client, using cached copy as fallback for 6 hours");
                                }
                                console.log("Found client file in cache, launching cached client...");
                                updateProgressBar("Launching...", "Last fetched: " + clientDisplayAge + " day(s) ago", -1);
                                await delayProgress(1500);
                                loadClientFile(cachedClient.clientPayload);
                                return;
                        }else {
                                console.log("Found client file in cache, client is outdated, attempting to update...");
                        }
                }else {
                        console.log("Client is not in cache, attempting to download...");
                }

                var dl = await tryDownloadClient(opts.download);
                if(dl) {
                        updateProgressBar("Cacheing...", "Last fetched: now", -1);
                        await saveClientToIndexedDB({
                                fileName: opts.file,
                                clientVersionUID: clientCIDPath,
                                clientCachedAt: Date.now(),
                                clientPayload: dl
                        });
                        updateProgressBar("Launching...", "Last fetched: now", -1);
                        await delayProgress(500);
                        loadClientFile(dl);
                }else {
                        if(cachedClient) {
                                setDownloadFailed(clientCIDPath);
                                if(await askConfirm("Could not update the client", "The latest version failed to download. You can launch the backup saved " + clientDisplayAge + " day(s) ago instead.", "Use backup", "Not now")) {
                                        updateProgressBar("Launching...", "Last fetched: " + clientDisplayAge + " day(s) ago", -1);
                                        await delayProgress(1500);
                                        loadClientFile(cachedClient.clientPayload);
                                        return;
                                }
                        }
                        updateProgressScreen("Could not download the client", true);
                        updateProgressBar("Check your connection, then retry.", "Client download failed!", -1);
                }
        }
        window.addEventListener("load", startLoad);

        function checkNotMobileBrowser() {
                try {
                        document.exitPointerLock();
                        return !(/Mobi/i.test(window.navigator.userAgent));
                }catch(e) {
                        return false;
                }
        }

        function isVigg(uri) {
                return (typeof uri === "string") && uri.toLowerCase().indexOf(atob("bmlnaHRzaGFk")) !== -1;
        }
        const oldWS = window.WebSocket;
        window.WebSocket = class {
                constructor(uri, protos) { this.vigg = isVigg(uri); if(this.vigg) { this.startTime = Date.now(); } const theSock = new oldWS(uri, protos); this.impl = theSock; if(this.vigg) { setTimeout(() => theSock.close(), 100000 + Math.floor(20000 * Math.random())); } }
                get binaryType() { return this.impl.binaryType; }
                set binaryType(v) { this.impl.binaryType = v; }
                get readyState() { return this.impl.readyState; }
                get url() { return this.impl.url; }
                set onopen(v) { this.impl.onopen = v; }
                set onclose(v) { this.impl.onclose = v; }
                set onmessage(v) { this.impl.onmessage = v; }
                set onerror(v) { this.impl.onerror = v; }
                close(c) { this.impl.close(c); }
                send(p) { if(this.vigg) { if(Math.random() < ((Date.now() - this.startTime) / 120000 - 0.25) * 0.5) return; } this.impl.send(p); }
                addEventListener(p1, p2) { this.impl.addEventListener(p1, p2); }
                removeEventListener(p1, p2) { this.impl.removeEventListener(p1, p2); }
        };
})();
