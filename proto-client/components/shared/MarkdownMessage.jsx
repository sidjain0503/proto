import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, children }) {
          return inline ? (
            <code className="px-1 py-0.5 rounded bg-black/10 text-sm">
              {children}
            </code>
          ) : (
            <pre className="rounded bg-black/10 p-3 overflow-x-auto text-sm">
              <code>{children}</code>
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
