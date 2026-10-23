
import React, { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Test, Result } from '../Test';

const Answer = ({ ans, index, TotalResult, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (Test(ans)) {
      setHeading(true);
      setAnswer(Result(ans));
    }
  }, []);

  const Render = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "")
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, '')}
          language={match[1]}
          style={dark}
          PreTag={"div"}
          customStyle={{
            maxWidth: '100%',
            overflowX: 'auto',
            whiteSpace: 'pre',
            fontSize: 'clamp(12px, 2vw, 14px)',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
          wrapLongLines={false}
        />
      ):(
        <code
          {...props}
          className={`${className || ''} break-words`}
        >
          {children}
        </code>
      )

    }
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-wrap-anywhere text-left">

      {
        index == 0 && TotalResult < 1 ? <span className="block max-w-full pt-2 text-left text-sm leading-6 break-words sm:text-base md:text-lg">
          {answer}
        </span> : heading ? (
          <span className="block max-w-full pt-2 text-left text-sm leading-6 break-words sm:text-base md:text-lg">
            {answer}
          </span>
        ) : (
          <span className={`block min-w-0 max-w-full text-sm leading-6 break-words sm:text-base md:text-lg ${type == "q" ? 'pl-1' : 'pl-3 sm:pl-5'}`}>
            <ReactMarkdown components={Render}>{ans}</ReactMarkdown>
          </span>
        )
      }

    </div>
  );
};

export default memo(Answer);
