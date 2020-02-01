declare module 'mal-scraper' {
  interface MalItem {
    [key: string]: any;
  }

  interface MalScraper {
    getWatchListFromUser: (
      user: string,
      offset: number,
      type: string
    ) => Promise<MalItem[]>;
  }

  const scraper: MalScraper;

  export = scraper;
}
