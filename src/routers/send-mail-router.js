import sendMail from '../utils/send-mail';
import { Router } from 'express';
const sendMailRouter = Router();
sendMailRouter.post('/send-mail', async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res
      .status(400)
      .json('req.body.email undefined, 이메일을 요청 바디에 적어주세요');
    return;
  }
  await sendMail(email);
  res.status(201).json('메일이 발송되었습니다.');
});

export { sendMailRouter };
