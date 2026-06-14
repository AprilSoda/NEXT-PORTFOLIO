import { Client } from "@notionhq/client";

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
  const dataSourceId = await getDataSourceId(databaseId);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
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
  return response.results;
};

export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId) => {
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