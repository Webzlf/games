(function(win, doc) {
  'use strict';

  var tid;
  var dpr = 0;
  var scale = 0;

  var docEl = doc.documentElement;
  var devicePixelRatio = win.devicePixelRatio;
  var appVersion = win.navigator.appVersion.toLowerCase();
  var metaEl = doc.querySelector('meta[name="viewport"]');

  var isAndroid = appVersion.match(/android/g);
  var isIPhone = appVersion.match(/iphone/g);
  var isWx = appVersion.match(/micromessenger/g);
  var isQq = appVersion.match(/\sqq/g);
  var isQqBrowser = appVersion.match(/\MQQBrowser/g);
  var isUc = appVersion.match(/ucbrowser/g);

  function redraw() {

    var width = docEl.getBoundingClientRect().width;

    if (width / dpr > 360) {
      width = 360 * dpr;
    }

    var rem = width / 22.5;

    docEl.style.fontSize = rem + 'px';
  }

  if (metaEl) {
    console.warn('将根据已有的meta标签来设置缩放比例');
    var match = metaEl.getAttribute('content').match(/initial\-scale=(['']?)([\d\.]+)\1?/);
    if (match) {
      scale = parseFloat(match[2]);
      dpr = 1 / scale;
    }
  }

  if (!dpr && !scale) {
    if (devicePixelRatio >= 3) {
      dpr = 3;
    } else if (devicePixelRatio >= 2) {
      dpr = 2;
    } else {
      dpr = 1;
    }
    scale = 1 / dpr;
  }

  docEl.setAttribute('data-dpr', dpr);

  if (!metaEl) {
    var content = (isWx || isQq || isUc || isQqBrowser) ? '' : 'target-densitydpi=device-dpi, ';
    var deviceWidth = Math.min(docEl.getBoundingClientRect().width, win.screen.width);

    if (deviceWidth <= 360) {
      content += 'width=' + deviceWidth * dpr;
    } else {
      content += 'width=device-width';
    }

    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', content + ', initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');

    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
    } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
  }

  win.dpr = dpr;

  win.addEventListener('resize', function() {
    clearTimeout(tid);
    tid = setTimeout(redraw, 300);
  }, false);

  win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(redraw, 300);
    }
  }, false);

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 16 * dpr + 'px';
  } else {
    doc.addEventListener('DOMContentLoaded', function(e) {
      doc.body.style.fontSize = 16 * dpr + 'px';
    }, false);
  }

  redraw();
})(window, document);
