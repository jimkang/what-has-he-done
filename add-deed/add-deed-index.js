!function e(t,n,r){function o(a,u){if(!n[a]){if(!t[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[a]={exports:{}};t[a][0].call(l.exports,function(e){var n=t[a][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,t,n){"use strict";function r(){var e=s.parse(window.location.search.slice(1));c({routeDict:e,store:window.localStorage,currentDate:new Date},o)}function o(e,t){e?"No token or code found."===e.message?i():f(e):(a=t,u=p({gitRepoOwner:"jimkang",gitToken:a,request:h,encodeInBase64:y.encodeInBase64,decodeFromBase64:y.decodeFromBase64,jsyaml:jsyaml}).submitDeed,d({onClick:u}))}function i(){var e=l.github.clientId;"localhost"===window.location.hostname&&(e=l.githubTest.clientId);var t="https://github.com/login/oauth/authorize?client_id="+l.github.clientId+"&scope=public_repo";window.location.href=t}var a,u,s=e("qs"),c=e("./find-token"),l=e("./config"),f=e("handle-error-web"),d=e("./representers/wire-add-button"),p=e("./deed-submitter"),h=e("basic-browser-request"),y=e("./safe-encoders");!function(){r()}()},{"./config":2,"./deed-submitter":3,"./find-token":4,"./representers/wire-add-button":20,"./safe-encoders":21,"basic-browser-request":6,"handle-error-web":9,qs:15}],2:[function(e,t,n){"use strict";t.exports={github:{clientId:"bd912c1fa754b92e5f9f",clientSecret:"b69d60c1532dcc25ad1c284a30e2ed29e2ed1c7b",token:"a824eeb4444cdbc2e1570c9d71b1c8799f652fa2"},githubTest:{clientId:"746688793d1314bf7974",clientSecret:"c63362fe68274c6ca14b8c4fe42a3db24180147a"}}},{}],3:[function(e,t,n){"use strict";function r(e){function t(e){var t={url:k+"/"+d+"?access_token="+w,method:"GET"};m&&(t.url+="&ref="+m),y&&(t.headers={"User-Agent":"add-deed"}),A(t,u(r,e))}function n(e,n){function r(e,t){N=e,l(t)}function a(e,t){N.deeds.push(e),l(t)}function h(e){N.deeds.forEach(i);var t=j(S.safeDump(N.deeds)),n={url:k+"/"+d+"?access_token="+w,json:!0,method:"PUT",body:{message:N.comment?N.comment:"Update from add-deed app.",content:t,branch:T,sha:N.sha}};y&&(n.headers={"User-Agent":"add-deed"}),A(n,u(o,e))}function v(e){var t={url:p+"/repos/"+b+"/"+x+"/git/refs/heads/"+m+"?access_token="+w,method:"GET",json:!0};y&&(t.headers={"User-Agent":"add-deed"}),A(t,u(_,e))}function g(e,t){var n={url:p+"/repos/"+b+"/"+x+"/git/refs",json:!0,method:"POST",headers:{Authorization:"token "+w,"Content-Type":"application/json"},body:{ref:"refs/heads/"+T,sha:e}};y&&(n.headers["User-Agent"]="add-deed"),A(n,u(O,t))}function _(e,t,n){200===e.statusCode?n(null,t.object.sha):n(new Error("Could not get "+T+" branch: "+e.statusCode+", "+JSON.stringify(t)))}function O(e,t,n){201===e.statusCode?n():n(new Error("Could not create "+T+" branch: "+e.statusCode+", "+JSON.stringify(t)))}function E(e){var t={url:p+"/repos/"+b+"/"+x+"/pulls?access_token="+w,json:!0,method:"POST",body:{title:"New deed "+T,head:T,base:"gh-pages",body:"New deed submission"}};y&&(t.headers={"User-Agent":"add-deed"}),A(t,u(C,e))}function C(e,t,n){201===e.statusCode?n(null,t.html_url):n(new Error("Could not create pull request for "+T+" branch: "+e.statusCode+", "+JSON.stringify(t)))}var N,T="deed-"+f(8);s([t,r,c(a)(e),v,g,h,E],n)}function r(e,t,n){if(404===e.statusCode)n(null,[]);else if(200===e.statusCode){var r=JSON.parse(t),o={sha:r.sha,deeds:S.safeLoad(O(r.content))};n(null,o)}else n(new Error("Unknown error: "+e.statusCode+", "+JSON.stringify(t)))}var a=e.githubAPIBase,p=void 0===a?"https://api.github.com":a,h=e.shouldSetUserAgent,y=void 0!==h&&h,v=e.sourceBranch,m=void 0===v?"gh-pages":v,g=e.gitRepoOwner,b=void 0===g?"jimkang":g,w=e.gitToken,_=e.repo,x=void 0===_?"what-has-he-done-data":_,A=e.request,j=e.encodeInBase64,O=e.decodeFromBase64,S=e.jsyaml,k=p+"/repos/"+b+"/"+x+"/contents";return{submitDeed:n,getDeeds:t}}function o(e,t,n){201===e.statusCode||200===e.statusCode?n():n(new Error("Failed to update file: "+e.statusCode+", "+JSON.stringify(t)))}function i(e){!e.stamp||"object"!==a(e.stamp)&&"string"!=typeof e.stamp?e.stamp=(new Date).toISOString():"function"==typeof e.stamp.toISOString?e.stamp=e.stamp.toISOString():"function"==typeof e.stamp.toString&&(e.stamp=e.stamp.toString()),e.description||delete e.description}var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=e("standard-bail")(),s=e("async-waterfall"),c=e("lodash.curry"),l=e("call-next-tick"),f=e("idmaker").randomId,d="deeds.yaml";t.exports=r},{"async-waterfall":5,"call-next-tick":7,idmaker:10,"lodash.curry":12,"standard-bail":19}],4:[function(e,t,n){"use strict";function r(e,t){function n(e,n){200===e.statusCode&&n&&(s.tokenInfo=JSON.stringify({token:n,expires:c.getTime()+24*u*60*60*1e3})),s.tokenInfo?t(null,JSON.parse(s.tokenInfo).token):t(new Error("Could not get the token from token exchanger."))}var r=e.routeDict,s=e.store,c=e.currentDate;if("code"in r){var l={method:"GET",url:"http://162.243.21.88:5876/exchange?code="+r.code};o(l,i(n,t))}else if(s.tokenInfo){var f=JSON.parse(s.tokenInfo);f.expires>c.getTime()?a(t,null,f.token):(delete s.tokenInfo,a(t,new Error("No token or code found.")))}else a(t,new Error("No token or code found."))}var o=e("basic-browser-request"),i=e("standard-bail")(),a=e("call-next-tick"),u=1;t.exports=r},{"basic-browser-request":6,"call-next-tick":7,"standard-bail":19}],5:[function(e,t,n){(function(e){!function(n){"use strict";var r=function(t){"function"==typeof setImmediate?setImmediate(t):"undefined"!=typeof e&&e.nextTick?e.nextTick(t):setTimeout(t,0)},o=function(e){var t=function(n){var r=function(){return e.length&&e[n].apply(null,arguments),r.next()};return r.next=function(){return n<e.length-1?t(n+1):null},r};return t(0)},i=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},a=function(e,t){if(t=t||function(){},!i(e)){var n=new Error("First argument to waterfall must be an array of functions");return t(n)}if(!e.length)return t();var a=function(e){return function(n){if(n)t.apply(null,arguments),t=function(){};else{var o=Array.prototype.slice.call(arguments,1),i=e.next();i?o.push(a(i)):o.push(t),r(function(){e.apply(null,o)})}}};a(o(e))()};"undefined"!=typeof define&&define.amd?define([],function(){return a}):"undefined"!=typeof t&&t.exports?t.exports=a:n.asyncWaterfall=a}(this)}).call(this,e("_process"))},{_process:13}],6:[function(e,t,n){function r(){function e(e,t){function n(){i.abort(),clearTimeout(u),t(new Error("Timed out"))}function r(){3===i.readyState&&(e.onData(this.responseText.substr(s)),s=this.responseText.length)}var o=e.json||"application/json"===e.mimeType,i=new XMLHttpRequest;if(i.open(e.method,e.url),e.mimeType&&i.setRequestHeader("content-type",e.mimeType),o&&i.setRequestHeader("accept","application/json"),"object"==typeof e.headers)for(var a in e.headers)i.setRequestHeader(a,e.headers[a]);e.binary&&(i.responseType="arraybuffer"),o&&"object"==typeof e.body&&(e.body=JSON.stringify(e.body));var u=null;i.onload=function(){if(clearTimeout(u),this.status>=200||this.status<300)if(e.binary)t(null,i.response);else{var n=this.responseText;o&&(n=JSON.parse(n));var r={statusCode:i.status,statusMessage:i.statusText,rawResponse:i.response};t(null,r,n)}else t(new Error("Error while making request. XHR status: "+this.status),i.response)};var s=0;return e.onData&&(i.onreadystatechange=r),i.send(e.formData||e.body),e.timeLimit>0&&(u=setTimeout(n,e.timeLimit)),{url:e.url,cancelRequest:n}}return{makeRequest:e}}if("object"==typeof t&&"object"==typeof t.exports){var o=r();t.exports=o.makeRequest}},{}],7:[function(e,t,n){(function(e){function n(e){var t=Array.prototype.slice.call(arguments,1);return function(){e.apply(e,t)}}function r(){var t=n.apply(null,Array.prototype.slice.call(arguments,0));e.nextTick(t)}Array.prototype.slice.call;t.exports=r}).call(this,e("_process"))},{_process:13}],8:[function(e,t,n){!function(e,r){"object"==typeof n&&"undefined"!=typeof t?r(n):"function"==typeof define&&define.amd?define(["exports"],r):r(e.d3=e.d3||{})}(this,function(e){"use strict";function t(e){return function(){var t=this.ownerDocument,n=this.namespaceURI;return n===Q&&t.documentElement.namespaceURI===Q?t.createElement(e):t.createElementNS(n,e)}}function n(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function r(){return new o}function o(){this._="@"+(++ne).toString(36)}function i(e,t,n){return e=a(e,t,n),function(t){var n=t.relatedTarget;n&&(n===this||8&n.compareDocumentPosition(this))||e.call(this,t)}}function a(t,n,r){return function(o){var i=e.event;e.event=o;try{t.call(this,this.__data__,n,r)}finally{e.event=i}}}function u(e){return e.trim().split(/^|\s+/).map(function(e){var t="",n=e.indexOf(".");return n>=0&&(t=e.slice(n+1),e=e.slice(0,n)),{type:e,name:t}})}function s(e){return function(){var t=this.__on;if(t){for(var n,r=0,o=-1,i=t.length;r<i;++r)n=t[r],e.type&&n.type!==e.type||n.name!==e.name?t[++o]=n:this.removeEventListener(n.type,n.listener,n.capture);++o?t.length=o:delete this.__on}}}function c(e,t,n){var r=ue.hasOwnProperty(e.type)?i:a;return function(o,i,a){var u,s=this.__on,c=r(t,i,a);if(s)for(var l=0,f=s.length;l<f;++l)if((u=s[l]).type===e.type&&u.name===e.name)return this.removeEventListener(u.type,u.listener,u.capture),this.addEventListener(u.type,u.listener=c,u.capture=n),void(u.value=t);this.addEventListener(e.type,c,n),u={type:e.type,name:e.name,value:t,listener:c,capture:n},s?s.push(u):this.__on=[u]}}function l(t,n,r,o){var i=e.event;t.sourceEvent=e.event,e.event=t;try{return n.apply(r,o)}finally{e.event=i}}function f(){}function d(){return[]}function p(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}function h(e,t,n,r,o,i){for(var a,u=0,s=t.length,c=i.length;u<c;++u)(a=t[u])?(a.__data__=i[u],r[u]=a):n[u]=new p(e,i[u]);for(;u<s;++u)(a=t[u])&&(o[u]=a)}function y(e,t,n,r,o,i,a){var u,s,c,l={},f=t.length,d=i.length,h=new Array(f);for(u=0;u<f;++u)(s=t[u])&&(h[u]=c=_e+a.call(s,s.__data__,u,t),c in l?o[u]=s:l[c]=s);for(u=0;u<d;++u)c=_e+a.call(e,i[u],u,i),(s=l[c])?(r[u]=s,s.__data__=i[u],l[c]=null):n[u]=new p(e,i[u]);for(u=0;u<f;++u)(s=t[u])&&l[h[u]]===s&&(o[u]=s)}function v(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function m(e){return function(){this.removeAttribute(e)}}function g(e){return function(){this.removeAttributeNS(e.space,e.local)}}function b(e,t){return function(){this.setAttribute(e,t)}}function w(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function _(e,t){return function(){var n=t.apply(this,arguments);null==n?this.removeAttribute(e):this.setAttribute(e,n)}}function x(e,t){return function(){var n=t.apply(this,arguments);null==n?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,n)}}function A(e){return function(){this.style.removeProperty(e)}}function j(e,t,n){return function(){this.style.setProperty(e,t,n)}}function O(e,t,n){return function(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(e):this.style.setProperty(e,r,n)}}function S(e){return function(){delete this[e]}}function k(e,t){return function(){this[e]=t}}function E(e,t){return function(){var n=t.apply(this,arguments);null==n?delete this[e]:this[e]=n}}function C(e){return e.trim().split(/^|\s+/)}function N(e){return e.classList||new T(e)}function T(e){this._node=e,this._names=C(e.getAttribute("class")||"")}function D(e,t){for(var n=N(e),r=-1,o=t.length;++r<o;)n.add(t[r])}function I(e,t){for(var n=N(e),r=-1,o=t.length;++r<o;)n.remove(t[r])}function L(e){return function(){D(this,e)}}function P(e){return function(){I(this,e)}}function R(e,t){return function(){(t.apply(this,arguments)?D:I)(this,e)}}function q(){this.textContent=""}function B(e){return function(){this.textContent=e}}function F(e){return function(){var t=e.apply(this,arguments);this.textContent=null==t?"":t}}function H(){this.innerHTML=""}function U(e){return function(){this.innerHTML=e}}function M(e){return function(){var t=e.apply(this,arguments);this.innerHTML=null==t?"":t}}function $(){this.nextSibling&&this.parentNode.appendChild(this)}function J(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function z(){return null}function G(){var e=this.parentNode;e&&e.removeChild(this)}function V(e,t,n){var r=Le(e),o=r.CustomEvent;o?o=new o(t,n):(o=r.document.createEvent("Event"),n?(o.initEvent(t,n.bubbles,n.cancelable),o.detail=n.detail):o.initEvent(t,!1,!1)),e.dispatchEvent(o)}function X(e,t){return function(){return V(this,e,t)}}function Y(e,t){return function(){return V(this,e,t.apply(this,arguments))}}function K(e,t){this._groups=e,this._parents=t}function W(){return new K([[document.documentElement]],Ve)}var Q="http://www.w3.org/1999/xhtml",Z={svg:"http://www.w3.org/2000/svg",xhtml:Q,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},ee=function(e){var t=e+="",n=t.indexOf(":");return n>=0&&"xmlns"!==(t=e.slice(0,n))&&(e=e.slice(n+1)),Z.hasOwnProperty(t)?{space:Z[t],local:e}:e},te=function(e){var r=ee(e);return(r.local?n:t)(r)},ne=0;o.prototype=r.prototype={constructor:o,get:function(e){for(var t=this._;!(t in e);)if(!(e=e.parentNode))return;return e[t]},set:function(e,t){return e[this._]=t},remove:function(e){return this._ in e&&delete e[this._]},toString:function(){return this._}};var re=function(e){return function(){return this.matches(e)}};if("undefined"!=typeof document){var oe=document.documentElement;if(!oe.matches){var ie=oe.webkitMatchesSelector||oe.msMatchesSelector||oe.mozMatchesSelector||oe.oMatchesSelector;re=function(e){return function(){return ie.call(this,e)}}}}var ae=re,ue={};if(e.event=null,"undefined"!=typeof document){var se=document.documentElement;"onmouseenter"in se||(ue={mouseenter:"mouseover",mouseleave:"mouseout"})}var ce=function(e,t,n){var r,o,i=u(e+""),a=i.length;{if(!(arguments.length<2)){for(l=t?c:s,null==n&&(n=!1),r=0;r<a;++r)this.each(l(i[r],t,n));return this}var l=this.node().__on;if(l)for(var f,d=0,p=l.length;d<p;++d)for(r=0,f=l[d];r<a;++r)if((o=i[r]).type===f.type&&o.name===f.name)return f.value}},le=function(){for(var t,n=e.event;t=n.sourceEvent;)n=t;return n},fe=function(e,t){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var r=n.createSVGPoint();return r.x=t.clientX,r.y=t.clientY,r=r.matrixTransform(e.getScreenCTM().inverse()),[r.x,r.y]}var o=e.getBoundingClientRect();return[t.clientX-o.left-e.clientLeft,t.clientY-o.top-e.clientTop]},de=function(e){var t=le();return t.changedTouches&&(t=t.changedTouches[0]),fe(e,t)},pe=function(e){return null==e?f:function(){return this.querySelector(e)}},he=function(e){"function"!=typeof e&&(e=pe(e));for(var t=this._groups,n=t.length,r=new Array(n),o=0;o<n;++o)for(var i,a,u=t[o],s=u.length,c=r[o]=new Array(s),l=0;l<s;++l)(i=u[l])&&(a=e.call(i,i.__data__,l,u))&&("__data__"in i&&(a.__data__=i.__data__),c[l]=a);return new K(r,this._parents)},ye=function(e){return null==e?d:function(){return this.querySelectorAll(e)}},ve=function(e){"function"!=typeof e&&(e=ye(e));for(var t=this._groups,n=t.length,r=[],o=[],i=0;i<n;++i)for(var a,u=t[i],s=u.length,c=0;c<s;++c)(a=u[c])&&(r.push(e.call(a,a.__data__,c,u)),o.push(a));return new K(r,o)},me=function(e){"function"!=typeof e&&(e=ae(e));for(var t=this._groups,n=t.length,r=new Array(n),o=0;o<n;++o)for(var i,a=t[o],u=a.length,s=r[o]=[],c=0;c<u;++c)(i=a[c])&&e.call(i,i.__data__,c,a)&&s.push(i);return new K(r,this._parents)},ge=function(e){return new Array(e.length)},be=function(){return new K(this._enter||this._groups.map(ge),this._parents)};p.prototype={constructor:p,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};var we=function(e){return function(){return e}},_e="$",xe=function(e,t){if(!e)return p=new Array(this.size()),c=-1,this.each(function(e){p[++c]=e}),p;var n=t?y:h,r=this._parents,o=this._groups;"function"!=typeof e&&(e=we(e));for(var i=o.length,a=new Array(i),u=new Array(i),s=new Array(i),c=0;c<i;++c){var l=r[c],f=o[c],d=f.length,p=e.call(l,l&&l.__data__,c,r),v=p.length,m=u[c]=new Array(v),g=a[c]=new Array(v),b=s[c]=new Array(d);n(l,f,m,g,b,p,t);for(var w,_,x=0,A=0;x<v;++x)if(w=m[x]){for(x>=A&&(A=x+1);!(_=g[A])&&++A<v;);w._next=_||null}}return a=new K(a,r),a._enter=u,a._exit=s,a},Ae=function(){return new K(this._exit||this._groups.map(ge),this._parents)},je=function(e){for(var t=this._groups,n=e._groups,r=t.length,o=n.length,i=Math.min(r,o),a=new Array(r),u=0;u<i;++u)for(var s,c=t[u],l=n[u],f=c.length,d=a[u]=new Array(f),p=0;p<f;++p)(s=c[p]||l[p])&&(d[p]=s);for(;u<r;++u)a[u]=t[u];return new K(a,this._parents)},Oe=function(){for(var e=this._groups,t=-1,n=e.length;++t<n;)for(var r,o=e[t],i=o.length-1,a=o[i];--i>=0;)(r=o[i])&&(a&&a!==r.nextSibling&&a.parentNode.insertBefore(r,a),a=r);return this},Se=function(e){function t(t,n){return t&&n?e(t.__data__,n.__data__):!t-!n}e||(e=v);for(var n=this._groups,r=n.length,o=new Array(r),i=0;i<r;++i){for(var a,u=n[i],s=u.length,c=o[i]=new Array(s),l=0;l<s;++l)(a=u[l])&&(c[l]=a);c.sort(t)}return new K(o,this._parents).order()},ke=function(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this},Ee=function(){var e=new Array(this.size()),t=-1;return this.each(function(){e[++t]=this}),e},Ce=function(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var r=e[t],o=0,i=r.length;o<i;++o){var a=r[o];if(a)return a}return null},Ne=function(){var e=0;return this.each(function(){++e}),e},Te=function(){return!this.node()},De=function(e){for(var t=this._groups,n=0,r=t.length;n<r;++n)for(var o,i=t[n],a=0,u=i.length;a<u;++a)(o=i[a])&&e.call(o,o.__data__,a,i);return this},Ie=function(e,t){var n=ee(e);if(arguments.length<2){var r=this.node();return n.local?r.getAttributeNS(n.space,n.local):r.getAttribute(n)}return this.each((null==t?n.local?g:m:"function"==typeof t?n.local?x:_:n.local?w:b)(n,t))},Le=function(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView},Pe=function(e,t,n){var r;return arguments.length>1?this.each((null==t?A:"function"==typeof t?O:j)(e,t,null==n?"":n)):Le(r=this.node()).getComputedStyle(r,null).getPropertyValue(e)},Re=function(e,t){return arguments.length>1?this.each((null==t?S:"function"==typeof t?E:k)(e,t)):this.node()[e]};T.prototype={add:function(e){var t=this._names.indexOf(e);t<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var t=this._names.indexOf(e);t>=0&&(this._names.splice(t,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};var qe=function(e,t){var n=C(e+"");if(arguments.length<2){for(var r=N(this.node()),o=-1,i=n.length;++o<i;)if(!r.contains(n[o]))return!1;return!0}return this.each(("function"==typeof t?R:t?L:P)(n,t))},Be=function(e){return arguments.length?this.each(null==e?q:("function"==typeof e?F:B)(e)):this.node().textContent},Fe=function(e){return arguments.length?this.each(null==e?H:("function"==typeof e?M:U)(e)):this.node().innerHTML},He=function(){return this.each($)},Ue=function(){return this.each(J)},Me=function(e){var t="function"==typeof e?e:te(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})},$e=function(e,t){var n="function"==typeof e?e:te(e),r=null==t?z:"function"==typeof t?t:pe(t);return this.select(function(){return this.insertBefore(n.apply(this,arguments),r.apply(this,arguments)||null)})},Je=function(){return this.each(G)},ze=function(e){return arguments.length?this.property("__data__",e):this.node().__data__},Ge=function(e,t){return this.each(("function"==typeof t?Y:X)(e,t))},Ve=[null];K.prototype=W.prototype={constructor:K,select:he,selectAll:ve,filter:me,data:xe,enter:be,exit:Ae,merge:je,order:Oe,sort:Se,call:ke,nodes:Ee,node:Ce,size:Ne,empty:Te,each:De,attr:Ie,style:Pe,property:Re,classed:qe,text:Be,html:Fe,raise:He,lower:Ue,append:Me,insert:$e,remove:Je,datum:ze,on:ce,dispatch:Ge};var Xe=function(e){return"string"==typeof e?new K([[document.querySelector(e)]],[document.documentElement]):new K([[e]],Ve)},Ye=function(e){return"string"==typeof e?new K([document.querySelectorAll(e)],[document.documentElement]):new K([null==e?[]:e],Ve)},Ke=function(e,t,n){arguments.length<3&&(n=t,t=le().changedTouches);for(var r,o=0,i=t?t.length:0;o<i;++o)if((r=t[o]).identifier===n)return fe(e,r);return null},We=function(e,t){null==t&&(t=le().touches);for(var n=0,r=t?t.length:0,o=new Array(r);n<r;++n)o[n]=fe(e,t[n]);return o};e.creator=te,e.local=r,e.matcher=ae,e.mouse=de,e.namespace=ee,e.namespaces=Z,e.select=Xe,e.selectAll=Ye,e.selection=W,e.selector=pe,e.selectorAll=ye,e.touch=Ke,e.touches=We,e.window=Le,e.customEvent=l,Object.defineProperty(e,"__esModule",{value:!0})})},{}],9:[function(e,t,n){function r(e){if(e){console.error(e,e.stack);var t="";e.name&&(t+=e.name+": "),t+=e.message,e.stack&&(t=NaN+e.stack.toString()),o(t)}}function o(e){var t=document.getElementById("status-message");t.textContent=e,t.classList.remove("hidden")}t.exports=r},{}],10:[function(e,t,n){function r(){function e(e){return e[~~(Math.random()*e.length)]}function t(t){for(var r="",o=0;o<t;++o)r+=e(n);return r}var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");return{randomId:t}}"object"==typeof t&&"object"==typeof t.exports&&(t.exports=r())},{}],11:[function(e,t,n){function r(e){for(var t=-1,n=e?e.length:0,r=0,o=[];++t<n;){var i=e[t];i&&(o[r++]=i)}return o}t.exports=r},{}],12:[function(e,t,n){(function(e){function n(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function r(e,t){for(var n=-1,r=e?e.length:0;++n<r&&t(e[n],n,e)!==!1;);return e}function o(e,t){var n=e?e.length:0;return!!n&&a(e,t,0)>-1}function i(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i;return-1}function a(e,t,n){if(t!==t)return i(e,u,n);for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r;return-1}function u(e){return e!==e}function s(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&r++;return r}function c(e,t){return null==e?void 0:e[t]}function l(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}function f(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var a=e[n];a!==t&&a!==J||(e[n]=J,i[o++]=n)}return i}function d(e){return P(e)?Te(e):{}}function p(e){if(!P(e)||C(e))return!1;var t=L(e)||l(e)?Ne:ve;return t.test(T(e))}function h(e,t,n,r){for(var o=-1,i=e.length,a=n.length,u=-1,s=t.length,c=De(i-a,0),l=Array(s+c),f=!r;++u<s;)l[u]=t[u];for(;++o<a;)(f||o<i)&&(l[n[o]]=e[o]);for(;c--;)l[u++]=e[o++];return l}function y(e,t,n,r){for(var o=-1,i=e.length,a=-1,u=n.length,s=-1,c=t.length,l=De(i-u,0),f=Array(l+c),d=!r;++o<l;)f[o]=e[o];for(var p=o;++s<c;)f[p+s]=t[s];for(;++a<u;)(d||o<i)&&(f[p+n[a]]=e[o++]);return f}function v(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}function m(e,t,n){function r(){var t=this&&this!==xe&&this instanceof r?i:e;return t.apply(o?n:this,arguments)}var o=t&z,i=g(e);return r}function g(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=d(e.prototype),r=e.apply(n,t);return P(r)?r:n}}function b(e,t,r){function o(){for(var a=arguments.length,u=Array(a),s=a,c=j(o);s--;)u[s]=arguments[s];var l=a<3&&u[0]!==c&&u[a-1]!==c?[]:f(u,c);if(a-=l.length,a<r)return x(e,t,w,o.placeholder,void 0,u,l,void 0,void 0,r-a);var d=this&&this!==xe&&this instanceof o?i:e;return n(d,this,u)}var i=g(e);return o}function w(e,t,n,r,o,i,a,u,c,l){function d(){for(var O=arguments.length,S=Array(O),k=O;k--;)S[k]=arguments[k];if(b)var E=j(d),C=s(S,E);if(r&&(S=h(S,r,o,b)),i&&(S=y(S,i,a,b)),O-=C,b&&O<l){var T=f(S,E);return x(e,t,w,d.placeholder,n,S,T,u,c,l-O)}var D=v?n:this,I=m?D[e]:e;return O=S.length,u?S=N(S,u):_&&O>1&&S.reverse(),p&&c<O&&(S.length=c),this&&this!==xe&&this instanceof d&&(I=A||g(I)),I.apply(D,S)}var p=t&Q,v=t&z,m=t&G,b=t&(X|Y),_=t&ee,A=m?void 0:g(e);return d}function _(e,t,r,o){function i(){for(var t=-1,s=arguments.length,c=-1,l=o.length,f=Array(l+s),d=this&&this!==xe&&this instanceof i?u:e;++c<l;)f[c]=o[c];for(;s--;)f[c++]=arguments[++t];return n(d,a?r:this,f)}var a=t&z,u=g(e);return i}function x(e,t,n,r,o,i,a,u,s,c){var l=t&X,f=l?a:void 0,d=l?void 0:a,p=l?i:void 0,h=l?void 0:i;t|=l?K:W,t&=~(l?W:K),t&V||(t&=~(z|G));var y=n(e,t,o,p,f,h,d,u,s,c);return y.placeholder=r,Pe(y,e,t)}function A(e,t,n,r,o,i,a,u){var s=t&G;if(!s&&"function"!=typeof e)throw new TypeError($);var c=r?r.length:0;if(c||(t&=~(K|W),r=o=void 0),a=void 0===a?a:De(F(a),0),u=void 0===u?u:F(u),c-=o?o.length:0,t&W){var l=r,f=o;r=o=void 0}var d=[e,t,n,r,o,l,f,i,a,u];if(e=d[0],t=d[1],n=d[2],r=d[3],o=d[4],u=d[9]=null==d[9]?s?0:e.length:De(d[9]-c,0),!u&&t&(X|Y)&&(t&=~(X|Y)),t&&t!=z)p=t==X||t==Y?b(e,t,u):t!=K&&t!=(z|K)||o.length?w.apply(void 0,d):_(e,t,n,r);else var p=m(e,t,n);return Pe(p,e,t)}function j(e){var t=e;return t.placeholder}function O(e,t){var n=c(e,t);return p(n)?n:void 0}function S(e){var t=e.match(de);return t?t[1].split(pe):[]}function k(e,t){var n=t.length,r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(fe,"{\n/* [wrapped with "+t+"] */\n")}function E(e,t){return t=null==t?ne:t,!!t&&("number"==typeof e||ge.test(e))&&e>-1&&e%1==0&&e<t}function C(e){return!!Se&&Se in e}function N(e,t){for(var n=e.length,r=Ie(t.length,n),o=v(e);r--;){var i=t[r];e[r]=E(i,n)?o[i]:void 0}return e}function T(e){if(null!=e){try{return ke.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function D(e,t){return r(ie,function(n){var r="_."+n[0];t&n[1]&&!o(e,r)&&e.push(r)}),e.sort()}function I(e,t,n){t=n?void 0:t;var r=A(e,X,void 0,void 0,void 0,void 0,void 0,t);return r.placeholder=I.placeholder,r}function L(e){var t=P(e)?Ce.call(e):"";return t==ae||t==ue}function P(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function R(e){return!!e&&"object"==typeof e}function q(e){return"symbol"==typeof e||R(e)&&Ce.call(e)==se}function B(e){if(!e)return 0===e?e:0;if(e=H(e),e===te||e===-te){var t=e<0?-1:1;return t*re}return e===e?e:0}function F(e){var t=B(e),n=t%1;return t===t?n?t-n:t:0}function H(e){if("number"==typeof e)return e;if(q(e))return oe;if(P(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=P(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(le,"");var n=ye.test(e);return n||me.test(e)?be(e.slice(2),n?2:8):he.test(e)?oe:+e}function U(e){return function(){return e}}function M(e){return e}var $="Expected a function",J="__lodash_placeholder__",z=1,G=2,V=4,X=8,Y=16,K=32,W=64,Q=128,Z=256,ee=512,te=1/0,ne=9007199254740991,re=1.7976931348623157e308,oe=NaN,ie=[["ary",Q],["bind",z],["bindKey",G],["curry",X],["curryRight",Y],["flip",ee],["partial",K],["partialRight",W],["rearg",Z]],ae="[object Function]",ue="[object GeneratorFunction]",se="[object Symbol]",ce=/[\\^$.*+?()[\]{}|]/g,le=/^\s+|\s+$/g,fe=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,de=/\{\n\/\* \[wrapped with (.+)\] \*/,pe=/,? & /,he=/^[-+]0x[0-9a-f]+$/i,ye=/^0b[01]+$/i,ve=/^\[object .+?Constructor\]$/,me=/^0o[0-7]+$/i,ge=/^(?:0|[1-9]\d*)$/,be=parseInt,we="object"==typeof e&&e&&e.Object===Object&&e,_e="object"==typeof self&&self&&self.Object===Object&&self,xe=we||_e||Function("return this")(),Ae=Function.prototype,je=Object.prototype,Oe=xe["__core-js_shared__"],Se=function(){var e=/[^.]+$/.exec(Oe&&Oe.keys&&Oe.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),ke=Ae.toString,Ee=je.hasOwnProperty,Ce=je.toString,Ne=RegExp("^"+ke.call(Ee).replace(ce,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Te=Object.create,De=Math.max,Ie=Math.min,Le=function(){var e=O(Object,"defineProperty"),t=O.name;return t&&t.length>2?e:void 0}(),Pe=Le?function(e,t,n){var r=t+"";return Le(e,"toString",{configurable:!0,enumerable:!1,value:U(k(r,D(S(r),n)))})}:M;I.placeholder={},t.exports=I}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],13:[function(e,t,n){function r(){if(!u){u=!0;for(var e,t=a.length;t;){e=a,a=[];for(var n=-1;++n<t;)e[n]();t=a.length}u=!1}}function o(){}var i=t.exports={},a=[],u=!1;i.nextTick=function(e){a.push(e),u||setTimeout(r,0)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=o,i.addListener=o,i.once=o,i.off=o,i.removeListener=o,i.removeAllListeners=o,i.emit=o,i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],14:[function(e,t,n){"use strict";var r=String.prototype.replace,o=/%20/g;t.exports={default:"RFC3986",formatters:{RFC1738:function(e){return r.call(e,o,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"}},{}],15:[function(e,t,n){"use strict";var r=e("./stringify"),o=e("./parse"),i=e("./formats");t.exports={formats:i,parse:o,stringify:r}},{"./formats":14,"./parse":16,"./stringify":17}],16:[function(e,t,n){"use strict";var r=e("./utils"),o=Object.prototype.hasOwnProperty,i={allowDots:!1,allowPrototypes:!1,arrayLimit:20,decoder:r.decode,delimiter:"&",depth:5,parameterLimit:1e3,plainObjects:!1,strictNullHandling:!1},a=function(e,t){for(var n={},r=e.split(t.delimiter,t.parameterLimit===1/0?void 0:t.parameterLimit),i=0;i<r.length;++i){var a,u,s=r[i],c=s.indexOf("]=")===-1?s.indexOf("="):s.indexOf("]=")+1;c===-1?(a=t.decoder(s),u=t.strictNullHandling?null:""):(a=t.decoder(s.slice(0,c)),u=t.decoder(s.slice(c+1))),o.call(n,a)?n[a]=[].concat(n[a]).concat(u):n[a]=u}return n},u=function e(t,n,r){if(!t.length)return n;var o,i=t.shift();if("[]"===i)o=[],o=o.concat(e(t,n,r));else{o=r.plainObjects?Object.create(null):{};var a="["===i[0]&&"]"===i[i.length-1]?i.slice(1,i.length-1):i,u=parseInt(a,10);!isNaN(u)&&i!==a&&String(u)===a&&u>=0&&r.parseArrays&&u<=r.arrayLimit?(o=[],o[u]=e(t,n,r)):o[a]=e(t,n,r)}return o},s=function(e,t,n){if(e){var r=n.allowDots?e.replace(/\.([^\.\[]+)/g,"[$1]"):e,i=/^([^\[\]]*)/,a=/(\[[^\[\]]*\])/g,s=i.exec(r),c=[];if(s[1]){if(!n.plainObjects&&o.call(Object.prototype,s[1])&&!n.allowPrototypes)return;c.push(s[1])}for(var l=0;null!==(s=a.exec(r))&&l<n.depth;)l+=1,(n.plainObjects||!o.call(Object.prototype,s[1].replace(/\[|\]/g,""))||n.allowPrototypes)&&c.push(s[1]);return s&&c.push("["+r.slice(s.index)+"]"),u(c,t,n)}};t.exports=function(e,t){var n=t||{};if(null!==n.decoder&&void 0!==n.decoder&&"function"!=typeof n.decoder)throw new TypeError("Decoder has to be a function.");if(n.delimiter="string"==typeof n.delimiter||r.isRegExp(n.delimiter)?n.delimiter:i.delimiter,n.depth="number"==typeof n.depth?n.depth:i.depth,n.arrayLimit="number"==typeof n.arrayLimit?n.arrayLimit:i.arrayLimit,n.parseArrays=n.parseArrays!==!1,n.decoder="function"==typeof n.decoder?n.decoder:i.decoder,n.allowDots="boolean"==typeof n.allowDots?n.allowDots:i.allowDots,n.plainObjects="boolean"==typeof n.plainObjects?n.plainObjects:i.plainObjects,n.allowPrototypes="boolean"==typeof n.allowPrototypes?n.allowPrototypes:i.allowPrototypes,n.parameterLimit="number"==typeof n.parameterLimit?n.parameterLimit:i.parameterLimit,n.strictNullHandling="boolean"==typeof n.strictNullHandling?n.strictNullHandling:i.strictNullHandling,""===e||null===e||"undefined"==typeof e)return n.plainObjects?Object.create(null):{};for(var o="string"==typeof e?a(e,n):e,u=n.plainObjects?Object.create(null):{},c=Object.keys(o),l=0;l<c.length;++l){
var f=c[l],d=s(f,o[f],n);u=r.merge(u,d,n)}return r.compact(u)}},{"./utils":18}],17:[function(e,t,n){"use strict";var r=e("./utils"),o=e("./formats"),i={brackets:function(e){return e+"[]"},indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},a=Date.prototype.toISOString,u={delimiter:"&",encode:!0,encoder:r.encode,serializeDate:function(e){return a.call(e)},skipNulls:!1,strictNullHandling:!1},s=function e(t,n,o,i,a,u,s,c,l,f,d){var p=t;if("function"==typeof s)p=s(n,p);else if(p instanceof Date)p=f(p);else if(null===p){if(i)return u?u(n):n;p=""}if("string"==typeof p||"number"==typeof p||"boolean"==typeof p||r.isBuffer(p))return u?[d(u(n))+"="+d(u(p))]:[d(n)+"="+d(String(p))];var h=[];if("undefined"==typeof p)return h;var y;if(Array.isArray(s))y=s;else{var v=Object.keys(p);y=c?v.sort(c):v}for(var m=0;m<y.length;++m){var g=y[m];a&&null===p[g]||(h=Array.isArray(p)?h.concat(e(p[g],o(n,g),o,i,a,u,s,c,l,f,d)):h.concat(e(p[g],n+(l?"."+g:"["+g+"]"),o,i,a,u,s,c,l,f,d)))}return h};t.exports=function(e,t){var n=e,r=t||{},a="undefined"==typeof r.delimiter?u.delimiter:r.delimiter,c="boolean"==typeof r.strictNullHandling?r.strictNullHandling:u.strictNullHandling,l="boolean"==typeof r.skipNulls?r.skipNulls:u.skipNulls,f="boolean"==typeof r.encode?r.encode:u.encode,d=f?"function"==typeof r.encoder?r.encoder:u.encoder:null,p="function"==typeof r.sort?r.sort:null,h="undefined"!=typeof r.allowDots&&r.allowDots,y="function"==typeof r.serializeDate?r.serializeDate:u.serializeDate;if("undefined"==typeof r.format)r.format=o.default;else if(!Object.prototype.hasOwnProperty.call(o.formatters,r.format))throw new TypeError("Unknown format option provided.");var v,m,g=o.formatters[r.format];if(null!==r.encoder&&void 0!==r.encoder&&"function"!=typeof r.encoder)throw new TypeError("Encoder has to be a function.");"function"==typeof r.filter?(m=r.filter,n=m("",n)):Array.isArray(r.filter)&&(m=r.filter,v=m);var b=[];if("object"!=typeof n||null===n)return"";var w;w=r.arrayFormat in i?r.arrayFormat:"indices"in r?r.indices?"indices":"repeat":"indices";var _=i[w];v||(v=Object.keys(n)),p&&v.sort(p);for(var x=0;x<v.length;++x){var A=v[x];l&&null===n[A]||(b=b.concat(s(n[A],A,_,c,l,d,m,p,h,y,g)))}return b.join(a)}},{"./formats":14,"./utils":18}],18:[function(e,t,n){"use strict";var r=Object.prototype.hasOwnProperty,o=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}();n.arrayToObject=function(e,t){for(var n=t&&t.plainObjects?Object.create(null):{},r=0;r<e.length;++r)"undefined"!=typeof e[r]&&(n[r]=e[r]);return n},n.merge=function(e,t,o){if(!t)return e;if("object"!=typeof t){if(Array.isArray(e))e.push(t);else{if("object"!=typeof e)return[e,t];e[t]=!0}return e}if("object"!=typeof e)return[e].concat(t);var i=e;return Array.isArray(e)&&!Array.isArray(t)&&(i=n.arrayToObject(e,o)),Array.isArray(e)&&Array.isArray(t)?(t.forEach(function(t,i){r.call(e,i)?e[i]&&"object"==typeof e[i]?e[i]=n.merge(e[i],t,o):e.push(t):e[i]=t}),e):Object.keys(t).reduce(function(e,r){var i=t[r];return Object.prototype.hasOwnProperty.call(e,r)?e[r]=n.merge(e[r],i,o):e[r]=i,e},i)},n.decode=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(t){return e}},n.encode=function(e){if(0===e.length)return e;for(var t="string"==typeof e?e:String(e),n="",r=0;r<t.length;++r){var i=t.charCodeAt(r);45===i||46===i||95===i||126===i||i>=48&&i<=57||i>=65&&i<=90||i>=97&&i<=122?n+=t.charAt(r):i<128?n+=o[i]:i<2048?n+=o[192|i>>6]+o[128|63&i]:i<55296||i>=57344?n+=o[224|i>>12]+o[128|i>>6&63]+o[128|63&i]:(r+=1,i=65536+((1023&i)<<10|1023&t.charCodeAt(r)),n+=o[240|i>>18]+o[128|i>>12&63]+o[128|i>>6&63]+o[128|63&i])}return n},n.compact=function(e,t){if("object"!=typeof e||null===e)return e;var r=t||[],o=r.indexOf(e);if(o!==-1)return r[o];if(r.push(e),Array.isArray(e)){for(var i=[],a=0;a<e.length;++a)e[a]&&"object"==typeof e[a]?i.push(n.compact(e[a],r)):"undefined"!=typeof e[a]&&i.push(e[a]);return i}var u=Object.keys(e);return u.forEach(function(t){e[t]=n.compact(e[t],r)}),e},n.isRegExp=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},n.isBuffer=function(e){return null!==e&&"undefined"!=typeof e&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))}},{}],19:[function(e,t,n){function r(e){function t(e,t){return function(r){if(r)n&&(r.stack?n(r,r.stack):n(r)),t&&t(r);else if(e){var o=Array.prototype.slice.call(arguments,1);t&&o.push(t),e.apply(e,o)}}}var n;return e&&(n=e.log),t}t.exports=r},{}],20:[function(e,t,n){"use strict";function r(e){function t(){c.select("#success-message").classed("hidden",!0),c.select("#status-message").classed("hidden",!0);var e=c.select(".deed-form"),t=c.select(".url-form-items").selectAll("li"),r={name:o("#deed-name",e),stamp:o("#deed-stamp",e),description:o("#deed-description",e),urls:l(t.nodes().map(i))};a(r)&&n(r,s)}var n=e.onClick;c.select("#add-deed-button").on("click",t)}function o(e,t){return t.select(e).node().value}function i(e){var t=c.select(e),n={name:o(".deed-link-name",t),url:o(".deed-link-url",t)};if(n.name&&n.url)return n}function a(e){if(e.name)if(e.stamp){if(!(e.urls.length<1))return!0;u("Please provide at least one link for this deed.")}else u("Please set a date for this deed.");else u("Please enter a deed for the name.")}function u(e){c.select("#status-message").text(e).classed("hidden",!1)}function s(e,t){e?(c.select("#success-message").classed("hidden",!0),u("Had a problem submitting deed: "+e.message+"\n"+e.stack)):(c.select("#success-message .pull-request-link").attr("href",t),c.select("#success-message").classed("hidden",!1),c.select("#status-message").classed("hidden",!0))}var c=e("d3-selection"),l=e("lodash.compact");t.exports=r},{"d3-selection":8,"lodash.compact":11}],21:[function(e,t,n){"use strict";function r(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))}function o(e){return decodeURIComponent(Array.prototype.map.call(atob(e),function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""))}t.exports={encodeInBase64:r,decodeFromBase64:o}},{}]},{},[1]);