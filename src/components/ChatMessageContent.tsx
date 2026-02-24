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
    <div className="max-w-none text-foreground text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5 [&_p]:my-1 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:font-semibold [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold">
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
