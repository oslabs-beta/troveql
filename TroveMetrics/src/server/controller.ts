import { Request, Response, NextFunction, RequestHandler} from 'express';

type controller = {
  post: RequestHandler
}

const troveController: controller = {

  post: function(req: Request, res: Response, next: NextFunction) {
    // controller does very little right now, but will likely do more later
    res.locals.data = req.body
    return next();
  },
};
export { troveController };
