"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Heart,
  Users,
  Target,
  Upload,
  FileText,
  Award,
  MessageSquare,
} from "lucide-react";

/* =========================================================
   FORM SCHEMA
   ========================================================= */

const ventureIntakeSchema = z.object({
  /* STEP 1 */
  name: z.string().min(1, "Venture name is required"),

  sector: z.string().min(1, "Sector is required"),

  location: z.string().min(1, "Location is required"),

  contactEmail: z
    .string()
    .email("Valid email is required"),

  contactPhone: z.string().optional(),

  /* STEP 2 */
  founderTypes: z
    .array(z.string())
    .min(1, "Select at least one founder type"),

  teamSize: z.string().min(1, "Team size is required"),

  foundingYear: z.string().min(1, "Founding year is required"),

  pitchSummary: z
    .string()
    .min(10, "Pitch summary must be at least 10 characters"),

  inclusionFocus: z
    .string()
    .min(1, "Inclusion focus is required"),

  /* =====================================================
     OLD FIELDS
     
     These are optional because they are NOT currently
     displayed in your new Figma UI.
     ===================================================== */

  targetMarket: z.string().optional(),

  revenueModel: z.string().optional(),

  challenges: z.string().optional(),

  supportNeeded: z.string().optional(),

  timeline: z.string().optional(),

  /* STEP 4 - READINESS */

  operationalReadiness: z
    .object({
      businessPlan: z.boolean(),
      financialProjections: z.boolean(),
      legalStructure: z.boolean(),
      teamComposition: z.boolean(),
      marketResearch: z.boolean(),
    })
    .optional(),

  capitalReadiness: z
    .object({
      pitchDeck: z.boolean(),
      financialStatements: z.boolean(),
      investorMaterials: z.boolean(),
      dueDiligence: z.boolean(),
      fundingHistory: z.boolean(),
    })
    .optional(),

  /* STEP 5 */

  washingtonShortSet: z
    .object({
      seeing: z
        .enum([
          "no_difficulty",
          "some_difficulty",
          "a_lot_of_difficulty",
          "cannot_do_at_all",
        ])
        .optional(),

      hearing: z
        .enum([
          "no_difficulty",
          "some_difficulty",
          "a_lot_of_difficulty",
          "cannot_do_at_all",
        ])
        .optional(),

      walking: z
        .enum([
          "no_difficulty",
          "some_difficulty",
          "a_lot_of_difficulty",
          "cannot_do_at_all",
        ])
        .optional(),

      cognition: z
        .enum([
          "no_difficulty",
          "some_difficulty",
          "a_lot_of_difficulty",
          "cannot_do_at_all",
        ])
        .optional(),

      selfCare: z
        .enum([
          "no_difficulty",
          "some_difficulty",
          "a_lot_of_difficulty",
          "cannot_do_at_all",
        ])
        .optional(),

      communication: z
        .enum([
          "no_difficulty",
          "some_difficulty",
          "a_lot_of_difficulty",
          "cannot_do_at_all",
        ])
        .optional(),
    })
    .optional(),

  disabilityInclusion: z
    .object({
      disabilityLedLeadership: z.boolean().optional(),
      inclusiveHiringPractices: z.boolean().optional(),
      accessibleProductsOrServices: z.boolean().optional(),
      notes: z.string().optional(),
    })
    .optional(),

  /* STEP 3 - IMPACT */

  impactBeneficiaries: z
    .array(z.string())
    .min(1, "Select at least one beneficiary group"),

  impactAreas: z
    .array(z.string())
    .min(1, "Select at least one impact area"),

  impactNotes: z.string().optional(),

  /* STEP 4 - FINANCIAL */

  fundingRequired: z
    .string()
    .min(1, "Funding required is required"),

  annualRevenue: z
    .string()
    .min(1, "Annual revenue is required"),

  numberOfEmployees: z
    .string()
    .min(1, "Number of employees is required"),

  fundingStage: z
    .string()
    .min(1, "Funding stage is required"),

  currentInvestment: z.string().optional(),

  /* STEP 6 */

  gedsiGoals: z
    .array(z.string())
    .min(1, "Select at least one GEDSI goal"),
});

type VentureIntakeFormData =
  z.infer<typeof ventureIntakeSchema>;

/* =========================================================
   CONSTANTS
   ========================================================= */

const steps = [
  { id: 1, title: 'Basic Information', description: 'Venture details and contact information' },
  { id: 2, title: 'Team & Foundation', description: 'Founding team and venture foundation' },
  { id: 3, title: 'Impact & GEDSI', description: 'Impact beneficiaries and areas' },
  { id: 4, title: 'Financial Information', description: 'Funding and financial details' },
  { id: 5, title: 'Document Checklist', description: 'Required venture documents' },
  { id: 6, title: 'GEDSI Goals', description: 'Impact goals and metrics' },
]

const sectors = [
  "CleanTech",
  "Agriculture",
  "FinTech",
  "Healthcare",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Services",
  "Technology",
  "Other",
];

const founderTypes = [
  "women-led",
  "youth-led",
  "disability-inclusive",
  "rural-focus",
  "indigenous-led",
  "refugee-led",
  "veteran-led",
  "other",
];

const beneficiaryOptions = [
  "Women",
  "Youth",
  "Person with Disabilities",
  "Rural Communities",
];

const impactAreaOptions = [
  "Education",
  "Healthcare",
  "Agriculture",
  "Climate",
  "Employment",
];

