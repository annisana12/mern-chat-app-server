import validation from "../validation/index.js";
import userValidation from "../validation/user.js";
import userService from "../services/user.js";

const setupProfile = async (req, res, next) => {
    try {
        const validInput = validation.validate(
            userValidation.profileSchema,
            {
                ...req.body,
                file: req.file,
                userId: req.user.id
            }
        );

        const user = await userService.updateProfile(validInput);

        res.json({ data: user });
    } catch (error) {
        next(error);
    }
}

const getProfileImageUrl = async (req, res, next) => {
    try {
        const result = await userService.getProfileImageUrl(req.user.id);
        res.json({ data: result });
    } catch (error) {
        next(error);
    }
}

export default {
    setupProfile,
    getProfileImageUrl
}