# Software Requirements Specification (SRS)
## Venture Pipeline Management System (VPMS)

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for the Venture Pipeline Management System (VPMS).  
It serves as the finalised requirements baseline for development, validation, and handover.

### 1.2 Scope
VPMS supports Mekong Inclusive Ventures (MIV) in managing venture pipeline documentation by enabling secure submission, review, and tracking of documents through a structured workflow.

The system focuses on usability, access control, and transparency of venture progress.

### 1.3 Definitions
- **VPMS**: Venture Pipeline Management System  
- **Founder**: Venture applicant or representative  
- **Admin**: MIV staff member responsible for review and approval  
- **Document Status**: Current review state of a submitted document

---

## 2. Stakeholders and Users

### 2.1 Stakeholders
- Mekong Inclusive Ventures (MIV)
- Venture founders and applicants
- Internal development team

### 2.2 User Roles
- **Founder**
  - Upload and manage own venture documents
  - View document review status

- **Admin**
  - View all submitted documents
  - Review, approve, reject, or request changes
  - Manage document categories and access

- **Internal Developer**
  - Maintain system configuration
  - Support deployment and enhancements

---

## 3. Functional Requirements

### Authentication & Access
- **FR-01** The system shall authenticate users before granting access.
- **FR-02** The system shall assign access permissions based on user roles.

### Document Management
- **FR-03** The system shall allow founders to upload venture-related documents.
- **FR-04** The system shall restrict supported file types and enforce file size limits.
- **FR-05** The system shall store uploaded documents securely with associated metadata.
- **FR-06** The system shall allow users to view documents they are authorised to access.
- **FR-07** The system shall allow authorised users to download documents securely.
- **FR-08** The system shall allow documents to be updated or replaced when required.
- **FR-09** The system shall allow authorised users to delete documents where permitted.

### Review Workflow
- **FR-10** The system shall assign an initial status of *Pending* to newly uploaded documents.
- **FR-11** The system shall allow admins to update document status to *Approved*, *Rejected*, or *Needs Changes*.
- **FR-12** The system shall display the current status of each document to authorised users.

### Visibility & Permissions
- **FR-13** Founders shall only be able to view documents associated with their own venture.
- **FR-14** Admins shall be able to view documents across all ventures.

---

## 4. Non-Functional Requirements

### Security
- **NFR-01** The system shall enforce role-based access control.
- **NFR-02** The system shall restrict file uploads by type and size.
- **NFR-03** The system shall support secure document downloads.

### Usability
- **NFR-04** The system shall provide a clear and intuitive document upload interface.
- **NFR-05** Users shall be able to view document status without technical assistance.

### Maintainability
- **NFR-06** The system shall be deployable in a local development environment.
- **NFR-07** The system shall support future enhancements without major architectural changes.

---

## 5. Assumptions and Constraints
- The system is delivered as an MVP.
- Enterprise compliance certification is not included in the current scope.
- System functionality reflects the current implementation and documented workflows.

---

## 6. Acceptance Criteria
- Founders can upload documents and view their review status.
- Admins can review documents and update status.
- Access permissions prevent unauthorised document visibility.
- The system runs successfully in a documented local setup.

