import { SearchTypes } from '@/consts';
import { Request, Response } from 'express';

export default function createHandler(fn: (user: string, type: string) => any) {
  return async function handler(req: Request, res: Response) {
    const respond = (a: any) => res.status(200).json(a);
    const { username: user, type = SearchTypes.ANIME } = req.query;

    if (!user) {
      respond({ error: 'Username is required.', items: [] });
    }

    try {
      const { items, error } = await fn(user, type);

      respond({ error, items });
    } catch (error) {
      console.error(error);
      respond({
        error: `Something went wrong and your request could not be completed.`,
        items: []
      });
    }
  };
}
