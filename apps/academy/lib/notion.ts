import { cache } from "react";
import { NotionAPI } from "notion-client";
import { getCanonicalPageId, getPageTitle, parsePageId, uuidToId } from "notion-utils";
import type { Block, ExtendedRecordMap } from "notion-types";

const DEFAULT_ROOT_PAGE_ID = "39371670189881a384bac9471a6c3e13";
const START_HERE_PAGE_ID = "39371670189881fb9e3ee58aef6f92e8";
const POWERS_PAGE_ID = "39371670189881e2b959c4ecdba751d5";
const JOURNEY_PAGE_ID = "39371670189881dfa9d9e43678df080c";
const TOOLS_PAGE_ID = "393716701898816795c5e0fd8a00c61c";
const SOP_DATABASE_PAGE_ID = "df837947094d4657986a4365adf0b5ab";
const TOOL_DATABASE_PAGE_ID = "b4011e5883ea4d9db3cb0169d2ff1349";

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

export function getRendererPageLastEdited(recordMap: ExtendedRecordMap, pageId: string) {
  const block = getBlockValue(recordMap, normalizeId(pageId));
  return block?.last_edited_time || null;
}

type SimpleLink = {
  title: string;
  pageId: string;
  href: string;
};

type RoleCard = {
  title: string;
  description: string;
};

type PowerCard = {
  title: string;
  description: string;
  pageId: string;
  href: string;
};

type JourneyCard = {
  title: string;
  description: string;
  pageId?: string;
  href?: string;
};

type SopItem = {
  title: string;
  status: string;
  phase: string;
  powers: string[];
  audiences: string[];
  websitePublic: boolean;
  href: string;
};

type ResourceItem = {
  title: string;
  status: string;
  type: string;
  purpose: string;
  powers: string[];
  audiences: string[];
  containsPersonalData: boolean;
  websitePublic: boolean;
  href: string;
  officialUrl?: string;
};

function normalizeId(pageId: string) {
  return parsePageId(pageId) || pageId;
}

function getBlockValue(recordMap: ExtendedRecordMap, blockId: string) {
  const blockWrapper = recordMap.block?.[blockId] as
    | { value?: { value?: Block; role?: string }; role?: string }
    | undefined;

  return (blockWrapper?.value as { value?: Block } | undefined)?.value || null;
}

function getRootBlock(recordMap: ExtendedRecordMap, pageId: string) {
  return getBlockValue(recordMap, normalizeId(pageId));
}

function readPropertyValue(block: Block | null, key: string) {
  const value = (block?.properties as Record<string, Array<Array<string>>> | undefined)?.[key];

  if (!value) {
    return "";
  }

  return value
    .map((entry) => (Array.isArray(entry) ? entry[0] : ""))
    .filter(Boolean)
    .join(" ");
}

function getSchemaNameMap(recordMap: ExtendedRecordMap, collectionId: string) {
  const schema =
    (recordMap.collection?.[collectionId] as
      | { value?: { value?: { schema?: Record<string, { name: string }> } } }
      | undefined)?.value?.value?.schema || {};

  return Object.fromEntries(Object.entries(schema).map(([key, value]) => [key, value.name]));
}

function extractHeadingParagraphPairs(recordMap: ExtendedRecordMap, pageId: string) {
  const rootBlock = getRootBlock(recordMap, pageId);
  const contentIds = rootBlock?.content || [];
  const pairs: Array<{ heading: string; paragraph: string }> = [];

  for (let index = 0; index < contentIds.length; index += 1) {
    const block = getBlockValue(recordMap, contentIds[index]);

    if (!block) {
      continue;
    }

    if (block.type === "header" || block.type === "sub_header") {
      const heading = readPropertyValue(block, "title");
      const nextBlock = getBlockValue(recordMap, contentIds[index + 1]);
      const paragraph = nextBlock ? readPropertyValue(nextBlock, "title") : "";

      if (heading && paragraph) {
        pairs.push({ heading, paragraph });
      }
    }
  }

  return pairs;
}

function extractChildPageLinks(recordMap: ExtendedRecordMap, pageId: string) {
  const rootBlock = getRootBlock(recordMap, pageId);
  const contentIds = rootBlock?.content || [];
  const pages: SimpleLink[] = [];

  for (const childId of contentIds) {
    const childBlock = getBlockValue(recordMap, childId);

    if (childBlock?.type === "page") {
      const normalizedPageId = normalizeId(childBlock.id);
      pages.push({
        title: readPropertyValue(childBlock, "title"),
        pageId: normalizedPageId,
        href: mapNotionPageUrl(normalizedPageId),
      });
    }
  }

  return pages;
}

function extractLeadParagraph(recordMap: ExtendedRecordMap, pageId: string) {
  const rootBlock = getRootBlock(recordMap, pageId);
  const contentIds = rootBlock?.content || [];

  for (let index = 0; index < contentIds.length; index += 1) {
    const block = getBlockValue(recordMap, contentIds[index]);

    if (!block) {
      continue;
    }

    if (block.type === "text") {
      const text = readPropertyValue(block, "title");

      if (text) {
        return text;
      }
    }
  }

  return "";
}

