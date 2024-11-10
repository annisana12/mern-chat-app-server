import Validator from "fastest-validator";
import { ResponseError } from "../helper/response-error.js";

const validate = (schema, data) => {
    const v = new Validator();

    const check = v.compile(schema);
    const result = check(data);

    if (result !== true) {
        throw new ResponseError(400, 'Validation Failed', { errors: result });
    }

    return data; // The data is formatted according to the defined schema
};

export default {
    validate
}