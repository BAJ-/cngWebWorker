import { MainController } from './MainController';
import { CngWebWorkerProvider } from './WebWorkerProvider';

angular
  .module('wwApp', [])
  .provider('cngWebWorker', CngWebWorkerProvider)
  .controller('MainController', MainController);
