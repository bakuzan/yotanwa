import React from 'react';

import { YTWCharacter } from '@/interfaces/YTWCharacter';
import { CharacterCardDraggable } from '@/components/CharacterCard';

function CharacterList({ items, showNoItemsEntry }) {
  if (!items.length && showNoItemsEntry) {
    return <li>Drop a character here to unrank.</li>;
  }

  return items.map((x: YTWCharacter, i: number) => (
    <CharacterCardDraggable key={x.id} index={i} data={x} />
  ));
}

CharacterList.defaultProps = {
  showNoItemsEntry: true
};

export default CharacterList;
