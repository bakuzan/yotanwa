export default function getPageMeta(path, params) {
  if (path === '/') {
    return {
      title: "Search for a user's list | Tier List Generator",
      description:
        "Search for a user on a chosen anime list site. This will generate tiers based on the scores given to the series within the user's list."
    };
  } else if (path === '/search') {
    const { username, source, type } = params;
    return {
      title: `${username}'s ${source} ${type} tier | Tier List Generator`,
      description: `Tier list generated using ${username}'s default ${source} ${type} list`
    };
  } else if (path === '/characters') {
    return {
      title: 'Search for characters | Tier List Generator',
      description: 'Search for characters to use in creating a tier list.'
    };
  } else if (path === '/character-tier') {
    return {
      title: 'Character tier | Tier List Generator',
      description: 'Place the pre-selected characters into a tier.'
    };
  }

  return { title: '', description: '' };
}
