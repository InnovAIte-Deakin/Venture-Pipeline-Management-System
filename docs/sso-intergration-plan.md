# SSO Integration Plan for VPMS

## Overview
This document outlines a proposed Single Sign-On (SSO) integration approach for the Venture Pipeline Management System (VPMS).

## Objective
The goal of SSO is to simplify login, improve security, and provide a more scalable authentication flow for founders, analysts, and administrators.

## Why SSO for VPMS
- Reduces login friction for users
- Supports a more secure authentication process
- Makes identity management easier as the platform grows
- Helps standardise access across multiple services

## Current Context
The current platform already supports authentication-related functionality and role-based access control. An SSO implementation should align with the existing backend and frontend authentication flow.

## Proposed Approach
A practical first option is OAuth-based login using a trusted identity provider such as Google or Microsoft.

### High-level flow
1. User clicks “Sign in with SSO”
2. User is redirected to identity provider
3. Provider returns verified identity token
4. Backend validates token
5. User account is matched or created
6. Role is mapped to the correct VPMS access level
7. Session is established securely

## Role Mapping
Suggested mapping after successful SSO:
- Admin users -> admin
- MIV staff / reviewers -> miv_analyst
- Venture users -> founder

## Backend Considerations
- Validate provider token securely
- Prevent duplicate account creation
- Link provider identity to existing user records
- Store only the minimum required identity data
- Ensure role mapping is controlled server-side

## Security Considerations
- Use trusted OAuth providers only
- Validate tokens on the server
- Apply secure session handling
- Restrict role assignment logic to backend only
- Log authentication events for audit purposes

## Trimester Scope
Within this trimester, the realistic scope is:
- research provider options
- define architecture
- prepare integration plan
- identify required backend changes
- estimate implementation effort

## Future Implementation Tasks
- Add provider configuration
- Update login flow in frontend
- Add backend callback handling
- Link SSO identity to users collection
- Test admin, analyst, and founder login scenarios

## Expected Benefits
- Better user experience
- Improved security
- Easier future integrations
- More scalable authentication design