function splitCsvValue(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractCollectionRows(recordMap: ExtendedRecordMap, collectionId: string) {
  const query = recordMap.collection_query?.[collectionId] as
    | Record<string, { collection_group_results?: { blockIds?: string[] } }>
    | undefined;

  if (!query) {
    return [];
  }

  const schemaNameMap = getSchemaNameMap(recordMap, collectionId);
  const firstView = Object.values(query)[0];
  const blockIds = firstView?.collection_group_results?.blockIds || [];

  return blockIds
    .map((blockId) => getBlockValue(recordMap, blockId))
    .filter(Boolean)
    .map((block) => {
      const properties = (block?.properties as Record<string, Array<Array<string>>> | undefined) || {};
      const mapped = Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [
          schemaNameMap[key] || key,
          value.map((entry) => (Array.isArray(entry) ? entry[0] : "")).filter(Boolean).join(" "),
        ]),
      );

      return {
        id: normalizeId(block!.id),
        title: mapped["SOP 名稱"] || mapped["資源名稱"] || "",
        properties: mapped,
      };
    });
}

export const getAcademyHomepageData = cache(async () => {
  const [
    rootRecordMap,
    startHereRecordMap,
    powersRecordMap,
    journeyRecordMap,
    toolsRecordMap,
    sopDatabaseRecordMap,
    toolDatabaseRecordMap,
  ] = await Promise.all([
    getPageRecordMap(getAcademyRootPageId()),
    getPageRecordMap(START_HERE_PAGE_ID),
    getPageRecordMap(POWERS_PAGE_ID),
    getPageRecordMap(JOURNEY_PAGE_ID),
    getPageRecordMap(TOOLS_PAGE_ID),
    getPageRecordMap(SOP_DATABASE_PAGE_ID),
    getPageRecordMap(TOOL_DATABASE_PAGE_ID),
  ]);

  const powerIndexPages = extractChildPageLinks(powersRecordMap, POWERS_PAGE_ID);
  const powerPages = await Promise.all(
    powerIndexPages.map(async (item) => ({
      ...item,
      recordMap: await getPageRecordMap(item.pageId),
    })),
  );

  const rootLinks = extractChildPageLinks(rootRecordMap, getAcademyRootPageId()).filter(
    (item) => item.title && item.title !== "99｜封存區",
  );

  const publicRoleNames = new Set(["一般夥伴", "準教練", "正式教練", "總教練"]);
  const roles: RoleCard[] = extractHeadingParagraphPairs(startHereRecordMap, START_HERE_PAGE_ID)
    .filter((item) => publicRoleNames.has(item.heading))
    .map((item) => ({ title: item.heading, description: item.paragraph }));

  const powers: PowerCard[] = powerPages.map((item) => ({
    title: item.title,
    description: extractLeadParagraph(item.recordMap, item.pageId),
    pageId: item.pageId,
    href: item.href,
  }));

  const journeyCards: JourneyCard[] = [
    ...extractHeadingParagraphPairs(journeyRecordMap, JOURNEY_PAGE_ID).map((item) => ({
      title: item.heading,
      description: item.paragraph,
    })),
    ...extractChildPageLinks(journeyRecordMap, JOURNEY_PAGE_ID).map((item) => ({
      title: item.title,
      description: "",
      pageId: item.pageId,
      href: item.href,
    })),
  ];

  const sopItems: SopItem[] = extractCollectionRows(sopDatabaseRecordMap, "ff114f07-c1cc-4863-a9bf-624eb9b577b7").map(
    (row) => ({
      title: row.title,
      status: row.properties["狀態"] || "未設定",
      phase: row.properties["90天階段"] || "未設定",
      powers: splitCsvValue(row.properties["五力分類"] || ""),
      audiences: splitCsvValue(row.properties["適用對象"] || ""),
      websitePublic: row.properties["網站公開"] === "Yes",
      href: mapNotionPageUrl(row.id),
    }),
  );

  const resourceItems: ResourceItem[] = extractCollectionRows(
    toolDatabaseRecordMap,
    "f562e243-ee41-420d-80dc-9a2e156c0200",
  ).map((row) => ({
    title: row.title,
    status: row.properties["狀態"] || "未設定",
    type: row.properties["類型"] || "未分類",
    purpose: row.properties["用途"] || "",
    powers: splitCsvValue(row.properties["五力分類"] || ""),
    audiences: splitCsvValue(row.properties["適用對象"] || ""),
    containsPersonalData: row.properties["是否含個資"] === "Yes",
    websitePublic: row.properties["網站公開"] === "Yes",
    href: mapNotionPageUrl(row.id),
    officialUrl: row.properties["正式連結"] || undefined,
  }));

  const faq = [
    {
      question: "五力結果是不是代表我只能做那一類？",
      answer: "不是。五力是較適合投入的位置與分工起點，不是人格標籤，也不是把人固定住的盒子。",
    },
    {
      question: "問卷結果能不能直接當教練認證？",
      answer: "不能。問卷只做探索，正式養成仍要經過基礎課、實習、督導與後續認證流程。",
    },
    {
      question: "哪些內容會公開在 academy？",
      answer: "公開站只放已審核、適合對外與團隊共讀的內容；個人分數、個案筆記與含個資資料不公開。",
    },
    {
      question: "總教練的角色是什麼？",
      answer: "總教練不是全部都自己教，而是負責整合進度、安排接力、媒合適合的專項教練，確保個案不中斷。",
    },
  ];

  return {
    rootLinks,
    roles,
    powers,
    journeyCards,
    sopItems,
    resourceItems,
    faq,
  };
});
