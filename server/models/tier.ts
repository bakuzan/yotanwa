import { Document, Model, model, Schema } from 'mongoose';

export interface CharacterAssignment extends Document {
  characterId: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'Unassigned';
}

export const CharacterAssignmentSchema: Schema = new Schema(
  {
    assignment: { type: String, required: true },
    characterId: { type: Number, required: true }
  },
  { id: false, _id: false, timestamps: false }
);

export interface TierModel extends Document {
  characterState: CharacterAssignment[];
  name: string;
}

export const TierSchema: Schema = new Schema(
  {
    characterState: {
      default: [],
      type: [CharacterAssignmentSchema]
    },
    name: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const Tier: Model<TierModel> = model<TierModel>('Tier', TierSchema);
