"use client";

import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/third-party/code";
import { Collection } from "react-notion-x/third-party/collection";
import type { ExtendedRecordMap } from "notion-types";
import { getRendererPageId, mapNotionPageUrl } from "../lib/notion";

export function AcademyNotionPage({
  pageId,
  recordMap,
}: {
  pageId: string;
  recordMap: ExtendedRecordMap;
}) {
  return (
    <div className="notion-frame">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        rootPageId={getRendererPageId(recordMap, pageId)}
        mapPageUrl={mapNotionPageUrl}
        components={{
          Code,
          Collection,
        }}
        showTableOfContents
        minTableOfContentsItems={3}
        defaultPageIcon="🎯"
      />
    </div>
  );
}
