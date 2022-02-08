import { Request, Response } from 'express';

import { Tier } from '../models/tier';

export async function getTiers(req: Request, res: Response) {
  const { page = 1, perPage = 10 } = req.query;
  const index = Number(page) - 1;
  const pageSize = Math.min(Number(perPage), 25);
  const skipping = index * pageSize;

  try {
    const total = await Tier.countDocuments({});

    const items = await Tier.find()
      .select({ id: 1, name: 1 })
      .sort({ name: 'asc' })
      .skip(skipping)
      .limit(pageSize);

    const hasPrevPage = index !== 0;
    const hasNextPage = skipping + pageSize <= total;
    console.log({ hasPrevPage, hasNextPage, items, success: true, total });
    res
      .status(200)
      .json({ hasPrevPage, hasNextPage, items, success: true, total });
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
      const tt = tier.toJSON();

      res.status(200).json({
        success: true,
        tier: tt
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
