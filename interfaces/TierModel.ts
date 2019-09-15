import { Document } from 'mongoose';

import { CharacterAssignmentModel } from './CharacterAssignmentModel';

export interface TierModel extends Document {
  characterState: CharacterAssignmentModel[];
  name: string;
}
