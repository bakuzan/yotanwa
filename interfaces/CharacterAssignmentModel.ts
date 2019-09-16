import { Document } from 'mongoose';

export interface CharacterAssignmentModel extends Document {
  characterId: number;
  assignment: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'Unassigned';
}
