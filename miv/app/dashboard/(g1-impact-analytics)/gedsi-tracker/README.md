readme_content = """# GEDSI Tracker Module 

This module is part of the G1 Impact Analytics dashboard, designed to track and analyze Gender Equality, Diversity, and Social Inclusion (GEDSI) metrics within the Venture Pipeline Management System.

## Overview
The GEDSI Tracker provides a centralized interface for monitoring organizational impact analytics. It leverages custom utility functions to calculate GEDSI scores and displays them through a responsive UI components library.

## File Structure
The module is located at:
`miv/app/dashboard/(g1-impact-analytics)/gedsi-tracker/`

- `page.tsx`: The primary interface for the GEDSI Tracker, handling user inputs, data visualization, and metric calculations.

## Dependencies
- React (useState, useEffect, useMemo)
- UI Components: Card, Button, Input, Label, Badge, Progress, Alert, Select, Dialog
- Utilities: `calculateGEDSIScore` from `@lib/gedsi-utils`

## Setup & Usage
This module is automatically accessible via the App Router navigation under the Impact Analytics dashboard section. Ensure that the associated utility functions are correctly exported from `@lib/gedsi-utils` to enable score calculations.

---
*Maintained by the Development Team (Sprint: Impact Analytics)*
"""

with open(r"app\dashboard\(g1-impact-analytics)\gedsi-tracker\README.md", "w") as f:
    f.write(readme_content)
