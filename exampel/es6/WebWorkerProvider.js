'use strict';

class CngWebWorkerProvider {
  constructor() {
    this.paramName = 'message';
    this.worker = {ready: false};
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
        this.worker.addEventListener('message', function tempListener(e) {
          deferred.resolve(e);
        });

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

        var workerPromise = (e) => {
          if (e.data.ready) {
            this.worker = webWorker;
            deferred.resolve(webWorker);
          } else {
            deferred.reject();
          }
          webWorker.removeEventListener('message', workerPromise);
        }
        webWorker.addEventListener('message', workerPromise);

        return deferred.promise;
      }
    }
  }
}

export { CngWebWorkerProvider }
