import ReactMarkdown from 'react-markdown';

interface ChatMessageContentProps {
  content: string;
  isAi: boolean;
}

const ChatMessageContent = ({ content, isAi }: ChatMessageContentProps) => {
  if (!isAi) {
    return <p className="leading-relaxed whitespace-pre-wrap">{content}</p>;
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <pre className="bg-muted rounded-lg p-3 overflow-x-auto my-2">
                  <code className={`text-xs font-mono text-foreground ${className || ''}`} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground" {...props}>
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessageContent;
