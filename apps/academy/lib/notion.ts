import { cache } from "react";
import { NotionAPI } from "notion-client";
import { getCanonicalPageId, getPageTitle, parsePageId, uuidToId } from "notion-utils";
import type { ExtendedRecordMap } from "notion-types";

const DEFAULT_ROOT_PAGE_ID = "39371670189881a384bac9471a6c3e13";

let notionApi: NotionAPI | null = null;

function getNotionApi() {
  if (!notionApi) {
    notionApi = new NotionAPI();
  }

  return notionApi;
}

export function getAcademyRootPageId() {
  return parsePageId(process.env.NOTION_PAGE_ID || DEFAULT_ROOT_PAGE_ID) || DEFAULT_ROOT_PAGE_ID;
}

export function getPublicNotionUrl(pageId: string) {
  const compactId = uuidToId(parsePageId(pageId) || pageId);
  return `https://www.notion.so/${compactId}`;
}

export function mapNotionPageUrl(pageId: string) {
  return `/p/${uuidToId(pageId)}`;
}

export const getPageRecordMap = cache(async (pageId: string) => {
  const notion = getNotionApi();
  const normalizedPageId = parsePageId(pageId) || pageId;
  return notion.getPage(normalizedPageId);
});

export function getRendererPageId(recordMap: ExtendedRecordMap, pageId: string) {
  return getCanonicalPageId(pageId, recordMap) || parsePageId(pageId) || pageId;
}

export function getRendererPageTitle(recordMap: ExtendedRecordMap) {
  return getPageTitle(recordMap) || "五力教練學院";
}
