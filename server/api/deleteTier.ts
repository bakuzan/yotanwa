import { Request, Response } from 'express';

import { Tier } from '../models/tier';

export default async function deleteTier(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const deleted = await Tier.findOneAndRemove(id);

    res.status(200).json({ message: `Deleted ${deleted.name}` });
  } catch (e) {
    const error = 'Failed to delete tier';

    console.log(error);
    console.error(e);
    res.status(200).json({ error });
  }
}
