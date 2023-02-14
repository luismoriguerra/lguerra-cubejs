cube(`Gitarchive`, {
  sql: `SELECT * FROM public.gitarchive`,

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {},

  measures: {
    user_name: {
      sql: `${CUBE}.metadata->'actor'->>'login'`,
      type: `string`,
    },
    count: {
      type: `count`,
      drillMembers: [id],
    },
    count_username: {
      sql: `${CUBE}.metadata->'actor'->>'login'`,
      type: `countDistinct`,
    },
    count_repository_name: {
      sql: `${CUBE}.metadata->'repo'->>'name'`,
      type: `countDistinct`,
    },
  },

  dimensions: {
    username: {
      sql: `${CUBE}.metadata->'actor'->>'login'`,
      type: `string`,
    },
    repository_name: {
      sql: `${CUBE}.metadata->'repo'->>'name'`,
      type: `string`,
    },
    createdAt1: {
      sql: `${CUBE}.metadata->>'created_at'`,
      type: `time`,
    },
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    metadata: {
      sql: `metadata`,
      type: `string`,
    },
  },

  dataSource: `default`,
});
