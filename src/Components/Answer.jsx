
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
        />
      ):(
        <code {...props} className={className} >
          {children}
        </code>
      )

    }
  }

  return (
    <div>

      {
        index == 0 && TotalResult < 1 ? <span className="pt-2 block text-lg text-left">
          {answer}
        </span> : heading ? (
          <span className="pt-2 block text-lg text-left">
            {answer}
          </span>
        ) : (
          <span className={type == "q" ? 'pl-1' : 'pl-5'}>
            <ReactMarkdown components={Render}>{ans}</ReactMarkdown>
          </span>
        )
      }

    </div>
  );
};

export default memo(Answer);
