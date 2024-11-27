import { logger } from "../application/logging.js";
import { ResponseError } from "../helper/response-error.js";

const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        return next();
    }

    if (err instanceof ResponseError) {
        res
            .status(err.statusCode)
            .json({
                message: err.message,
                data: err.data
            })
            .end();
    } else {
        logger.error(err.message, { stack: err.stack });

        res
            .status(500)
            .json({
                message: 'Internal Server Error',
                data: null
            })
            .end();
    }
}

export default errorMiddleware;