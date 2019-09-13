import { Sources } from '../consts';

export default function getUserLinks(
  source: string,
  username: string,
  type: string
) {
  switch (source) {
    case Sources.ANILIST:
      return {
        list: `https://anilist.co/user/${username}/${type}list`,
        profile: `https://anilist.co/user/${username}`
      };
    case Sources.MAL:
      return {
        list: `https://myanimelist.net/${type}list/${username}`,
        profile: `https://myanimelist.net/profile/${username}`
      };
    default:
      return { list: '', profile: '' };
  }
}
