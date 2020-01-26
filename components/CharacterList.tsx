import React from 'react';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCardDraggable } from '@/components/CharacterCard';

interface CharacterListProps {
  items: YTWCharacter[];
  showNoItemsEntry?: boolean;
}

function CharacterList({ items, showNoItemsEntry }: CharacterListProps) {
  if (!items.length && showNoItemsEntry) {
    return <li style={{ padding: 10 }}>Drop a character here to unrank.</li>;
  }

  return (
    <React.Fragment>
      {items.map((x: YTWCharacter, i: number) => (
        <CharacterCardDraggable key={x.id} index={i} data={x} />
      ))}
    </React.Fragment>
  );
}

CharacterList.defaultProps = {
  showNoItemsEntry: true
};

export default CharacterList;
