import express from 'express';
import { loginNew, userDataRoute, logoutNew,uploadData,fetchImages ,updateData,deleteData,fetchProjectById} from '../controllers/controllers.js';
import multer from 'multer'; // Keep this line

const router = express.Router();

router.post('/login', loginNew);
router.get('/userdata', userDataRoute);
router.post('/logout', logoutNew);
router.post('/uploadimage',uploadData);
router.get('/images',fetchImages)
router.get('/projects/:id', fetchProjectById);
router.put('/updateData/:id',updateData)
router.delete('/deleteData/:id',deleteData)
export default router;