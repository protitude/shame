/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    app.baseUrl = '/shame/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  app.refreshTapped = function() {
    location.reload();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

})(document);

/*
 * Author: Alex Gibson
 * https://github.com/alexgibson/shake.js
 * License: MIT license
 */

var define;

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(global, global.document);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(global, global.document);
  } else {
    global.Shake = factory(global, global.document);
  }
}
(typeof window !== 'undefined' ? window : this, function(window, document) {

  'use strict';

  function Shake(options) {
    //feature detect
    this.hasDeviceMotion = 'ondevicemotion' in window;

    this.options = {
      threshold: 15, //default velocity threshold for shake to register
      timeout: 1000 //default interval between events
    };

    if (typeof options === 'object') {
      for (var i in options) {
        if (options.hasOwnProperty(i)) {
          this.options[i] = options[i];
        }
      }
    }

    //use date to prevent multiple shakes firing
    this.lastTime = new Date();

    //accelerometer values
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;

    //create custom event
    if (typeof document.CustomEvent === 'function') {
      this.event = new document.CustomEvent('shake', {
        bubbles: true,
        cancelable: true
      });
    } else if (typeof document.createEvent === 'function') {
      this.event = document.createEvent('Event');
      this.event.initEvent('shake', true, true);
    } else {
      return false;
    }
  }

  //reset timer values
  Shake.prototype.reset = function() {
    this.lastTime = new Date();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
  };

  //start listening for devicemotion
  Shake.prototype.start = function() {
    this.reset();
    if (this.hasDeviceMotion) {
      window.addEventListener('devicemotion', this, false);
    }
  };

  //stop listening for devicemotion
  Shake.prototype.stop = function() {
    if (this.hasDeviceMotion) {
      window.removeEventListener('devicemotion', this, false);
    }
    this.reset();
  };

  //calculates if shake did occur
  Shake.prototype.devicemotion = function(e) {
    var current = e.accelerationIncludingGravity;
    var currentTime;
    var timeDifference;
    var deltaX = 0;
    var deltaY = 0;
    var deltaZ = 0;

    if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
      this.lastX = current.x;
      this.lastY = current.y;
      this.lastZ = current.z;
      return;
    }

    deltaX = Math.abs(this.lastX - current.x);
    deltaY = Math.abs(this.lastY - current.y);
    deltaZ = Math.abs(this.lastZ - current.z);

    if (((deltaX > this.options.threshold) &&
      (deltaY > this.options.threshold)) ||
      ((deltaX > this.options.threshold) &&
        (deltaZ > this.options.threshold)) ||
      ((deltaY > this.options.threshold) &&
        (deltaZ > this.options.threshold))) {
      //calculate time in milliseconds since last shake registered
      currentTime = new Date();
      timeDifference = currentTime.getTime() - this.lastTime.getTime();

      if (timeDifference > this.options.timeout) {
        window.dispatchEvent(this.event);
        this.lastTime = new Date();
      }
    }

    this.lastX = current.x;
    this.lastY = current.y;
    this.lastZ = current.z;

  };

  //event handler
  Shake.prototype.handleEvent = function(e) {
    if (typeof (this[e.type]) === 'function') {
      return this[e.type](e);
    }
  };

  return Shake;
}));
