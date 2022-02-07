export default function getPageMeta(path: string, params: any) {
  if (path === '/') {
    return {
      description: `Search for a user on a chosen anime list site. This will generate tiers based on the scores given to the series within the user's list.`,
      title: `Search for a user's list | Tier List Generator | Yotanwa`
    };
  } else if (path === '/search') {
    const { username, source, type } = params;
    return {
      description: `Tier list generated using ${username}'s default ${source} ${type} list`,
      title: `${username}'s ${source} ${type} tier | Tier List Generator | Yotanwa`
    };
  } else if (path === '/characters') {
    return {
      description: 'Search for characters to use in creating a tier list.',
      title: 'Search for characters | Tier List Generator | Yotanwa'
    };
  } else if (path === '/character-tier') {
    return {
      description: 'Place the pre-selected characters into a tier.',
      title: 'Character tier | Tier List Generator | Yotanwa'
    };
  } else if (path.includes('/character-tiers')) {
    const { page = 1 } = params;
    return {
      description: `Page ${page} of created character tiers.`,
      title: `Character tiers, Page ${page} | Tier List Generator | Yotanwa`
    };
  }

  return {
    description: 'An application for creating anime/manga based tier lists.',
    title: 'Yotanwa'
  };
}
