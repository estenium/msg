import { Router } from 'express';
import { body } from 'express-validator';

import { postMessage } from '../controllers/msg';
import { handleHttpError } from '../helpers/error';
import { checkAuth } from '../middleware/check-auth';

const router = Router();
router.use(checkAuth);

// router.get('/new-messages', getNewMessages);
router.post(
  '/send',
  [
    body('phoneNumber').isLength({ min: 9, max: 9 }),
    body('message').isString(),
    body('token').isString(),
  ],
  postMessage
);

router.use(handleHttpError);

export default router;
