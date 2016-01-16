class MainController {
  constructor (cngWebWorker) {
    this.factors = [];
    this.number = 1000;
    cngWebWorker.create(function(no) {
      function primeFact(n) {
        var root = Math.sqrt(n),
            res = arguments[1] || [],
            x = 2;
        if (n % x) {
          x = 3;
          while ((n % x) && ((x = x + 2) < root)) {}
        }

        x = (x <= root) ? x : n;
        res.push(x);

        return (x === n) ? res : primeFact(n / x, res);
      }
      return primeFact(no);
    }, 'no').then((e) => {
      this.worker = e;
      this.primeFactors = (num) => {
        cngWebWorker.sendMessage(num).then((e) => {
          this.factors = e.data.result;
        });
      };
    });
  }
}

export { MainController }
