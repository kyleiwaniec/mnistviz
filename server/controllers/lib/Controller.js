/* @flow */

export type Request = any;

export class Controller {
  req: Request;
  params: Object;

  constructor(req: Request) {
    this.req = req;
    if (this.req.method == 'POST') {
      this.params = JSON.parse(req.body.params || '{}');
    } else {
      this.params = JSON.parse(req.query.params || '{}');
    }
  }
}
