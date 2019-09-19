import React, { useState, useRef } from 'react';

import { Button } from 'meiko/Button';

import './CopyToClipboard.scss';

const CLIPBOARD = `\uD83D\uDCCB\uFE0E`;

interface CopyToClipboardProps {
  text: string;
  name: string;
}

function CopyToClipboard({ text, name }: CopyToClipboardProps) {
  const timer = useRef<number>(0);
  const [show, setShow] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setShow(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShow(false), 500);
    } catch {
      // TODO
      // Handle?
    }
  }

  return (
    <div className="copy-to-clipboard">
      {show && (
        <div className="copy-to-clipboard__message">Copied to clipboard</div>
      )}
      <Button
        className="copy-to-clipboard__button"
        title={`Copy ${name} to clipboard`}
        aria-label={`Copy ${name} to clipboard`}
        icon={CLIPBOARD}
        onClick={copy}
      />
    </div>
  );
}

export default CopyToClipboard;
