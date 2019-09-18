import React from 'react';

import { YTWLink } from '@/components/YTWLink';

type ErrorProps = {
  error: string;
};

function ErrorInPage({ error }: ErrorProps) {
  // TODO handler error
  return (
    <div className="page page--column">
      <div style={{ padding: 10 }}>{error}</div>
      <div style={{ padding: 10 }}>
        <YTWLink href="/characters">Return to character selection</YTWLink>
      </div>
    </div>
  );
}

export default ErrorInPage;
