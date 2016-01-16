'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CngWebWorkerProvider = function () {
  function CngWebWorkerProvider() {
    _classCallCheck(this, CngWebWorkerProvider);

    this.paramName = 'message';
    this.worker = { ready: false };
  }

  _createClass(CngWebWorkerProvider, [{
    key: 'setParamName',
    value: function setParamName(name) {
      this.paramName = name;
    }
  }, {
    key: 'getWorkerTemplate',
    value: function getWorkerTemplate(worker, paramName) {
      return '\n      self.addEventListener(\'message\', function(e) {\n        var ' + paramName + ' = e.data;\n\n        var reply = {\n          result: undefined,\n          params: e.data\n        };\n\n        reply.result = (' + worker.toString() + ')(' + paramName + ');\n\n        self.postMessage(reply);\n      });\n      self.postMessage({ready: true});\n    ';
    }
  }, {
    key: '$get',
    value: function $get($q) {
      var _this = this;

      return {
        sendMessage: function sendMessage(message) {
          var deferred = $q.defer();
          _this.worker.onmessage = function tempListener(e) {
            deferred.resolve(e);
          };

          _this.worker.postMessage(message);
          return deferred.promise;
        },
        create: function create(worker, paramName) {
          var webWorker,
              deferred = $q.defer(),
              blob;

          if (paramName) {
            _this.setParamName(paramName);
          }

          blob = new Blob([_this.getWorkerTemplate(worker, _this.paramName)], { type: 'application/javascript' });
          webWorker = new Worker(URL.createObjectURL(blob));

          webWorker.onmessage = function (e) {
            if (e.data.ready) {
              _this.worker = webWorker;
              deferred.resolve(webWorker);
            } else {
              deferred.reject();
            }
          };

          return deferred.promise;
        }
      };
    }
  }]);

  return CngWebWorkerProvider;
}();

exports.CngWebWorkerProvider = CngWebWorkerProvider;