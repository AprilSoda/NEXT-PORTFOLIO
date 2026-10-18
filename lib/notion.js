import { Client } from "@notionhq/client";
import * as mock from "./mock/notion-fixtures";

// NOTION_MOCK=1 serves sample rows instead of calling Notion (no token needed)
const MOCK = process.env.NOTION_MOCK === "1";

// Database ids, in one place (mock mode works without them)
export const WORKS_DB = process.env.NOTION_DATABASE_ID || (MOCK ? "mock-works" : undefined);
export const JOURNAL_DB = process.env.NOTION_DATABASE_ID2 || (MOCK ? "mock-journal" : undefined);

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Notion API 2025-09-03 split databases into data sources. Querying now targets a
// data_source_id, which we resolve (and cache) from the database id.
const dataSourceCache = new Map();

const getDataSourceId = async (databaseId) => {
  if (dataSourceCache.has(databaseId)) {
    return dataSourceCache.get(databaseId);
  }
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const dataSourceId = database.data_sources?.[0]?.id || databaseId;
  dataSourceCache.set(databaseId, dataSourceId);
  return dataSourceId;
};

export const getDatabase = async (databaseId) => {
  if (MOCK) return databaseId === JOURNAL_DB ? mock.journal : mock.works;
  const dataSourceId = await getDataSourceId(databaseId);
  // Queries return at most 100 rows per page, so follow the cursor
  const results = [];
  let cursor;
  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      filter: {
        property: "pub",
        checkbox: {
          equals: true
        }
      },
      sorts: [
        {
          property: "date",
          direction: "descending"
        },
      ]
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return results;
};

export const getPage = async (pageId) => {
  if (MOCK) return mock.works.find((p) => p.id === pageId) || mock.works[0];
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId) => {
  if (MOCK) return mock.blocks;
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};