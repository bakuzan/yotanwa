import { Router } from 'express';

import deleteTier from './deleteTier';
import { getTier, getTiers } from './getTiers';
import saveTier from './saveTier';
import searchCharacters from './searchCharacters';

const router = Router();

router.get('/characters', searchCharacters);

router.get('/tiers', getTiers);
router.get('/tier/:id', getTier);
router.post('/tier', saveTier);
router.delete('/tier/:id', deleteTier);

export default router;