const fundingStageOptions = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Growth",
];

const teamSizes = [
  "1-2",
  "3-5",
  "6-10",
  "11-20",
  "21-50",
  "50+",
];

const gedsiGoals = [
  "OI.1 - Women-led ventures supported",
  "OI.2 - Ventures with disability inclusion",
  "OI.3 - Rural communities served",
  "OI.4 - Youth employment created",
  "OI.5 - Indigenous communities supported",
  "OI.6 - Financial inclusion achieved",
  "OI.7 - Education access improved",
  "OI.8 - Healthcare access enhanced",
];

/* =========================================================
   COMPONENT
   ========================================================= */

export function VentureIntakeForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [aiAnalysis, setAiAnalysis] =
    useState<any>(null);

  const [showAiInsights, setShowAiInsights] =
    useState(false);

  /* =====================================================
     DOCUMENT STATE
     ===================================================== */

  const [documents, setDocuments] = useState<{
    businessPlan: File | null;
    founderId: File | null;
    businessRegistration: File | null;
    financialStatement: File | null;
  }>({
    businessPlan: null,
    founderId: null,
    businessRegistration: null,
    financialStatement: null,
  });

  /* =====================================================
     REACT HOOK FORM
     ===================================================== */

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors,
      isValid,
    },
  } = useForm<VentureIntakeFormData>({
    resolver: zodResolver(ventureIntakeSchema),

    mode: "onChange",

    defaultValues: {
      founderTypes: [],
      impactBeneficiaries: [],
      impactAreas: [],
      gedsiGoals: [],

      contactPhone: "",
      impactNotes: "",
      currentInvestment: "",

      targetMarket: "",
      revenueModel: "",
      challenges: "",
      supportNeeded: "",
      timeline: "",

      operationalReadiness: {
        businessPlan: false,
        financialProjections: false,
        legalStructure: false,
        teamComposition: false,
        marketResearch: false,
      },

      capitalReadiness: {
        pitchDeck: false,
        financialStatements: false,
        investorMaterials: false,
        dueDiligence: false,
        fundingHistory: false,
      },
    },
  });

  const watchedValues = watch();

  const progress =
    (currentStep / steps.length) * 100;

  /* =====================================================
     ARRAY TOGGLE
     ===================================================== */

  const toggleArrayValue = (
    field:
      | "impactBeneficiaries"
      | "impactAreas"
      | "founderTypes"
      | "gedsiGoals",
    value: string
  ) => {
    const current =
      watchedValues[field] || [];

    if (current.includes(value)) {
      setValue(
        field,
        current.filter(
          (item) => item !== value
        ) as any,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    } else {
      setValue(
        field,
        [...current, value] as any,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  };

  /* =====================================================
     DOCUMENT UPLOAD
     ===================================================== */

  const handleDocumentUpload = (
    documentType:
      | "businessPlan"
      | "founderId"
      | "businessRegistration"
      | "financialStatement",
    file: File | null
  ) => {
    setDocuments((previous) => ({
      ...previous,
      [documentType]: file,
    }));
  };

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(
        (previous) => previous + 1
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(
        (previous) => previous - 1
      );
    }
  };

  /* =====================================================
     SUBMIT
     ===================================================== */

  const onSubmit = async (
    data: VentureIntakeFormData
  ) => {
    setIsSubmitting(true);

    try {
      console.log(
        "Submitting venture:",
        data
      );

      const response = await fetch(
        "/api/ventures",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Venture API error:",
          errorText
        );

        throw new Error(
          "Failed to create venture"
        );
      }

      const result =
        await response.json();

      console.log(
        "Venture created:",
        result
      );

      /* =================================================
         AI ANALYSIS
         ================================================= */

      if (result?.id) {
        const aiResponse =
          await fetch(
            "/api/ai/analyze-venture",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                ventureId:
                  result.id,
              }),
            }
          );

        if (aiResponse.ok) {
          const aiResult =
            await aiResponse.json();

          setAiAnalysis(aiResult);
          setShowAiInsights(true);
        } else {
          console.error(
            "AI analysis failed"
          );

          /* Still show success page */
          setAiAnalysis({
            readinessScore: 0,
            gedsiAlignment: 0,
            suggestedMetrics: [],
            recommendations: [
              "Venture submitted successfully.",
              "AI analysis could not be completed.",
            ],
          });

          setShowAiInsights(true);
        }
      }
    } catch (error) {
      console.error(
        "Error submitting venture:",
        error
      );

      alert(
        "There was an error submitting the venture. Please check the console."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     STEP 1
     ========================================================= */

  const renderStep1 = () => (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Venture Name */}

        <div className="md:col-span-2">
          <Card className="p-4 border-dashed border-2 hover:border-blue-400 transition-colors">

            <div className="space-y-2">

              <div className="flex items-center space-x-2">

                <Building2 className="h-4 w-4 text-blue-500" />

                <Label
                  htmlFor="name"
                  className="font-medium"
                >
                  Venture Name *
                </Label>

              </div>

              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., EcoFarm Solutions"
                className="border-0 text-lg font-medium focus:ring-2 focus:ring-blue-500"
              />

              {errors.name && (
                <ErrorMessage>
                  {errors.name.message}
                </ErrorMessage>
              )}

            </div>

          </Card>
        </div>

        {/* Sector */}

        <Card className="p-4">

          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <TrendingUp className="h-4 w-4 text-green-500" />

              <Label className="font-medium">
                Industry Sector *
              </Label>

            </div>

            <Select
              value={watchedValues.sector || ""}
              onValueChange={(value) =>
                setValue(
                  "sector",
                  value,
                  {
                    shouldValidate:
                      true,
                    shouldDirty:
                      true,
                  }
                )
              }
            >

              <SelectTrigger>
                <SelectValue placeholder="Choose your industry" />
              </SelectTrigger>

              <SelectContent>

                {sectors.map(
                  (sector) => (
                    <SelectItem
                      key={sector}
                      value={sector}
                    >
                      {sector}
                    </SelectItem>
                  )
                )}

              </SelectContent>

            </Select>

            {errors.sector && (
              <ErrorMessage>
                {errors.sector.message}
              </ErrorMessage>
            )}

          </div>

        </Card>

        {/* Location */}

        <Card className="p-4">

          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <MapPin className="h-4 w-4 text-purple-500" />

              <Label
                htmlFor="location"
                className="font-medium"
              >
                Location *
              </Label>

            </div>

            <Input
              id="location"
              {...register("location")}
              placeholder="Ho Chi Minh City, Vietnam"
            />

            {errors.location && (
              <ErrorMessage>
                {errors.location.message}
              </ErrorMessage>
            )}

          </div>

        </Card>

        {/* Email */}

        <Card className="p-4">

          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <Mail className="h-4 w-4 text-blue-500" />

              <Label
                htmlFor="contactEmail"
                className="font-medium"
              >
                Contact Email *
              </Label>

            </div>

            <Input
              id="contactEmail"
              type="email"
              {...register(
                "contactEmail"
              )}
              placeholder="founder@yourventure.com"
            />

            {errors.contactEmail && (
              <ErrorMessage>
                {errors.contactEmail.message}
              </ErrorMessage>
            )}

          </div>

        </Card>

        {/* Phone */}

        <Card className="p-4">

          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <Phone className="h-4 w-4 text-green-500" />

              <Label
                htmlFor="contactPhone"
                className="font-medium"
              >
                Contact Phone
              </Label>

              <Badge
                variant="secondary"
                className="text-xs"
              >
                Optional
              </Badge>

            </div>

            <Input
              id="contactPhone"
              {...register(
                "contactPhone"
              )}
              placeholder="+84 901 234 567"
            />

          </div>

        </Card>

      </div>

      <StepStatus
        current="Basic information"
        next="Team & Foundation"
      />

      <NavigationButtons
        showPrevious={false}
        onNext={nextStep}
      />

    </div>
  );

  /* =========================================================
     STEP 2
     ========================================================= */

  const renderStep2 = () => (
    <div className="space-y-8">

      {/* Founder Types */}

      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">

        <div className="space-y-4">

          <div className="flex items-center space-x-2">

            <Heart className="h-5 w-5 text-purple-500" />

            <Label className="font-semibold text-lg">
              Founder Types *
            </Label>

          </div>

          <p className="text-sm text-gray-600">
            Select all that apply to your
            founding team.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {founderTypes.map(
              (type) => {
                const checked =
                  watchedValues.founderTypes?.includes(
                    type
                  ) ?? false;

                return (
                  <Card
                    key={type}
                    className="p-3"
                  >

                    <div className="flex items-center space-x-2">

                      <Checkbox
                        id={`founder-${type}`}
                        checked={checked}
                        onCheckedChange={(
                          value
                        ) => {
                          toggleArrayValue(
                            "founderTypes",
                            type
                          );
                        }}
                      />

                      <Label
                        htmlFor={`founder-${type}`}
                        className="text-sm capitalize cursor-pointer"
                      >
                        {type.replace(
                          "-",
                          " "
                        )}
                      </Label>

                    </div>

                  </Card>
                );
              }
            )}

          </div>

          {errors.founderTypes && (
            <ErrorMessage>
              {errors.founderTypes.message}
            </ErrorMessage>
          )}

        </div>

      </Card>

      {/* Team + Year */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="p-4">

          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <Users className="h-4 w-4 text-blue-500" />

              <Label className="font-medium">
                Team Size *
              </Label>

            </div>

            <Select
              value={
                watchedValues.teamSize ||
                ""
              }
              onValueChange={(value) =>
                setValue(
                  "teamSize",
                  value,
                  {
                    shouldValidate:
                      true,
                    shouldDirty:
                      true,
                  }
                )
              }
            >

              <SelectTrigger>
                <SelectValue placeholder="How many team members?" />
              </SelectTrigger>

              <SelectContent>

                {teamSizes.map(
                  (size) => (
                    <SelectItem
                      key={size}
                      value={size}
                    >
                      {size} people
                    </SelectItem>
                  )
                )}

              </SelectContent>

            </Select>

            {errors.teamSize && (
              <ErrorMessage>
                {errors.teamSize.message}
              </ErrorMessage>
            )}

          </div>

        </Card>

        <Card className="p-4">

          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <Calendar className="h-4 w-4 text-green-500" />

              <Label
                htmlFor="foundingYear"
                className="font-medium"
              >
                Founding Year *
              </Label>

            </div>

            <Input
              id="foundingYear"
              {...register(
                "foundingYear"
              )}
              placeholder="e.g. 2024"
            />

            {errors.foundingYear && (
              <ErrorMessage>
                {errors.foundingYear.message}
              </ErrorMessage>
            )}

          </div>

        </Card>

      </div>

      {/* Pitch */}

      <Card className="p-6">

        <div className="space-y-2">

          <div className="flex items-center space-x-2">

            <MessageSquare className="h-4 w-4 text-blue-500" />

            <Label
              htmlFor="pitchSummary"
              className="font-medium"
            >
              Pitch Summary *
            </Label>

          </div>

          <p className="text-sm text-gray-500">
            Tell us about your venture's
            mission and value proposition.
          </p>

          <Textarea
            id="pitchSummary"
            {...register(
              "pitchSummary"
            )}
            placeholder="We are solving [problem] for [target audience] by providing [solution]."
            rows={4}
          />

          {errors.pitchSummary && (
            <ErrorMessage>
              {errors.pitchSummary.message}
            </ErrorMessage>
          )}

        </div>

      </Card>

      {/* Inclusion */}

      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">

        <div className="space-y-2">

          <div className="flex items-center space-x-2">

            <Heart className="h-4 w-4 text-green-500" />

            <Label
              htmlFor="inclusionFocus"
              className="font-medium"
            >
              Inclusion Focus *
            </Label>

          </div>

          <Textarea
            id="inclusionFocus"
            {...register(
              "inclusionFocus"
            )}
            placeholder="How does your venture promote inclusion?"
            rows={3}
          />

          {errors.inclusionFocus && (
            <ErrorMessage>
              {errors.inclusionFocus.message}
            </ErrorMessage>
          )}

        </div>

      </Card>

      <StepStatus
        current="Team & Foundation"
        next="Impact & GEDSI"
      />

      <NavigationButtons
        onPrevious={prevStep}
        onNext={nextStep}
      />

    </div>
  );

  /* =========================================================
     STEP 3
     ========================================================= */

  const renderStep3 = () => (
  <div className="w-full max-w-[190px] mx-auto px-[11px] box-border">

    {/* HEADER */}
    <div className="mb-[10px]">
      <div className="flex items-center gap-[4px]">
        <button
          type="button"
          onClick={prevStep}
          className="text-black text-[15px] leading-none hover:opacity-60"
          aria-label="Go back"
        >
          ←
        </button>

        <h2 className="text-[14px] font-bold leading-[17px] text-[#111827]">
          Impact & GEDSI
        </h2>
      </div>

      <p className="text-[7px] leading-[8px] text-[#666] ml-[19px] mt-[2px]">
        Step 3 of 6
      </p>

      <div className="mt-[4px] ml-[19px] h-[4px] w-[168px] rounded-full bg-[#E5E7EB] overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-[#12A84E]" />
      </div>

      <p className="ml-[19px] mt-[3px] text-[5px] leading-[6px] text-[#12A84E]">
        ✓ Your progress is saved automatically
      </p>
    </div>

    {/* WHO BENEFITS */}
    <div className="rounded-[8px] border border-[#555] bg-white px-[8px] py-[8px] mb-[10px]">

      <h3 className="text-[8px] leading-[10px] font-semibold text-[#111827] mb-[6px]">
        Who benefits?
      </h3>

      <div className="space-y-[4px]">
        {beneficiaryOptions.map((option) => {
          const checked =
            watchedValues.impactBeneficiaries?.includes(option) ?? false

          return (
            <label
              key={option}
              className="flex items-center gap-[6px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  toggleArrayValue("impactBeneficiaries", option)
                }
                className="m-0 h-[10px] w-[10px] rounded-[2px] accent-[#12A84E]"
              />

              <span className="text-[7px] leading-[9px] text-[#333]">
                {option}
              </span>
            </label>
          )
        })}
      </div>

      {errors.impactBeneficiaries && (
        <p className="mt-[5px] text-[5px] leading-[6px] text-red-500">
          {errors.impactBeneficiaries.message}
        </p>
      )}
    </div>

    {/* IMPACT AREAS */}
    <div className="rounded-[8px] border border-[#555] bg-white px-[8px] py-[8px] mb-[10px]">

      <h3 className="text-[8px] leading-[10px] font-semibold text-[#111827] mb-[6px]">
        Impact Areas
      </h3>

      <div className="space-y-[4px]">
        {impactAreaOptions.map((option) => {
          const checked =
            watchedValues.impactAreas?.includes(option) ?? false

          return (
            <label
              key={option}
              className="flex items-center gap-[6px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  toggleArrayValue("impactAreas", option)
                }
                className="m-0 h-[10px] w-[10px] rounded-[2px] accent-[#12A84E]"
              />

              <span className="text-[7px] leading-[9px] text-[#333]">
                {option}
              </span>
            </label>
          )
        })}
      </div>

      {errors.impactAreas && (
        <p className="mt-[5px] text-[5px] leading-[6px] text-red-500">
          {errors.impactAreas.message}
        </p>
      )}
    </div>

    {/* ADDITIONAL NOTES */}
    <div className="rounded-[8px] border border-[#555] bg-white px-[8px] py-[8px]">

      <h3 className="text-[8px] leading-[10px] font-semibold text-[#111827] mb-[5px]">
        Additional Notes
      </h3>

      <textarea
        {...register("impactNotes")}
        placeholder="Describe your venture's impact..."
        rows={3}
        className="
          w-full
          h-[40px]
          resize-none
          rounded-[6px]
          border
          border-[#D1D5DB]
          bg-white
          px-[6px]
          py-[5px]
          text-[7px]
          leading-[9px]
          text-[#333]
          outline-none
          placeholder:text-[#9CA3AF]
          focus:border-[#12A84E]
        "
      />
    </div>

    {/* BUTTONS */}
    <div className="flex justify-between mt-[18px]">

      <button
        type="button"
        onClick={prevStep}
        className="
          h-[21px]
          rounded-full
          bg-[#DEDEDE]
          px-[11px]
          text-[6px]
          leading-none
          font-medium
          text-[#555]
          hover:bg-[#D0D0D0]
        "
      >
        Previous
      </button>

      <button
        type="button"
        onClick={nextStep}
        className="
          h-[21px]
          rounded-full
          bg-[#12A84E]
          px-[14px]
          text-[6px]
          leading-none
          font-medium
          text-white
          hover:bg-[#0E913F]
        "
      >
        Next
      </button>

    </div>
  </div>
)


const renderStep4 = () => (
  <div className="w-full max-w-[190px] mx-auto px-[11px] box-border">

    {/* HEADER */}
    <div className="mb-[12px]">

      <div className="flex items-center gap-[4px]">

        <button
          type="button"
          onClick={prevStep}
          className="text-black text-[15px] leading-none hover:opacity-60"
          aria-label="Go back"
        >
          ←
        </button>

        <h2 className="text-[14px] font-bold leading-[17px] text-[#111827]">
          Financial Information
        </h2>

      </div>

      <p className="text-[7px] leading-[8px] text-[#666] ml-[19px] mt-[2px]">
        Step 4 of 6
      </p>

      <div className="mt-[4px] ml-[19px] h-[4px] w-[168px] rounded-full bg-[#E5E7EB] overflow-hidden">
        <div className="h-full w-2/3 rounded-full bg-[#12A84E]" />
      </div>

      <p className="ml-[19px] mt-[3px] text-[5px] leading-[6px] text-[#12A84E]">
        ✓ Your progress is saved automatically
      </p>

    </div>


    {/* FUNDING REQUIRED */}
    <div className="mb-[9px]">

      <label
        htmlFor="fundingRequired"
        className="block text-[8px] leading-[10px] font-semibold text-[#111827] mb-[4px]"
      >
        Funding Required
      </label>

      <input
        id="fundingRequired"
        type="number"
        {...register("fundingRequired")}
        placeholder="Enter amount in AUD"
        className="
          w-full
          h-[27px]
          box-border
          rounded-[8px]
          border
          border-[#555]
          bg-white
          px-[8px]
          text-[7px]
          leading-none
          text-[#333]
          outline-none
          placeholder:text-[#9CA3AF]
          focus:border-[#12A84E]
        "
      />

      {errors.fundingRequired && (
        <p className="mt-[2px] text-[5px] text-red-500">
          {errors.fundingRequired.message}
        </p>
      )}

    </div>


    {/* ANNUAL REVENUE */}
    <div className="mb-[9px]">

      <label
        htmlFor="annualRevenue"
        className="block text-[8px] leading-[10px] font-semibold text-[#111827] mb-[4px]"
      >
        Annual Revenue
      </label>

      <input
        id="annualRevenue"
        type="number"
        {...register("annualRevenue")}
        placeholder="Enter annual revenue"
        className="
          w-full
          h-[27px]
          box-border
          rounded-[8px]
          border
          border-[#555]
          bg-white
          px-[8px]
          text-[7px]
          leading-none
          text-[#333]
          outline-none
          placeholder:text-[#9CA3AF]
          focus:border-[#12A84E]
        "
      />

      {errors.annualRevenue && (
        <p className="mt-[2px] text-[5px] text-red-500">
          {errors.annualRevenue.message}
        </p>
      )}

    </div>


    {/* NUMBER OF EMPLOYEES */}
    <div className="mb-[9px]">

      <label
        htmlFor="numberOfEmployees"
        className="block text-[8px] leading-[10px] font-semibold text-[#111827] mb-[4px]"
      >
        Number of Employees
      </label>

      <input
        id="numberOfEmployees"
        type="number"
        {...register("numberOfEmployees")}
        placeholder="Eg: 25"
        className="
          w-full
          h-[27px]
          box-border
          rounded-[8px]
          border
          border-[#555]
          bg-white
          px-[8px]
          text-[7px]
          leading-none
          text-[#333]
          outline-none
          placeholder:text-[#9CA3AF]
          focus:border-[#12A84E]
        "
      />

      {errors.numberOfEmployees && (
        <p className="mt-[2px] text-[5px] text-red-500">
          {errors.numberOfEmployees.message}
        </p>
      )}

    </div>


    {/* FUNDING STAGE */}
    <div className="mb-[9px]">

      <label
        htmlFor="fundingStage"
        className="block text-[8px] leading-[10px] font-semibold text-[#111827] mb-[4px]"
      >
        Funding Stage
      </label>

      <div className="relative">

        <select
          id="fundingStage"
          {...register("fundingStage")}
          className="
            w-full
            h-[27px]
            box-border
            appearance-none
            rounded-[8px]
            border
            border-[#555]
            bg-white
            px-[8px]
            text-[7px]
            text-[#333]
            outline-none
            focus:border-[#12A84E]
          "
        >
          <option value="">Select stage</option>

          {fundingStageOptions.map((stage) => (
            <option
              key={stage}
              value={stage}
            >
              {stage}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2">
          <span
            className="
              block
              w-0
              h-0
              border-l-[4px]
              border-r-[4px]
              border-t-[5px]
              border-l-transparent
              border-r-transparent
              border-t-[#777]
            "
          />
        </span>

      </div>

      {errors.fundingStage && (
        <p className="mt-[2px] text-[5px] text-red-500">
          {errors.fundingStage.message}
        </p>
      )}

    </div>


    {/* CURRENT INVESTMENT */}
    <div className="mb-[20px]">

      <label
        htmlFor="currentInvestment"
        className="block text-[8px] leading-[10px] font-semibold text-[#111827] mb-[4px]"
      >
        Current Investment
      </label>

      <input
        id="currentInvestment"
        type="number"
        {...register("currentInvestment")}
        placeholder="Enter current investment"
        className="
          w-full
          h-[27px]
          box-border
          rounded-[8px]
          border
          border-[#555]
          bg-white
          px-[8px]
          text-[7px]
          leading-none
          text-[#333]
          outline-none
          placeholder:text-[#9CA3AF]
          focus:border-[#12A84E]
        "
      />

    </div>


    {/* BUTTONS */}
    <div className="flex justify-between">

      <button
        type="button"
        onClick={prevStep}
        className="
          h-[21px]
          rounded-full
          bg-[#DEDEDE]
          px-[11px]
          text-[6px]
          leading-none
          font-medium
          text-[#555]
          hover:bg-[#D0D0D0]
        "
      >
        Previous
      </button>

      <button
        type="button"
        onClick={nextStep}
        className="
          h-[21px]
          rounded-full
          bg-[#12A84E]
          px-[14px]
          text-[6px]
          leading-none
          font-medium
          text-white
          hover:bg-[#0E913F]
        "
      >
        Next
      </button>

    </div>

  </div>
)


const renderStep5 = () => {

  const documentItems = [
    {
      key: "businessPlan" as const,
      title: "Business Plan",
      subtitle: "Required Document",
      accept: ".pdf,.doc,.docx",
    },
    {
      key: "founderId" as const,
      title: "Founder ID (ID Card)",
      subtitle: "Required Document",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      key: "businessRegistration" as const,
      title: "Business Registration Certificate",
      subtitle: "Required Document",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      key: "financialStatement" as const,
      title: "Financial Statement",
      subtitle: "Required Document",
      accept: ".pdf,.xls,.xlsx,.csv",
    },
  ]

  const allDocumentsUploaded =
    documents.businessPlan &&
    documents.founderId &&
    documents.businessRegistration &&
    documents.financialStatement

  return (
    <div className="w-full max-w-[190px] mx-auto px-[11px] box-border">

      {/* HEADER */}
      <div className="mb-[11px]">

        <div className="flex items-center gap-[4px]">

          <button
            type="button"
            onClick={prevStep}
            className="text-black text-[15px] leading-none hover:opacity-60"
            aria-label="Go back"
          >
            ←
          </button>

          <h2 className="text-[14px] font-bold leading-[17px] text-[#111827]">
            Document Checklist
          </h2>

        </div>

        <p className="text-[7px] leading-[8px] text-[#666] ml-[19px] mt-[2px]">
          Step 5 of 6
        </p>

        <div className="mt-[4px] ml-[19px] h-[4px] w-[168px] rounded-full bg-[#E5E7EB] overflow-hidden">
          <div className="h-full w-5/6 rounded-full bg-[#12A84E]" />
        </div>

        <p className="ml-[19px] mt-[3px] text-[5px] leading-[6px] text-[#12A84E]">
          ✓ Your progress is saved automatically
        </p>

      </div>


      {/* DOCUMENT LIST */}
      <div className="space-y-[7px]">

        {documentItems.map((document) => {

          const uploaded = documents[document.key]

          return (
            <div
              key={document.key}
              className="
                w-full
                min-h-[36px]
                box-border
                rounded-[8px]
                border
                border-[#555]
                bg-white
                px-[8px]
                py-[6px]
              "
            >

              <div className="flex items-center justify-between gap-[5px]">

                <div className="min-w-0 flex-1">

                  <h3 className="text-[7px] font-semibold leading-[9px] text-[#111827]">
                    {document.title}
                  </h3>

                  <p className="text-[6px] italic leading-[8px] text-[#777] mt-[1px] truncate">
                    {uploaded
                      ? uploaded.name
                      : document.subtitle}
                  </p>

                </div>


                <label
                  className="
                    shrink-0
                    cursor-pointer
                    text-[6px]
                    italic
                    leading-[8px]
                    text-[#666]
                    hover:text-[#12A84E]
                  "
                >

                  {uploaded ? "Uploaded" : "[Upload]"}

                  <input
                    type="file"
                    accept={document.accept}
                    className="hidden"
                    onChange={(event) => {

                      const file =
                        event.target.files?.[0] ?? null

                      handleDocumentUpload(
                        document.key,
                        file
                      )

                    }}
                  />

                </label>

              </div>

            </div>
          )
        })}

      </div>


      {/* NOTICE */}
      <div className="mt-[7px] rounded-[7px] bg-[#E9D9F7] px-[8px] py-[6px]">

        <p className="text-[5px] leading-[7px] text-[#5D3375] text-center">
          Please upload all required documents before submitting your venture.
        </p>

      </div>


      {/* BUTTONS */}
      <div className="flex justify-between mt-[18px]">

        <button
          type="button"
          onClick={prevStep}
          className="
            h-[21px]
            rounded-full
            bg-[#DEDEDE]
            px-[11px]
            text-[6px]
            leading-none
            font-medium
            text-[#555]
            hover:bg-[#D0D0D0]
          "
        >
          Previous
        </button>


        <button
          type="button"
          onClick={nextStep}
          disabled={!allDocumentsUploaded}
          className="
            h-[21px]
            rounded-full
            bg-[#12A84E]
            px-[14px]
            text-[6px]
            leading-none
            font-medium
            text-white
            hover:bg-[#0E913F]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Next
        </button>

      </div>

    </div>
  )
}

  /* =========================================================
     STEP 6
     ========================================================= */

  const renderStep6 = () => (
    <div className="space-y-8">

      {/* GEDSI Goals */}

      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">

        <div className="space-y-4">

          <div className="flex items-center space-x-2">

            <Target className="h-5 w-5 text-emerald-500" />

            <Label className="font-semibold text-lg">
              GEDSI Goals *
            </Label>

          </div>

          <p className="text-sm text-gray-600">
            Select the goals that apply to
            your venture.
          </p>

          <div className="grid grid-cols-1 gap-3">

            {gedsiGoals.map(
              (goal) => {

                const checked =
                  watchedValues.gedsiGoals?.includes(
                    goal
                  ) ?? false;

                const [
                  code,
                  description,
                ] = goal.split(
                  " - "
                );

                return (
                  <Card
                    key={goal}
                    className="p-4"
                  >

                    <div className="flex items-start space-x-3">

                      <Checkbox
                        id={`goal-${code}`}
                        checked={
                          checked
                        }
                        onCheckedChange={() =>
                          toggleArrayValue(
                            "gedsiGoals",
                            goal
                          )
                        }
                        className="mt-0.5"
                      />

                      <div className="flex-1">

                        <Label
                          htmlFor={`goal-${code}`}
                          className="cursor-pointer font-medium"
                        >
                          {code} -{" "}
                          {description}
                        </Label>

                        <div className="mt-1">

                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            IRIS+ Metric
                          </Badge>

                        </div>

                      </div>

                      {checked && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}

                    </div>

                  </Card>
                );
              }
            )}

          </div>

          {errors.gedsiGoals && (
            <ErrorMessage>
              {errors.gedsiGoals.message}
            </ErrorMessage>
          )}

        </div>

      </Card>

      {/* AI */}

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">

        <div className="flex items-start space-x-3">

          <div className="p-2 bg-blue-500 rounded-full">

            <Sparkles className="h-4 w-4 text-white" />

          </div>

          <div className="flex-1">

            <h4 className="font-semibold text-blue-900">
              AI-Powered Impact Analysis
            </h4>

            <p className="text-sm text-blue-700 mt-1">
              After submitting your form,
              our AI system will analyze
              your venture and suggest
              relevant GEDSI metrics.
            </p>

          </div>

        </div>

      </Card>

      {/* Supporting Documents */}

      <Card className="p-6">

        <div className="space-y-4">

          <div className="flex items-center space-x-2">

            <Upload className="h-5 w-5 text-slate-500" />

            <h3 className="text-lg font-semibold">
              Supporting Documents
            </h3>

            <Badge
              variant="secondary"
              className="text-xs"
            >
              Optional
            </Badge>

          </div>

          <p className="text-sm text-gray-600">
            Upload additional supporting
            materials if needed.
          </p>

          {/* Native file input instead of FileUpload
              so there is no prop/type mismatch */}

          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">

            <FileText className="h-8 w-8 text-gray-400 mb-2" />

            <span className="text-sm font-medium">
              Upload supporting files
            </span>

            <span className="text-xs text-gray-500 mt-1">
              PDF, Word, Excel, PowerPoint,
              JPG, PNG
            </span>

            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="hidden"
            />

          </label>

        </div>

      </Card>

      {/* Final Alert */}

      <Alert className="border-emerald-200 bg-emerald-50">

        <Award className="h-4 w-4 text-emerald-600" />

        <AlertDescription className="text-emerald-800">

          🎉 You're almost done! After
          submitting, you'll receive a
          readiness assessment and
          personalized recommendations.

        </AlertDescription>

      </Alert>

      {/* Navigation */}

      <div className="flex justify-between">

        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          ← Previous
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !isValid
          }
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >

          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Submit & Analyze
            </>
          )}

        </Button>

      </div>

    </div>
  );

  /* =========================================================
     STEP SWITCH
     ========================================================= */

  const renderStep = () => {

    switch (currentStep) {

      case 1:
        return renderStep1();

      case 2:
        return renderStep2();

      case 3:
        return renderStep3();

      case 4:
        return renderStep4();

      case 5:
        return renderStep5();

      case 6:
        return renderStep6();

      default:
        return null;

    }
  };

  /* =========================================================
     AI RESULTS
     ========================================================= */

  if (
    showAiInsights &&
    aiAnalysis
  ) {

    return (
      <div className="max-w-4xl mx-auto space-y-6">

        <Card>

          <CardHeader>

            <div className="flex items-center space-x-2">

              <Sparkles className="h-5 w-5 text-blue-500" />

              <CardTitle>
                AI Analysis Complete!
              </CardTitle>

            </div>

            <CardDescription>
              Your venture has been
              analyzed successfully.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <ScoreCard
                title="Readiness Score"
                value={
                  aiAnalysis
                    .readinessScore ??
                  0
                }
                className="bg-green-50 text-green-600"
              />

              <ScoreCard
                title="GEDSI Alignment"
                value={
                  aiAnalysis
                    .gedsiAlignment ??
                  0
                }
                className="bg-blue-50 text-blue-600"
              />

              <ScoreCard
                title="Suggested Metrics"
                value={
                  aiAnalysis
                    .suggestedMetrics
                    ?.length ??
                  0
                }
                suffix=""
                className="bg-purple-50 text-purple-600"
              />

            </div>

            {/* Recommendations */}

            <div className="space-y-4">

              <h4 className="font-semibold">
                AI Recommendations
              </h4>

              <div className="space-y-2">

                {(
                  aiAnalysis
                    .recommendations ||
                  []
                ).map(
                  (
                    rec: string,
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="flex items-start space-x-2"
                    >

                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />

                      <p className="text-sm">
                        {rec}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Metrics */}

            <div className="space-y-4">

              <h4 className="font-semibold">
                Suggested GEDSI Metrics
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                {(
                  aiAnalysis
                    .suggestedMetrics ||
                  []
                ).map(
                  (
                    metric: any,
                    index: number
                  ) => (

                    <Badge
                      key={index}
                      variant="outline"
                      className="justify-start"
                    >
                      {metric.code ??
                        "Metric"}
                      :{" "}
                      {metric.name ??
                        "Suggested metric"}
                    </Badge>

                  )
                )}

              </div>

            </div>

            <Button
              onClick={() => {
                setShowAiInsights(
                  false
                );
              }}
              variant="outline"
            >
              Back to Form
            </Button>

          </CardContent>

        </Card>

      </div>
    );
  }

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Progress Header */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Venture Intake Form
          </h2>

          <Badge variant="outline">
            Step {currentStep} of{" "}
            {steps.length}
          </Badge>

        </div>

        <Progress
          value={progress}
          className="w-full"
        />

        <div className="flex items-center space-x-2">

          <Building2 className="h-4 w-4 text-blue-500" />

          <span className="text-sm text-gray-600">
            {
              steps[
                currentStep - 1
              ].title
            }{" "}
            -{" "}
            {
              steps[
                currentStep - 1
              ].description
            }
          </span>

        </div>

      </div>

      {/* Form */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center space-x-2">

            <span>
              {
                steps[
                  currentStep - 1
                ].title
              }
            </span>

            {currentStep ===
              steps.length && (
              <Sparkles className="h-4 w-4 text-blue-500" />
            )}

          </CardTitle>

          <CardDescription>
            {
              steps[
                currentStep - 1
              ].description
            }
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >

            {renderStep()}

          </form>

        </CardContent>

      </Card>

    </div>
  );
}

/* =========================================================
   SMALL HELPER COMPONENTS
   ========================================================= */

function ErrorMessage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <p className="text-sm text-red-500 flex items-center gap-1">

      <AlertCircle className="h-3 w-3" />

      <span>{children}</span>

    </p>
  );
}

/* ========================================================= */

function StepStatus({
  current,
  next,
}: {
  current: string;
  next: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">

      <div className="flex items-center justify-between text-sm text-gray-600">

        <span>
          ✅ {current}
        </span>

        <span>
          Next: {next}
        </span>

      </div>

    </div>
  );
}

/* ========================================================= */

function NavigationButtons({
  showPrevious = true,
  onPrevious,
  onNext,
}: {
  showPrevious?: boolean;
  onPrevious?: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex justify-between">

      {showPrevious ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          ← Previous
        </Button>
      ) : (
        <div />
      )}

      <Button
        type="button"
        onClick={onNext}
      >
        Next →
      </Button>

    </div>
  );
}

/* ========================================================= */

function FinancialInput({
  id,
  label,
  placeholder,
  register,
  error,
  optional = false,
}: {
  id:
    | "fundingRequired"
    | "annualRevenue"
    | "numberOfEmployees"
    | "currentInvestment";

  label: string;

  placeholder: string;

  register: any;

  error?: string;

  optional?: boolean;
}) {
  return (
    <div className="mb-[8px]">

      <label
        htmlFor={id}
        className="block text-[8px] leading-[10px] font-semibold text-gray-900 mb-[4px]"
      >
        {label}

        {optional && (
          <span className="ml-1 text-gray-400 font-normal">
            Optional
          </span>
        )}
      </label>

      <input
        id={id}
        type="number"
        {...register(id)}
        placeholder={placeholder}
        className="w-full h-[27px] box-border rounded-[8px] border border-[#555] bg-white px-[8px] text-[7px] italic leading-none outline-none placeholder:text-gray-400 focus:border-[#12A84E]"
      />

      {error && (
        <p className="text-[6px] text-red-500 mt-[2px]">
          {error}
        </p>
      )}

    </div>
  );
}

/* ========================================================= */

function ScoreCard({
  title,
  value,
  suffix = "%",
  className,
}: {
  title: string;
  value: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <div
      className={`p-4 rounded-lg ${className}`}
    >

      <h4 className="font-semibold">
        {title}
      </h4>

      <p className="text-2xl font-bold">
        {value}
        {suffix}
      </p>

    </div>
  );
}