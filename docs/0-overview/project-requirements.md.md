---
title: project-requirements.md

---

# Project Requirements
## Venture Pipeline Management System (VPMS)

---

# 1. Introduction

## 1.1 Purpose

This document outlines the functional and non-functional requirements for the Venture Pipeline Management System (VPMS).

It serves as the requirements baseline for development, testing, and future improvements.

---

## 1.2 Scope

VPMS supports Mekong Inclusive Ventures (MIV) in managing venture applications, onboarding workflows, document management, and review processes through a structured platform.

The platform focuses on:
- Accessibility
- Workflow transparency
- Role-based access
- Usability and responsiveness

The project currently represents a functional MVP under ongoing development.

---

## 1.3 Definitions

- **VPMS** → Venture Pipeline Management System
- **Impact User** → Venture applicant or representative
- **Admin / Analyst** → MIV staff responsible for review workflows
- **Document Status** → Current review state of a submission

---

# 2. Stakeholders and Users

## 2.1 Stakeholders

- Mekong Inclusive Ventures (MIV)
- Impact users and applicants
- Internal development team
- Capstone contributors

---

## 2.2 User Roles

### Impact Users
- Submit venture applications
- Upload and manage documents
- View venture and document status
- Respond to requested changes

### Admins / Analysts
- Review submissions
- Approve, reject, or request changes
- Manage workflows and venture progress

### Internal Developers
- Maintain system configuration
- Support deployment and future enhancements

---

# 3. Functional Requirements

## Authentication & Access
- Users must authenticate before accessing the platform
- Access permissions must be role-based

---

## Venture & Document Management
- Impact users can submit venture applications
- Users can upload and manage documents
- The system restricts unsupported file types and sizes
- Uploaded documents are securely stored
- Users can only access authorised information

---

## Review Workflow
- Submitted documents receive a review status
- Admins and analysts can:
  - Approve submissions
  - Reject submissions
  - Request changes
- Users can track submission progress and status updates

---

## Platform Experience
- The platform supports responsive web interfaces
- Mobile-focused workflows and accessibility considerations are included as part of ongoing platform planning
- Navigation and workflows should remain simple and accessible

---

# 4. Non-Functional Requirements

## Security
- Role-based access control must be enforced
- File uploads must be validated
- Secure document access must be maintained

---

## Usability
- Interfaces should remain simple and intuitive
- Users should be able to track status updates clearly
- The platform should support users with varying levels of digital literacy

---

## Maintainability
- The system should support ongoing development and future enhancements
- Documentation should remain structured and maintainable

---

# 5. Assumptions and Constraints

- The platform is currently an MVP
- Some features remain under active development
- Mobile support is currently focused on responsive UI/UX planning rather than full deployment
- Enterprise-level compliance is outside the current project scope

---

# 6. Acceptance Criteria

- Impact users can submit applications and upload documents
- Admins and analysts can review and manage submissions
- Users can track workflow and status updates
- Access permissions prevent unauthorised access
- The platform runs successfully in a local development environment

---