import CodexMarkdownView from "./CodexMarkdownView";

/** @param {{ doc: import("@/lib/circulaiEgorBrand").CirculaiKitDocMeta }} props */
export default function CirculaiKitDoc({ doc }) {
  return (
    <CodexMarkdownView
      slug={doc.id}
      variant="circulai"
      docFile={doc.file}
      title={doc.pageTitle}
      description={doc.description}
      canonicalPath={doc.path}
      disclaimerVariant="default"
    />
  );
}
