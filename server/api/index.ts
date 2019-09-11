import { Router } from 'express';

import searchCharacters from './searchCharacters';

const router = Router();

router.get('/characters', searchCharacters);

export default router;
