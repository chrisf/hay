/*!
 * @license
 * rafscroll 0.1
 *
 * Copyright 2015, Kevin Foley - http://github.com/foleyatwork
 * Released under the WTFPL license - http://www.wtfpl.net/txt/copying/
 */
!function(){function i(i,t){return i?"function"!=typeof i?void console.warn("rafScroll: Invalid callback type."):(this._scrolling=!1,this._callback=i,this._args=t||[],void this.subscribe()):void console.warn("rafScroll: No callback supplied, not initiating.")}function t(i){this._mostRecentScrollEvent=i,this._scrolling===!1&&(this._scrolling=!0,o.call(this)),this._scrollTimeout&&clearTimeout(this._scrollTimeout),this._scrollTimeout=setTimeout(function(){this._scrolling=!1},s)}function o(){this._args.unshift(this._mostRecentScrollEvent),this._callback.apply(window||{},this._args),this._args.shift(),this._scrolling===!0&&requestAnimationFrame(o.bind(this))}if(!window.requestAnimationFrame)return void console.info("Your browser does not support requestAnimationFrame. There is a nice polyfill you can use here.","https://gist.github.com/paulirish/1579671");var s=100;i.prototype={subscribe:function(){addEventListener("scroll",t.bind(this),!1)},unsubscribe:function(){removeEventListener("scroll",t.bind(this),!1)}},"function"==typeof define&&define.amd?define("rafscroll",i):"undefined"!=typeof module&&"undefined"!=typeof exports?module.exports={rafscroll:i}:window.rafscroll=i}();