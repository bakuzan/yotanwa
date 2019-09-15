import { Request, Response } from 'express';

import { Tier } from '../models/tier';

export default async function saveTier(req: Request, res: Response) {
  const payload = req.body;

  // TODO
  // Validate payload

  try {
    const t = new Tier({ ...payload });
    const { id } = await t.save();

    res.status(200).json({ id });
  } catch (e) {
    const error = 'Failed to save tier';

    console.log(error);
    console.error(e);
    res.status(200).json({ error });
  }
}
