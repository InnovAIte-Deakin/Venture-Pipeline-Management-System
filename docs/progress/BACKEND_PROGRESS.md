**VPMS Weekly Progress – Backend Stream**

Trimester 2, 2026

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>Purpose: This document records the Backend stream’s planned work, completed work, technical findings, and carry-over items for each sprint. It is maintained by the Backend Lead with support from the Documentation stream.</p>
<p>Every item recorded as completed has been verified against the repository before being entered, and the evidence column names the commit, pull request or branch that proves it. Work that was delivered but has not reached main is recorded as delivered, not as completed.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**Backend Stream Scope**

The Backend stream is responsible for the VPMS server side: the Payload CMS application and the Next.js API layer, authentication and role-based access control, the venture and document workflows, reporting and analytics endpoints, database and environment configuration, automated testing, and the continuous integration and deployment path to production. The stream also owns the API contract with the Frontend stream and the backend section of the handover pack.

**Main Technologies**

1.  Next.js API routes and TypeScript (the miv application)

2.  Payload CMS with the Mongoose adapter and MongoDB (the miv-backend application)

3.  Prisma with PostgreSQL (the miv application)

4.  NextAuth for session handling in miv; Payload authentication in miv-backend

5.  Vitest and the Node built-in test runner — both are currently configured (see findings)

6.  GitHub for branches, pull requests and code review; GitHub Actions for continuous integration

7.  Vercel as the intended deployment platform

8.  Nodemailer and SMTP for transactional email

**Backend Team Structure**

Seventeen members and two leads, organised into five squads. Each squad names a senior point person who reports status at the weekly stream meeting.

| **Squad**             | **Size** | **Main Ownership**                                                                                                                                 | **Expected Output**                                                                                                                |
|-----------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| API & Integration     | 4        | API contracts with the Frontend stream, endpoint delivery, page-by-page cutover from mock to live data, notifications backend.                     | Complete frontend integration with Payload CMS and the REST APIs; a canonical API contract; no mock data outside a dev flag.       |
| Auth, RBAC & Security | 3–4      | Authentication flows including Google SSO, the RBAC matrix and its enforcement, server-side validation, security hardening.                        | RBAC strengthened across all roles and workflows; improved authentication and validation; role-based data visibility at API level. |
| Venture Workflows     | 4        | Document submission and review lifecycle, venture creation, diagnostics, reporting and KPIs, funding tracker, GEDSI schema.                        | Document submission, review, diagnostics and reporting workflows finalised.                                                        |
| Testing & QA          | 3        | Test strategy, automated API and end-to-end suites, regression, deployed-environment testing, security test pass, sign-off.                        | Expanded automated testing for APIs, business logic and security features.                                                         |
| DevOps & Platform     | 3        | Docker and local environment, seeding, database decision and reliability, CI/CD, Vercel staging and production, email infrastructure, performance. | Backend performance and deployment optimised; Vercel hosting finalised; database and seeding issues resolved.                      |

**June Choi (Lead)** — owns the plan, API contract sign-off, liaison with the Frontend leads (Kent Ngo, Akhileshwar Velijarla) and the Product Owner, sprint planning and unblocking; floats across squads.

**Abhishek Kotadiya (Co-lead)** — owns Planner hygiene, the pull-request review flow, DevOps and release oversight, liaison with the Documentation leads (Eithan Omidvararallouy, Aakash Chiragkumar Shah) and meeting cadence; floats across squads.

**Sprint Calendar and Milestones**

*The Planner workbook numbers weeks from the start of Sprint 1, so its labels do not match the trimester week numbers used here. Explicit dates are printed throughout to avoid the ambiguity.*

