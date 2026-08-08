import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import TeamManagementPage from '../../app/dashboard/(g5-platform-operations)/team-management/page'

test('team management page renders the shared header copy', () => {
  const html = renderToStaticMarkup(React.createElement(TeamManagementPage))

  assert.match(
    html,
    /Manage your team members, projects, events, and announcements in one place\./,
  )
})
