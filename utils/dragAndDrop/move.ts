import { DraggableLocation } from 'react-beautiful-dnd';
import { MovePayload } from '../../interfaces/MovePayload';

export default function move(
  source: any[],
  destination: any[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
): MovePayload[] {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const payload = [
    { key: droppableSource.droppableId, items: sourceClone },
    { key: droppableDestination.droppableId, items: destClone }
  ];

  return payload;
}
