import { Model, model, Schema } from 'mongoose';

import { TierModel } from '../../interfaces/TierModel';

export const CharacterAssignmentSchema: Schema = new Schema(
  {
    assignment: { type: String, required: true },
    characterId: { type: Number, required: true }
  },
  { id: false, _id: false, timestamps: false }
);

export const TierSchema: Schema = new Schema(
  {
    characterState: {
      default: [],
      type: [CharacterAssignmentSchema]
    },
    name: { type: String, required: true }
  },
  {
    id: true,
    timestamps: true
  }
);

export const Tier: Model<TierModel> = model<TierModel>('Tier', TierSchema);
