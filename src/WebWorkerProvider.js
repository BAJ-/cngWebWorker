'use strict';

class CngWebWorkerProvider {
  constructor() {
    this.paramName = 'message';
  }

  setParamName(name) {
    this.paramName = name;
  }

  getWorkerTemplate(worker, paramName) {
    return `
      self.addEventListener('message', function(e) {
        var ${paramName} = e.data;

        var reply = {
          result: undefined,
          params: e.data
        };

        reply.result = (${worker.toString()})(${paramName});

        self.postMessage(reply);
      });
      self.postMessage({ready: true});
    `;
  }

  $get($q) {
    return {
      sendMessage: (message) => {
        var deferred = $q.defer();
        this.worker.onmessage = function tempListener(e) {
          deferred.resolve(e);
        };

        this.worker.postMessage(message);
        return deferred.promise;
      },
      create: (worker, paramName) => {
        var webWorker,
            deferred = $q.defer(),
            blob;

        if (paramName) {
          this.setParamName(paramName);
        }

        blob = new Blob([this.getWorkerTemplate(worker, this.paramName)], {type: 'application/javascript'});
        webWorker = new Worker(URL.createObjectURL(blob));

        webWorker.onmessage = (e) => {
          if (e.data.ready) {
            deferred.resolve({
              worker: webWorker,
              sendMessage: function(message) {
                var deferred = $q.defer();
                this.worker.onmessage = function(e) {
                  deferred.resolve(e);
                };
                this.worker.postMessage(message);
                return deferred.promise;
              }
            });
          } else {
            deferred.reject();
          }
        };

        return deferred.promise;
      }
    }
  }
}

export { CngWebWorkerProvider }
