cube(`GithubEvents`, {
  sql: `SELECT * FROM public.github_events`,
  preAggregations: {// Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started

    main: {
      measures: [GithubEvents.count],
      dimensions: [GithubEvents.repoName],
      timeDimension: GithubEvents.createdAt,
      granularity: `day`
    }
  },
  joins: {},
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, repoName, commitId, createdAt, prOrIssueCreatedAt]
    },
    number: {
      sql: `number`,
      type: `sum`
    }
  },
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    prMerged: {
      sql: `pr_merged`,
      type: `string`
    },
    orgLogin: {
      sql: `org_login`,
      type: `string`
    },
    state: {
      sql: `state`,
      type: `string`
    },
    creatorUserLogin: {
      sql: `creator_user_login`,
      type: `string`
    },
    type: {
      sql: `type`,
      type: `string`
    },
    repoName: {
      sql: `repo_name`,
      type: `string`
    },
    actorLogin: {
      sql: `actor_login`,
      type: `string`
    },
    language: {
      sql: `language`,
      type: `string`
    },
    action: {
      sql: `action`,
      type: `string`
    },
    commitId: {
      sql: `commit_id`,
      type: `string`
    },
    createdAt: {
      sql: `created_at`,
      type: `time`
    },
    prOrIssueCreatedAt: {
      sql: `pr_or_issue_created_at`,
      type: `time`
    },
    closedAt: {
      sql: `closed_at`,
      type: `time`
    },
    prMergedAt: {
      sql: `pr_merged_at`,
      type: `time`
    },
    eventDay: {
      sql: `event_day`,
      type: `time`
    },
    eventMonth: {
      sql: `event_month`,
      type: `time`
    }
  },
  dataSource: `default`
});