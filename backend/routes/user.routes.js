import { Router } from "express";
import {
    register,
    login, uploadProfilePicture,
    updateUserProfile, getUserAndProfile,
     updateProfile, getAllUserProfile, downloadProfile,
     sendConnectionRequest,
     getMyConnectionsRequests,
     whatAreMyConnections,
     acceptConnectionRequest
} from "../controllers/user.controller.js";
import multer from "multer";
import { send } from "process";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route('/upload_profile_picture').post(upload.single('profile_picture'), uploadProfilePicture);

router.route('/register').post(register);
router.route('/login').post(login);

router.route('/user_update').post(updateUserProfile);

router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfile);

router.route('/user/get_all_users').get(getAllUserProfile);

router.route('/user/download_resume').get(downloadProfile);

router.route('/user/send_connection_request').post(sendConnectionRequest);
router.route('/user/getConnectionRequests').post(getMyConnectionsRequests);
router.route('/user/user_connection_request').post(whatAreMyConnections);
router.route('/user/accept_connection_request').post(acceptConnectionRequest);

export default router;
