import { Router } from 'express';

import deleteTier from './deleteTier';
import { getTier, getTiers } from './getTiers';
import saveTier from './saveTier';
import searchCharacters from './searchCharacters';
import searchSeries from './searchSeries';
import fetchSeriesCharacters from './seriesCharacters';

const router = Router();

// Anilist
router.get('/characters', searchCharacters);
router.get('/series', searchSeries);
router.get('/seriescharacters/:id', fetchSeriesCharacters);

// Tiers
router.get('/tiers', getTiers);
router.get('/tier/:id', getTier);
router.post('/tier', saveTier);
router.delete('/tier/:id', deleteTier);

export default router;
