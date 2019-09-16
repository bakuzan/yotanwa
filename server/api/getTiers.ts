import { Request, Response } from 'express';

import { Tier } from '../models/tier';

export async function getTiers(req: Request, res: Response) {
  const { page = 0, perPage = 10 } = req.query;

  // TODO
  // Validate query, put upper limit on page size

  try {
    const total = await Tier.count({});

    const items = await Tier.find()
      .sort({ name: 'asc' })
      .skip(page * perPage)
      .limit(perPage);

    res.status(200).json({ items, success: true, total });
  } catch (e) {
    const error = 'Failed to retreive tier';

    console.log(error);
    console.error(e);
    res.status(200).json({ error, success: false });
  }
}

export async function getTier(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const tier = await Tier.findById(id);

    if (tier !== null) {
      res.status(200).json({
        success: true,
        tier: tier.toJSON({ virtuals: true })
      });
    } else {
      res.status(200).json({ error: 'Tier not found.', success: false });
    }
  } catch (e) {
    const error = 'Failed to retreive tier';

    console.log(error);
    console.error(e);
    res.status(200).json({ error, success: false });
  }
}
