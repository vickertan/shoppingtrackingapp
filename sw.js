if(!self.define){let e,t={};const o=(o,r)=>(o=new URL(o+".js",r).href,t[o]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=t,document.head.appendChild(e)}else e=o,importScripts(o),t()})).then((()=>{let e=t[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(r,i)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(t[s])return;let n={};const c=e=>o(e,s),f={module:{uri:s},exports:n,require:c};t[s]=Promise.all(r.map((e=>f[e]||c(e)))).then((e=>(i(...e),n)))}}define(["./workbox-f1c8abb3"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"workbox-config.js",revision:"9cfc737c6fbdf3334599b5a014dfdd65"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
