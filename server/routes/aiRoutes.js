import express from 'express';
import { generateArticle, generateBlogTitles, generateImage, removeImageBackground, removeImageObject, reviewResume } from '../controllers/aiController.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle )
aiRouter.post('/generate-blog-titles', auth, generateBlogTitles )
aiRouter.post('/generate-image', auth, generateImage )
aiRouter.post('/remove-image-background', auth, upload.single('image'), removeImageBackground )
aiRouter.post('/remove-image-object', auth, upload.single('image'), removeImageObject )
aiRouter.post('/review-resume', auth, upload.single('resume'), reviewResume )

export default aiRouter
