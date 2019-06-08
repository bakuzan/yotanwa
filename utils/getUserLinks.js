import { sources } from '../consts';

export default function getUserLinks(source, username, type) {
  switch (source) {
    case sources.ANILIST:
      return {
        profile: `https://anilist.co/user/${username}`,
        list: `https://anilist.co/user/${username}/${type}list`
      };
    case sources.MAL:
      return {
        profile: `https://myanimelist.net/profile/${username}`,
        list: `https://myanimelist.net/${type}list/${username}`
      };
    default:
      return { profile: '', list: '' };
  }
}