| **Sprint** | **Trimester weeks** | **Dates**                             | **Milestone**                                                                          |
|------------|---------------------|---------------------------------------|----------------------------------------------------------------------------------------|
| Onboarding | Weeks 1–2           | 6 – 19 July 2026 (kickoff 18–19 July) | —                                                                                      |
| Sprint 1   | Weeks 3–4           | 20 July – 2 August 2026               | Sprint 1 review and retro (#31)                                                        |
| Sprint 2   | Weeks 5–6           | 3 – 16 August 2026                    | Sprint 2 review and retro (#47)                                                        |
| Sprint 3   | Weeks 7–8           | 17 – 30 August 2026                   | Feature complete — Sunday 30 August (#61)                                              |
| Sprint 4   | Weeks 9–10          | 31 August – 13 September 2026         | Feature freeze — Friday 11 September (#71)                                             |
| Sprint 5   | Weeks 11–12         | 14 – 27 September 2026                | Code freeze Friday 18 September (#74); handover and showcase Sunday 27 September (#81) |

**Onboarding — Weeks 1 to 2 (6 – 19 July 2026)**

**Planned**

9.  Review the previous trimester’s backend handover, unfinished work and known issues.

10. Meet the Product Owner and Company Director to confirm project history and the T2 2026 direction.

11. Send a skills and availability survey to all members and allocate them into squads from the results.

12. Verify that every member can reach the GitHub repository, the backend Teams channel and the Planner plan.

13. Create the Planner plan with buckets, squad labels and naming conventions.

14. Draft the VPMS section of the 2.1P Company Objectives and Structure document for the Backend stream.

15. Establish the weekly stream meeting, the reporting cadence and the branch and review process.

**Completed**

16. Held the team meeting with the Product Owner and Company Director, covering project history, previous sprint progress and this trimester’s direction.

17. Drafted the VPMS section of the 2.1P Company Objectives and Structure document for the Backend stream.

18. Reviewed the Trimester 1 handover and identified the technical debt that had to be addressed before new feature work (recorded in the findings table below).

19. Allocated seventeen members and two leads into five squads, balancing seniors and juniors, and named a point person for each.

20. Confirmed the split of lead responsibilities between the Lead and Co-lead and recorded it in the Planner.

21. Built the backend Planner workbook: eighty-one tasks across five sprints, each with a squad, a checklist, a priority, an effort estimate and its dependencies.

22. Established the contribution process — work on a branch, raise a pull request into main, Lead reviews and merges — and the rule that no member’s reported deliverable is recorded until it has been verified against the repository.

23. Opened the backend member activity log as the stream’s record of contributions and Lead verification, for the Documentation stream.

**Technical Findings Identified During Onboarding**

*These are inherited Trimester 1 conditions, recorded at the start of the trimester so that progress against them can be measured.*

| **Area**               | **Finding**                                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authentication         | Two independent mechanisms are in use — NextAuth in the miv application and Payload authentication in miv-backend — with no single source of truth for a user session.           |
| Database               | The system runs two databases: Prisma with PostgreSQL in miv, and MongoDB through the Mongoose adapter in miv-backend. Core entities are duplicated across both.                 |
| API security           | Most API route files carry no session check. Several contain a session check that has been commented out rather than removed.                                                    |
| Secrets                | Environment files containing credentials are tracked in the repository, and there is no root .gitignore to prevent it recurring.                                                 |
| Continuous integration | The only workflow in the repository is a fork-sync workflow inherited from a previous trimester. No pull request is linted, type-checked or built automatically.                 |
| Seeding and setup      | Database seeding and root administrator creation were flagged as unfinished at handover. Setup instructions are scattered and Windows installation fails on a native dependency. |
| Document flow          | The document upload and review path is flagged in the handover as the most important unstable area of the product.                                                               |
| Testing                | No test harness, no test scripts and no coverage. Nothing gates a merge.                                                                                                         |
| Open pull requests     | A backlog of pull requests dating from April and May was inherited unresolved, obscuring which work is actually current.                                                         |
| Architecture ownership | Backend and frontend responsibilities overlap in the miv application, so the same data is reachable through more than one route with different rules.                            |

**Ready to Carry into Sprint 1**

24. Confirm ticket ownership against the assigned squads.

25. Every member runs the full stack locally and logs each blocker encountered.

26. Confirm the canonical branch and the package manager for each application.

27. Begin the first technical contribution for every member.

28. Start the authentication, RBAC, document-flow and database audits.

29. Define the evidence required for pull requests, testing and the weekly record.

**Sprint 1 — Weeks 3 to 4 (20 July – 2 August 2026)**

**Planned**

**Backend Coordination**

30. Create and assign Sprint 1 tickets across the five squads.

31. Confirm one technical contribution for every backend member.

32. Run the API contract workshop with the Frontend leads and agree the integration priority order (#13).

33. Provide the weekly progress update to the Documentation stream, and the Sprint 1 cross-stream update to Frontend and Documentation (#27).

34. Hold the Sprint 1 review, retro and Sprint 2 planning (#31).

**DevOps & Platform**

35. Fix database seeding and root administrator creation (#6).

36. Audit dual-database usage and refresh the Trimester 1 ADR (#7).

37. Write a single canonical environment setup guide (#8).

38. Resolve the known Trimester 1 database issues (#17).

39. Decide the database direction and sign off the ADR with leads and mentor (#18).

40. Set up CI on GitHub Actions for lint, type-check and build (#19).

**Auth, RBAC & Security**

41. Audit all authentication flows locally and on Vercel and produce a severity-ranked defect list (#9).

42. Draft the RBAC matrix of roles against collections and fields (#10).

43. Fix the priority authentication defects from the audit (#20).

44. Standardise 401 and 403 responses and centralise error handling (#21).

**Venture Workflows**

45. Walk the document upload-review flow end to end and produce a defect list (#11).

46. Map the Payload collections, hooks and workflows as an as-is document (#12).

47. Harden upload validation: MIME type, extension, size, empty file and filename sanitisation (#22).

48. Fix the top document-flow defects and stabilise the happy path (#23).

**API & Integration**

49. Draft API contract v1 with per-endpoint payloads and role visibility (#14).

50. Finalise and publish the contract in the repository as the agreed source of truth (#24).

51. Agree the mock-data removal plan with the Frontend stream (#25).

**Testing & QA**

52. Choose the test tooling and write a one-page test strategy (#15).

53. Set up the test scaffolding and the first smoke tests (#16).

54. Wire the smoke tests into CI so failures block a merge (#26).

**Completed**

*Only work verified in the repository is recorded here. Items delivered on a branch but not merged are marked as delivered.*

| **Task** | **Squad**             | **Work Completed**                                                                                                                                                                    | **Technical Evidence**                                                                 | **Status**                       |
|----------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|----------------------------------|
| \#55     | DevOps & Platform     | June Choi — fixed the Windows lightningcss installation failure that was blocking members from running the stack locally.                                                             | PR \#55, merged 24 Jul, commit 3cd6fc0                                                 | Completed                        |
| \#11     | Venture Workflows     | June Choi — end-to-end walkthrough of the document upload and review flow; identified which page is the real review interface and why collection access blocks misreport permissions. | Investigation record, 20–25 Jul (ACT-004)                                              | Completed                        |
| \#9      | Auth, RBAC & Security | Abhishek Kotadiya — audit of the authentication flows, with the resulting defect list.                                                                                                | ACT-005, 26 Jul                                                                        | Completed                        |
| \#10     | Auth, RBAC & Security | Philip Wilcox — canonical role list and RBAC matrix; roles.json v0.2.0.                                                                                                               | PR \#59, merged to main 1 Aug (8ca72b8); RBAC_MATRIX.md 231 lines, roles.json 81 lines | Completed                        |
| \#14     | API & Integration     | Satya Dilsched — API contract v1 drafted, 823 lines, covering endpoints, payloads and per-role visibility; circulation package prepared by Jeevan Narahari.                           | Branch docs/api-contract-v1 (78e225d); PR \#82                                         | Delivered — not merged           |
| \#15     | Testing & QA          | Rahul Srinivasan — test tooling recommendation and one-page test strategy, with the Lead’s written response.                                                                          | Strategy document and reply, 27 Jul (ACT-011)                                          | Completed                        |
| \#16     | Testing & QA          | Rahul Srinivasan — Vitest scaffolding, a test environment separated from live credentials, and a health smoke test.                                                                   | PR \#64, merged to main 12 Aug (f3f438f)                                               | Completed                        |
| \#19     | DevOps & Platform     | Akshit Bhullar — CI audit and a GitHub Actions workflow (ci.yml, 79 lines), plus fixes for the build failures it exposed.                                                             | Branch devops/add-ci-pipeline; PR \#56                                                 | In review — not merged           |
| A9       | Auth, RBAC & Security | Philip Wilcox — surfaced unauthenticated role assignment on POST /api/team/members while completing \#10: the endpoint creates a user with whatever role the caller supplies.         | ACT-009, 30 Jul; logged as F-054                                                       | Reported — defect still open     |
| —        | Auth, RBAC & Security | Bukunmi Okedara and Celine Chege — shared administrator guard for protected development endpoints, and its application to the active maintenance routes.                              | Branches feature/protect-dev-endpoints and fix/protect-dev-api-routes, 6 Aug           | Written — no pull request raised |

**Carried Over to Sprint 2**

55. \#24 — publication of API contract v1. Drafted and circulated, but not merged into the repository.

56. \#18 — the database direction ADR. The sign-off session with leads and mentor was not held.

57. \#19 and \#26 — CI on main, and the smoke tests that depend on it.

58. \#17 — the known Trimester 1 database issues.

59. \#21 — standardised 401 and 403 handling across the API.

60. \#22 and \#23 — upload validation hardening and the document-flow defects.

61. F-054 — unauthenticated role assignment on POST /api/team/members.

62. F-010 — credential rotation and the removal of tracked environment files.

63. The inherited backlog of open pull requests from the previous trimester.

**Sprint 2 — Weeks 5 to 6 (3 – 16 August 2026)**

**Planned**

**Venture Workflows**

64. Build the venture creation backend behind the seven-page Start a New Venture flow (#32).

65. Implement the document status lifecycle with reviewer-only protected fields (#33).

66. Add reviewer assignment and review metadata endpoints (#34).

**Auth, RBAC & Security**

67. Enforce the RBAC matrix at API level for every collection and route (#35).

68. Add server-side validation for venture scores and all write payloads (#36).

69. Build an automated RBAC test suite of role against endpoint (#37).

**API & Integration**

70. Implement the per-role dashboard data endpoints (#38).

71. Implement venture list and detail endpoints with role-filtered fields (#39).

72. Pair with the Frontend stream on the dashboard and venture page cutover (#40).

**DevOps & Platform**

73. Stand up persistent staging on Vercel, auto-deploying from main (#41).

74. Build the demo seed dataset covering each role and pipeline stage (#42).

75. Standardise environment configuration across local, staging and production (#43).

**Testing & QA**

76. API test coverage for the authentication, document and venture endpoints landing this sprint (#44).

77. Regression checklist v1, executed against staging at sprint end (#45).

**Leads**

78. Cross-stream update on RBAC and workflow changes to Frontend and Documentation (#28).

79. Mid-sprint leads sync on integration status with the Frontend stream (#46).

80. Sprint 2 review, retro and Sprint 3 planning (#47).

**Completed**

| **Task**   | **Squad**             | **Work Completed**                                                                                                                                                                                           | **Technical Evidence**                      | **Status**                   |
|------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|------------------------------|
| \#35       | Auth, RBAC & Security | Philip Wilcox — RBAC matrix implemented in the Payload access rules across collections, fields and routes. Founder scoping resolved against the authenticated session email after two rounds of Lead review. | PR \#77; merged to main 26 Aug (15ad89e)    | Completed in Sprint 3        |
| \#21, \#36 | API & Integration     | Jeevan Narahari — shared authentication options, session-gated routes, server-side validation and a security-gates test suite.                                                                               | PR \#73; merged to main 26 Aug (47d7d78)    | Completed in Sprint 3        |
| —          | Leads                 | June Choi — reviewed five open pull requests (#64, \#73, \#77, \#78, \#82) in a single sitting, each with a written review record naming the finding, the file and the line.                                 | VPMS_PR_Review_Record_2026-08-12.md, 12 Aug | Completed                    |
| —          | API & Integration     | Aakash Shah — reported a duplicate /api/intake/submit route and schema drift between the intake payload and the venture record, outside the scope of his own ticket. Verified and patched by the Lead.       | ACT-015, 17 Aug                             | Reported — fix pending merge |
| —          | Leads                 | June Choi — cross-stream escalation to the Frontend lead following an unreported merge to main (PR \#57).                                                                                                    | ACT-013, 2 Aug                              | Completed                    |

*Two of the rows above were authored inside Sprint 2 and reviewed inside Sprint 2, but did not reach main until 26 August. They are recorded against the sprint in which the work was done, with the merge date named.*

**Planned but Not Started or Not Held**

*Recorded explicitly rather than omitted, because several later blockages trace back to these.*

81. \#47 — the Sprint 2 review was not held. Confirmed by the Backend Lead on 17 August, the day after the sprint closed.

82. \#41 — persistent staging on Vercel was not stood up, so no work has been tested in a deployed environment.

83. \#28 — the cross-stream RBAC and workflow update to Frontend and Documentation was not sent.

84. \#34 — reviewer assignment and review metadata endpoints.

85. \#37 — the automated RBAC test suite.

86. \#42 — the demo seed dataset.

87. \#45 — regression checklist v1, which depended on staging.

88. \#40 — frontend cutover pairing; no evidence of a pairing session was recorded.

**Carried Over to Sprint 3**

89. Everything carried from Sprint 1 that was not closed, including both Sprint 1 gates (#24 and \#18).

90. The Sprint 2 review itself, and with it the Sprint 3 planning that depended on it.

91. Staging (#41), the demo seed (#42), the regression checklist (#45), the RBAC test suite (#37) and reviewer assignment (#34).

92. A merge queue of finished, reviewed work that had not reached main.

**Sprint 3 — Weeks 7 to 8 (17 – 30 August 2026)**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>Sprint 3 was not opened as planned. On 17 August the Backend Lead recorded that Sprint 1 and Sprint 2 work was still outstanding, so the Sprint 3 cards scheduled for 17–23 August (#50, #52 and #57) stayed closed and the period was run as a Sprint 2 overrun.</p>
<p>The consequence was stated at the time: feature complete (#61, Sunday 30 August) either moves or Sprint 2 scope is cut, and that is the Sprint 2 review’s decision. As at 26 August the Backend Lead has asked for the date to move to Sunday 6 September; the decision was outstanding at the time of writing.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**Planned**

93. Clear the merge queue: every branch merged or rejected, none left open.

94. Close the two Sprint 1 gates — publish API contract v1 (#24) and take the database decision (#18).

95. Diagnostics and reporting endpoints, KPI tracker and funding tracker data binding (#48, \#49, \#50).

96. Expand the GEDSI metrics schema in Payload (#51) — dependent on the ADR decision.

97. Test RBAC in a deployed environment and review token and session expiry (#52, \#53).

98. Notifications backend for email and in-app events (#54).

99. Email automation reliability pass (#57) and performance profiling with database indexes (#58).

100. End-to-end tests of the critical journeys and weekly staging test cycles (#59, \#60).

101. Cross-stream update on reporting and diagnostics APIs to Frontend and Documentation (#29), carrying \#28 which was never sent.

102. Sprint 3 review and the feature-complete checkpoint (#61).

**Completed**

| **Task**               | **Squad**         | **Work Completed**                                                                                                                                                                                                                                                                                                   | **Technical Evidence**                                          | **Status**                 |
|------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|----------------------------|
| —                      | Leads             | June Choi — issued the Sprint 2 overrun plan recording the decision not to open Sprint 3, and naming its consequence for the feature-complete date.                                                                                                                                                                  | Sprint 2 overrun plan, 17 Aug                                   | Completed                  |
| —                      | Leads             | June Choi — second-round reviews of \#77, \#78 and \#56, each with a written record.                                                                                                                                                                                                                                 | Review records, 19 Aug                                          | Completed                  |
| \#18                   | DevOps & Platform | Bhavisha — ADR-001, a dual database and authentication assessment of 222 lines documenting exactly what is duplicated across the two databases.                                                                                                                                                                      | Branch bhavisha/backend-integration (732eb4a), 22 Aug; PR \#112 | Delivered — see note below |
| \#24                   | API & Integration | Satya Dilsched — API contract v1 carried onto the same branch as ADR-001, so a single merge publishes both gate artefacts.                                                                                                                                                                                           | docs/API_CONTRACT_V1.md (c85881a), 823 lines                    | Delivered — not merged     |
| \#54                   | API & Integration | Aakash Shah — intake notification email service and the SMTP configuration it requires, with documentation.                                                                                                                                                                                                          | Branch feature/intake-notification-email; PR \#103, 19 Aug      | Delivered — not merged     |
| —                      | Leads             | June Choi — Documentation stream plan for 24–30 August, the first written for that stream.                                                                                                                                                                                                                           | Documentation stream plan, 23 Aug                               | Completed                  |
| —                      | Leads             | June Choi — full audit of all twenty-four open pull requests, each trial-merged against main to establish a conflict-free order and to identify which conflict with each other.                                                                                                                                      | Backend merge plan, 26 Aug                                      | Completed                  |
| \#35, \#21, \#36, \#43 | Multiple          | Three pull requests merged in the audited order — \#77, then \#73, then \#78. First movement on main in fourteen days. Between them they closed an unauthenticated read and write on /api/users/me, untracked the environment files, added a root .gitignore, and made the proxy verify the session and fail closed. | main advanced from f3f438f to 615679b, 26 Aug                   | Completed                  |

*ADR-001 carries the status “Proposed” and its decision section states that no database consolidation is approved, no authentication consolidation is approved and no single source of truth is designated. It is an assessment, not the sign-off \#18 requires, so gate \#18 remains open and \#51 (GEDSI schema) is blocked rather than late.*

**Technical Findings Recorded in Sprint 3**

| **Area**                        | **Finding**                                                                                                                                                                                                                                                               |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Session enforcement             | Of the forty-seven API route files on main on 12 August, three enforced a session, ten had the check commented out and thirty-four made no reference to authentication. After the merges of 26 August the split is nine, seven and thirty-one.                            |
| Unauthenticated read and write  | GET and PUT on /api/users/me served and updated the first user record in the table whenever no session was present, with no environment flag guarding it. Closed by PR \#73 on 26 August. The fix had been written on 16 August and waited ten days to be merged.         |
| Unauthenticated role assignment | POST /api/team/members still creates a user with a caller-supplied role and no session check. Raised on 30 July and unchanged by the 26 August merges.                                                                                                                    |
| Committed credentials           | A live third-party email API key has been committed in plain text in the repository since 23 January 2026, inherited from Trimester 1. Untracking the environment files removes them from the working tree but does not revoke the key.                                   |
| Continuous integration          | main still carries only the fork-sync workflow, so nothing merged is checked automatically. The pipeline has been ready on a branch since 9 August.                                                                                                                       |
| Test runners                    | Both the Node built-in runner and Vitest are configured on main, with one live test file each. Whichever the pipeline runs, the other half of the suite is not executed.                                                                                                  |
| Merge throughput                | Nothing merged between 12 and 26 August while finished, reviewed work accumulated across five branches. The bottleneck was the merge decision, not authoring capacity: the frontend integration branch took commits from about a dozen contributors over the same period. |
| Pull request hygiene            | Thirteen of the open pull requests date from April and May and belong to Trimester 1. They are more than half the open count and obscure the real queue.                                                                                                                  |
| Work with no pull request       | The development-endpoint guard has sat on two branches since 6 August with no pull request raised against either, so it was being tracked as awaiting merge when it was in fact awaiting submission.                                                                      |
| Divergent copies                | The two guard branches share one commit and then diverge; the later refinement exists on only one of them, so merging the other alone would silently discard it.                                                                                                          |

**Carried into Sprint 4**

103. The feature-complete date itself (#61) — the request to move it from 30 August to 6 September was outstanding at the time of writing.

104. F-054 — unauthenticated role assignment on POST /api/team/members, to be raised as a board task with a named owner rather than a follow-up row.

105. \#24 and \#18 — publication of the contract, and a database decision that ADR-001 does not itself provide.

106. \#19 — CI on main, once PR \#56 has been rebased onto the merged work.

107. F-010 — revocation of the committed email credential and the wider credential rotation, which belongs to the Sprint 4 security pass (#63).

108. A ruling on a single test runner, and removal of the other.

109. \#41 staging, \#42 demo seed, \#45 regression checklist, \#37 RBAC test suite and \#34 reviewer assignment, all still outstanding from Sprint 2.

110. Closure of the thirteen Trimester 1 pull requests, and a pull request for the development-endpoint guard.

111. \#29 — the cross-stream update to Frontend and Documentation, carrying \#28 which was never sent.

**Technical Information to Record for Every Completed Contribution**

112. Planner task number, squad and feature name.

113. Contributor and reviewer.

114. Branch, pull request number and merge commit.

115. Files, routes or Payload collections changed.

116. API endpoint added or modified, with method and path.

117. Authentication and role requirements enforced by the change.

118. Request and response shape, and per-role field visibility.

119. Validation rules and business rules applied.

120. Database and collection affected, and any schema or migration change.

121. Status-code behaviour, including the 401 and 403 paths.

122. Environment variables or configuration added or changed.

123. Tests written, the runner used, and how they are executed.

124. Evidence that the change was verified against the repository, naming the commit it was verified at.

125. Known limitations, remaining risks and any follow-up reference.

126. Related frontend or documentation dependency.

**Position as at 26 August 2026**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>main is at 615679b. Three pull requests merged on 26 August — the first movement since 12 August.</p>
<p>Nine of the forty-seven API route files enforce a session, up from three. Thirty-one still make no reference to authentication.</p>
<p>Both Sprint 1 gates remain open: API contract v1 (#24) is written but unmerged, and the database decision (#18) has an assessment but no sign-off. Both are twenty-four days past their due date.</p>
<p>Feature complete (#61) falls on Sunday 30 August. The Backend Lead has asked for it to move to Sunday 6 September, on the grounds that the remaining work is written and reviewed rather than unstarted; that decision was outstanding at the time of writing. Feature freeze is Friday 11 September, code freeze Friday 18 September, and handover and showcase Sunday 27 September.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>
