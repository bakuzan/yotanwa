import { Document } from 'mongoose';

export interface CharacterAssignmentModel extends Document {
  characterId: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'Unassigned';
}
