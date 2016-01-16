import { MainController } from './MainController';
import { CngWebWorkerProvider } from '../../src/WebWorkerProvider';

angular
  .module('wwApp', [])
  .provider('cngWebWorker', CngWebWorkerProvider)
  .controller('MainController', MainController);
