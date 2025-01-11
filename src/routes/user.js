import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { ResponseError } from "../helper/response-error.js";
import userController from "../controllers/user.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
    const allowedMimeType = ['image/png', 'image/jpeg'];

    if (!allowedMimeType.includes(file.mimetype)) {
        return cb(new ResponseError(400, "Only image with .png, .jpg, and .jpeg extension is allowed", null))
    }

    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter
});

router.use(authMiddleware);

router.post('/profile', upload.single("profileImage"), userController.setupProfile);
router.get('/profile-image', userController.getProfileImageUrl);

export default router;