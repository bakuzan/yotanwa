import React from 'react';

import { NewTabLink } from './YTWLink';

function Footer() {
  return (
    <footer className="footer">
      <NewTabLink href="https://myanimelist.net/character/66701/Yang_Duanhe">
        who is Yo Tan Wa?
      </NewTabLink>
      |<NewTabLink href="https://github.com/bakuzan/yotanwa">github</NewTabLink>
      |
      <NewTabLink href="https://github.com/Qnnie/AnimeTierList">
        inspired by
      </NewTabLink>
    </footer>
  );
}

Footer.displayName = 'Footer';

export default Footer;
