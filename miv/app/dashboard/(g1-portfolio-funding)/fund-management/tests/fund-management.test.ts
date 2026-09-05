import { describe, it, expect, beforeEach, vi } from "vitest"
import { funds, limitedPartners, capitalCalls, distributions, operationTasks, reports, documents } from "../data/fund-management"

describe("Fund Management API Data", () => {
  describe("Mock Data Validation", () => {
    it("should have valid funds data", () => {
      expect(funds).toBeDefined()
      expect(Array.isArray(funds)).toBe(true)
      expect(funds.length).toBeGreaterThan(0)
    })

    it("should have valid limited partners data", () => {
      expect(limitedPartners).toBeDefined()
      expect(Array.isArray(limitedPartners)).toBe(true)
      expect(limitedPartners.length).toBeGreaterThan(0)
    })

    it("should have valid capital calls data", () => {
      expect(capitalCalls).toBeDefined()
      expect(Array.isArray(capitalCalls)).toBe(true)
      expect(capitalCalls.length).toBeGreaterThan(0)
    })

    it("should have valid distributions data", () => {
      expect(distributions).toBeDefined()
      expect(Array.isArray(distributions)).toBe(true)
      expect(distributions.length).toBeGreaterThan(0)
    })

    it("should have valid operation tasks data", () => {
      expect(operationTasks).toBeDefined()
      expect(Array.isArray(operationTasks)).toBe(true)
    })

    it("should have valid reports data", () => {
      expect(reports).toBeDefined()
      expect(Array.isArray(reports)).toBe(true)
    })

    it("should have valid documents data", () => {
      expect(documents).toBeDefined()
      expect(Array.isArray(documents)).toBe(true)
    })
  })

  describe("Fund Data Structure", () => {
    it("each fund should have required properties", () => {
      funds.forEach((fund) => {
        expect(fund).toHaveProperty("id")
        expect(fund).toHaveProperty("name")
        expect(fund).toHaveProperty("vintage")
        expect(fund).toHaveProperty("size")
        expect(fund).toHaveProperty("status")
        expect(fund).toHaveProperty("irr")
        expect(fund).toHaveProperty("tvpi")
        expect(fund).toHaveProperty("dpi")
      })
    })

    it("fund IRR values should be numeric", () => {
      funds.forEach((fund) => {
        expect(typeof fund.irr).toBe("number")
        expect(fund.irr).toBeGreaterThanOrEqual(-100)
      })
    })

    it("fund TVPI and DPI should be positive", () => {
      funds.forEach((fund) => {
        expect(fund.tvpi).toBeGreaterThan(0)
        expect(fund.dpi).toBeGreaterThanOrEqual(0)
      })
    })

    it("fund status should be valid", () => {
      const validStatuses = ["fundraising", "active", "closed", "winding_down", "liquidated"]
      funds.forEach((fund) => {
        expect(validStatuses).toContain(fund.status)
      })
    })
  })

  describe("Limited Partner Data Structure", () => {
    it("each LP should have required properties", () => {
      limitedPartners.forEach((lp) => {
        expect(lp).toHaveProperty("id")
        expect(lp).toHaveProperty("name")
        expect(lp).toHaveProperty("type")
        expect(lp).toHaveProperty("commitment")
        expect(lp).toHaveProperty("status")
        expect(lp).toHaveProperty("kycStatus")
      })
    })

    it("LP status should be valid", () => {
      const validStatuses = ["active", "defaulted", "transferred", "withdrawn"]
      limitedPartners.forEach((lp) => {
        expect(validStatuses).toContain(lp.status)
      })
    })

    it("LP KYC status should be valid", () => {
      const validKycStatuses = ["approved", "pending", "expired"]
      limitedPartners.forEach((lp) => {
        expect(validKycStatuses).toContain(lp.kycStatus)
      })
    })

    it("LP IRR and TVPI should be numeric", () => {
      limitedPartners.forEach((lp) => {
        expect(typeof lp.irr).toBe("number")
        expect(typeof lp.tvpi).toBe("number")
        expect(lp.tvpi).toBeGreaterThan(0)
      })
    })
  })

  describe("Capital Call Data Structure", () => {
    it("each capital call should have required properties", () => {
      capitalCalls.forEach((call) => {
        expect(call).toHaveProperty("id")
        expect(call).toHaveProperty("fundId")
        expect(call).toHaveProperty("fundName")
        expect(call).toHaveProperty("amount")
        expect(call).toHaveProperty("dueDate")
        expect(call).toHaveProperty("status")
      })
    })

    it("capital call status should be valid", () => {
      const validStatuses = ["pending", "in_progress", "completed", "overdue"]
      capitalCalls.forEach((call) => {
        expect(validStatuses).toContain(call.status)
      })
    })

    it("capital call LP responses should be valid", () => {
      capitalCalls.forEach((call) => {
        expect(call.lpsResponded).toBeGreaterThanOrEqual(0)
        expect(call.lpsResponded).toBeLessThanOrEqual(call.totalLps)
      })
    })
  })

  describe("Distribution Data Structure", () => {
    it("each distribution should have required properties", () => {
      distributions.forEach((dist) => {
        expect(dist).toHaveProperty("id")
        expect(dist).toHaveProperty("fundId")
        expect(dist).toHaveProperty("amount")
        expect(dist).toHaveProperty("date")
        expect(dist).toHaveProperty("type")
        expect(dist).toHaveProperty("status")
      })
    })

    it("distribution type should be valid", () => {
      const validTypes = ["dividend", "exit", "refinancing", "return_of_capital", "other"]
      distributions.forEach((dist) => {
        expect(validTypes).toContain(dist.type)
      })
    })

    it("distribution status should be valid", () => {
      const validStatuses = ["announced", "paid", "pending", "processing"]
      distributions.forEach((dist) => {
        expect(validStatuses).toContain(dist.status)
      })
    })

    it("distribution LP payments should be valid", () => {
      distributions.forEach((dist) => {
        expect(dist.lpsPaid).toBeGreaterThanOrEqual(0)
        expect(dist.lpsPaid).toBeLessThanOrEqual(dist.totalLps)
      })
    })
  })

  describe("Data Relationships", () => {
    it("capital calls should reference existing funds", () => {
      const fundIds = new Set(funds.map((f) => f.id))
      capitalCalls.forEach((call) => {
        expect(fundIds.has(call.fundId)).toBe(true)
      })
    })

    it("distributions should reference existing funds", () => {
      const fundIds = new Set(funds.map((f) => f.id))
      distributions.forEach((dist) => {
        expect(fundIds.has(dist.fundId)).toBe(true)
      })
    })

    it("fund counts should be consistent", () => {
      expect(funds.length).toBeGreaterThan(0)
      expect(limitedPartners.length).toBeGreaterThan(0)
    })
  })

  describe("API Response Format", () => {
    it("should simulate successful API response", async () => {
      const mockPayload = {
        funds,
        limitedPartners,
        capitalCalls,
        distributions,
        operationTasks,
        reports,
        ventures: [
          {
            id: "v-1",
            name: "Test Venture",
            documents: documents,
          },
        ],
      }

      expect(mockPayload).toHaveProperty("funds")
      expect(mockPayload).toHaveProperty("limitedPartners")
      expect(mockPayload).toHaveProperty("capitalCalls")
      expect(mockPayload).toHaveProperty("distributions")
      expect(Array.isArray(mockPayload.funds)).toBe(true)
      expect(Array.isArray(mockPayload.limitedPartners)).toBe(true)
    })
  })

  describe("Data Calculations", () => {
    it("should calculate total committed capital", () => {
      const total = funds.reduce((sum, fund) => {
        const amount = parseFloat(fund.committedCapital.replace(/[^0-9.]/g, ""))
        return sum + amount
      }, 0)

      expect(total).toBeGreaterThan(0)
      expect(typeof total).toBe("number")
    })

    it("should calculate average IRR", () => {
      const avgIrr = funds.reduce((sum, fund) => sum + fund.irr, 0) / funds.length

      expect(typeof avgIrr).toBe("number")
      expect(avgIrr).toBeGreaterThanOrEqual(-100)
    })

    it("should calculate LP performance metrics", () => {
      limitedPartners.forEach((lp) => {
        expect(lp.irr).toBeGreaterThanOrEqual(-100)
        expect(lp.tvpi).toBeGreaterThan(0)
        expect(lp.dpi).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
