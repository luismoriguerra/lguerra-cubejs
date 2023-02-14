cube(`BotYear`, {
  sql: `WITH bots_with_first_seen AS (
        SELECT
            actor_login, MIN(EXTRACT(YEAR FROM created_at)) AS first_seen_at
        FROM github_events ge
        WHERE
            actor_login ~ '^(bot-.+|.+bot|.+\\[bot\\]|.+-bot-.+|robot-.+|.+-ci-.+|.+-ci|.+-testing|.+clabot.+|.+-gerrit|k8s-.+|.+-machine|.+-automation|github-.+|.+-github|.+-service|.+-builds|codecov-.+|.+teamcity.+|jenkins-.+|.+-jira-.+)$'
        GROUP BY actor_login
        ORDER BY first_seen_at
    ),  acc AS (
        SELECT
            COUNT(actor_login) OVER (ORDER BY first_seen_at) AS cnt,
            first_seen_at AS event_year
        FROM
            bots_with_first_seen AS bwfs
        ORDER BY event_year
    )
    SELECT 
    count(cnt) AS bots_total, event_year
    FROM acc
    GROUP BY event_year
    ORDER BY event_year`,
  preAggregations: {
    bots_years: {
      dimensions: [BotYear.botsTotal, BotYear.eventYear]
    }
  },
  joins: {},
  measures: {
    count: {
      type: `count`,
      drillMembers: [eventYear, botsTotal]
    }
  },
  dimensions: {
    eventYear: {
      sql: `event_year`,
      type: `number`
    },
    botsTotal: {
      sql: `bots_total`,
      type: `number`
    }
  }
});