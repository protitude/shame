!function(t){"use strict";var e=t.querySelector("#app");e.baseUrl="/",""===window.location.port&&(e.baseUrl="/shame/"),e.displayInstalledToast=function(){Polymer.dom(t).querySelector("platinum-sw-cache").disabled||Polymer.dom(t).querySelector("#caching-complete").show()},e.addEventListener("dom-change",function(){console.log("Our app is ready to rock!")}),window.addEventListener("WebComponentsReady",function(){}),window.addEventListener("paper-header-transform",function(e){var o=Polymer.dom(t).querySelector("#mainToolbar .app-name"),n=Polymer.dom(t).querySelector("#mainToolbar .middle-container"),i=Polymer.dom(t).querySelector("#mainToolbar .bottom-container"),s=e.detail,a=s.height-s.condensedHeight,r=Math.min(1,s.y/a),l=.5,h=a-s.y,c=a/(1-l),d=Math.max(l,h/c+l),u=1-r;Polymer.Base.transform("translate3d(0,"+100*r+"%,0)",n),Polymer.Base.transform("scale("+u+") translateZ(0)",i),Polymer.Base.transform("scale("+d+") translateZ(0)",o)}),e.scrollPageToTop=function(){e.$.headerPanelMain.scrollToTop(!0)},e.closeDrawer=function(){e.$.paperDrawerPanel.closeDrawer()}}(document);var define;!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t,t.document)}):"undefined"!=typeof module&&module.exports?module.exports=e(t,t.document):t.Shake=e(t,t.document)}("undefined"!=typeof window?window:this,function(t,e){"use strict";function o(o){if(this.hasDeviceMotion="ondevicemotion"in t,this.options={threshold:15,timeout:1e3},"object"==typeof o)for(var n in o)o.hasOwnProperty(n)&&(this.options[n]=o[n]);if(this.lastTime=new Date,this.lastX=null,this.lastY=null,this.lastZ=null,"function"==typeof e.CustomEvent)this.event=new e.CustomEvent("shake",{bubbles:!0,cancelable:!0});else{if("function"!=typeof e.createEvent)return!1;this.event=e.createEvent("Event"),this.event.initEvent("shake",!0,!0)}}return o.prototype.reset=function(){this.lastTime=new Date,this.lastX=null,this.lastY=null,this.lastZ=null},o.prototype.start=function(){this.reset(),this.hasDeviceMotion&&t.addEventListener("devicemotion",this,!1)},o.prototype.stop=function(){this.hasDeviceMotion&&t.removeEventListener("devicemotion",this,!1),this.reset()},o.prototype.devicemotion=function(e){var o,n,i=e.accelerationIncludingGravity,s=0,a=0,r=0;return null===this.lastX&&null===this.lastY&&null===this.lastZ?(this.lastX=i.x,this.lastY=i.y,void(this.lastZ=i.z)):(s=Math.abs(this.lastX-i.x),a=Math.abs(this.lastY-i.y),r=Math.abs(this.lastZ-i.z),(s>this.options.threshold&&a>this.options.threshold||s>this.options.threshold&&r>this.options.threshold||a>this.options.threshold&&r>this.options.threshold)&&(o=new Date,n=o.getTime()-this.lastTime.getTime(),n>this.options.timeout&&(t.dispatchEvent(this.event),this.lastTime=new Date)),this.lastX=i.x,this.lastY=i.y,void(this.lastZ=i.z))},o.prototype.handleEvent=function(t){return"function"==typeof this[t.type]?this[t.type](t):void 0},o});