# MIV Platform - Enterprise Venture Pipeline Management

<div align="center">

![MIV Platform](https://img.shields.io/badge/MIV-Platform-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge)
![AI-Powered](https://img.shields.io/badge/AI-Powered-Impact%20Investing-green?style=for-the-badge)
![Enterprise Ready](https://img.shields.io/badge/Enterprise-Ready-red?style=for-the-badge)
![SOC 2](https://img.shields.io/badge/SOC-2%20Compliant-brightgreen?style=for-the-badge)
![GDPR](https://img.shields.io/badge/GDPR-Compliant-blue?style=for-the-badge)

**World-class venture pipeline management platform competing with market leaders**

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/miv-platform)
[![Documentation](https://img.shields.io/badge/Documentation-Complete-blue?style=for-the-badge)](./docs/MIV_PLATFORM_OVERVIEW.md)
[![API Reference](https://img.shields.io/badge/API-Reference-Complete-green?style=for-the-badge)](./docs/API_REFERENCE.md)

</div>

---

## 📋 Table of Contents

- [Platform Overview](#platform-overview)
- [Market Position](#market-position)
- [Key Differentiators](#key-differentiators)
- [Architecture Overview](#architecture-overview)
- [Core Features](#core-features)
- [AI Capabilities](#ai-capabilities)
- [Technology Stack](#technology-stack)
- [Performance Metrics](#performance-metrics)
- [Security & Compliance](#security--compliance)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Running Locally](#running-locally)

---
# Venture Pipeline Management System (VPMS)

The Venture Pipeline Management System (VPMS) is a minimum viable product (MVP) developed for **Mekong Inclusive Ventures (MIV)** to support venture pipeline operations, with a focus on secure document submission, review, and status tracking.

The platform centralises venture documentation and enables structured workflows that allow founders to submit required documents and MIV administrators to review, approve, reject, or request changes.

---

## Key Features (Current MVP)

* Secure document upload and storage
* Role-based access control

  * Founders can view and manage their own documents
  * Admins can view and manage documents across all ventures
* Document review workflow with clear status states:

  * Pending
  * Approved
  * Rejected
  * Needs Changes
* User authentication using NextAuth (Google OAuth and credentials login)
* Clear document categorisation and status visibility

---

## Repository Structure

```
/
├── miv/                 # VPMS frontend application (Next.js)
├── miv-backend/         # Payload CMS backend
├── docs/                # Consolidated project documentation
└── README.md
```

---

## Running the Project Locally

### Prerequisites

* Node.js (LTS)
* npm
* Local access to the required databases (as configured for the project)

> Note: Docker configuration exists in the repository but is not currently used in the standard development workflow.

---

### Backend (Payload CMS)

Open a terminal and run:

```bash
cd miv-backend
npm install
npm run dev
```

This starts the Payload CMS backend in development mode.

---

### Frontend (VPMS Application)

Open a second terminal and run:

```bash
cd miv
npm install
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Documentation

All project documentation has been consolidated in the `/docs` directory.

Start here:

* **Documentation Index:** `docs/DOCUMENTATION_INDEX.md`

The documentation set includes:

* Project Overview
* Requirements & Software Requirements Specification (SRS)
* System Architecture
* User Guide
* Internal Developer Guide

---

## Project Status

This project represents a functional MVP developed as part of a capstone initiative. Some features remain incomplete and minor bugs may exist. The system is intended for demonstration, evaluation, and future iteration rather than production deployment.
