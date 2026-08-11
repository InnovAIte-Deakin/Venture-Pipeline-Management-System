# Centralized GEDSI and Social Impact Calculations

## Overview

This document describes the centralized calculation system implemented to ensure consistent GEDSI metrics and social impact calculations across the entire platform. The system eliminates duplicate calculation logic and provides a single source of truth for all metrics.

## Architecture

### Core Components

1. **Calculation Service** (`/lib/calculation-service.ts`)
   - Central service that handles all GEDSI and social impact calculations
   - Provides consistent algorithms across the platform
   - Manages calculation triggers and updates

2. **Database Schema** (Updated `prisma/schema.prisma`)
   - Added calculated fields to the Venture model:
     - `gedsiScore`: GEDSI alignment score (0-100)
     - `socialImpactScore`: Overall social impact score (0-100)
     - `gedsiComplianceRate`: GEDSI metrics completion rate (0-100)
     - `totalBeneficiaries`: Total calculated beneficiaries
     - `jobsCreated`: Total calculated jobs created
     - `womenEmpowered`: Total women empowered
     - `disabilityInclusive`: Disability inclusion metrics
     - `youthEngaged`: Youth engagement metrics
     - `calculatedAt`: Timestamp of last calculation

3. **API Endpoints**
   - `/api/calculations`: Trigger recalculations
   - `/api/calculations/portfolio`: Get aggregated portfolio metrics
   - `npm run db:seed:calculations`: Initial population of calculated values

### Calculation Logic

#### GEDSI Score Calculation
- Uses existing `calculateGEDSIScore()` from `gedsi-utils.ts`
- Considers founder types, inclusion focus, AI analysis
- Ranges from 0-100, capped at maximum

#### Social Impact Metrics
- **Sector-specific multipliers**: Different calculation factors for HealthTech, FinTech, EdTech, Agriculture, etc.
- **Beneficiaries calculation**: Based on funding amount and team size
- **Jobs created**: Direct employment + indirect job creation
- **Demographic impact**: Women empowered, disability inclusion, youth engagement
- **Founder type bonuses**: Additional impact for women-led, disability-inclusive ventures

#### Social Impact Score
- Composite score (0-100) based on:
  - Beneficiaries per dollar (efficiency)
  - Job creation efficiency
  - Demographic inclusion rates
  - Sector-specific bonuses
  - GEDSI alignment bonus

### Automatic Recalculation

The system automatically triggers recalculation when:
- New ventures are created
- GEDSI metrics are added or updated
- Venture data is modified

### API Usage

#### Trigger Recalculation for Specific Venture
```javascript
POST /api/calculations
{
  "ventureId": "venture_id_here"
}
```

#### Trigger Recalculation for All Ventures
```javascript
POST /api/calculations
{
  // No ventureId provided = recalculate all
}
```

#### Get Portfolio Metrics
```javascript
GET /api/calculations/portfolio
```

Returns:
```javascript
{
  "totalVentures": 25,
  "totalBeneficiaries": 150000,
  "totalJobsCreated": 1200,
  "totalWomenEmpowered": 75000,
  "totalDisabilityInclusive": 15000,
  "totalYouthEngaged": 45000,
  "averageGEDSIScore": 68,
  "averageSocialImpactScore": 72,
  "averageComplianceRate": 85
}
```

### Frontend Integration

Frontend components now use calculated values from the database instead of performing inline calculations:

#### Before (Inline Calculations)
```javascript
// Multiple places with different calculation logic
const totalBeneficiaries = ventures.reduce((sum, v) => {
  const funding = v.fundingRaised || 100000
  const teamSize = v.teamSize || 5
  switch (v.sector) {
    case 'HealthTech': return sum + Math.floor(funding / 50) + (teamSize * 200)
    // ... different logic in different files
  }
}, 0)
```

#### After (Centralized)
```javascript
// Single source of truth from database
const totalBeneficiaries = ventures.reduce((sum, v) => sum + (v.totalBeneficiaries || 0), 0)
```

### Benefits

1. **Consistency**: All calculations use the same logic and parameters
2. **Performance**: Calculations are done once and stored, not recalculated on every page load
3. **Maintainability**: Single place to update calculation logic
4. **Accuracy**: Eliminates discrepancies between different parts of the platform
5. **Scalability**: Database-stored values enable efficient aggregation and reporting

### Sector-Specific Multipliers

| Sector | Beneficiaries/$ | Beneficiaries/Employee | Jobs Multiplier | Women Rate | Disability Rate | Youth Rate |
|--------|-----------------|------------------------|-----------------|------------|-----------------|------------|
| HealthTech | 0.02 | 200 | 3.5 | 60% | 15% | 40% |
| FinTech | 0.04 | 300 | 4.0 | 70% | 10% | 50% |
| EdTech | 0.01 | 150 | 2.5 | 55% | 20% | 80% |
| Agriculture | 0.005 | 100 | 5.0 | 50% | 8% | 30% |
| Default | 0.0067 | 50 | 3.0 | 50% | 12% | 40% |

### Founder Type Bonuses

- Women-led ventures: +30% impact multiplier
- Disability-inclusive ventures: +20% impact multiplier
- Youth-led ventures: +15% impact multiplier
- Rural-focused ventures: +10% impact multiplier

### Data Migration

After implementing the centralized system:

1. Run database migration to add calculated fields
2. Execute initial calculation seeding:
   ```bash
   npm run db:seed:calculations
   ```
3. Verify calculations are populated correctly

### Monitoring and Maintenance

- Calculated values include `calculatedAt` timestamp for freshness tracking
- Scheduled recalculation job can be run periodically
- API endpoints provide visibility into calculation status
- Failed calculations are logged but don't block other operations

### Future Enhancements

1. **Real-time Updates**: WebSocket integration for live calculation updates
2. **Calculation History**: Track changes in calculated values over time
3. **Custom Metrics**: Allow configuration of sector-specific multipliers
4. **Advanced Analytics**: Machine learning-based impact prediction
5. **Audit Trail**: Track who triggered recalculations and when

This centralized system ensures that GEDSI metrics and social impact calculations are consistent, accurate, and maintainable across the entire MIV platform.
