import { Request, Response } from 'express';

import { Tier } from '../models/tier';

export default async function saveTier(req: Request, res: Response) {
  const errors = [];
  const payload = req.body;

  if (!payload.name || !payload.name.trim()) {
    errors.push('Tier name is required.');
  }

  if (!payload.characterState || !payload.characterState.length) {
    errors.push('Tier requires at least 1 character.');
  }

  if (errors.length) {
    const error = errors[0];
    res.status(200).json({ error, success: false });
  }

  try {
    let itemId = null;

    // Update or Create
    if (payload.id) {
      await Tier.findByIdAndUpdate(payload.id, payload);
    } else {
      const t = new Tier(payload);
      const { id } = await t.save();
      itemId = id;
    }

    res.status(200).json({ id: itemId, success: true });
  } catch (e) {
    const error = `${e.message ? e.message : 'Failed to save tier'}.`;

    console.log(error);
    console.error(e);
    res.status(200).json({ error, success: false });
  }
}
