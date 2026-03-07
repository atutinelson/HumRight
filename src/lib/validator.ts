import {z} from "zod";


// ------------------------
// CREATE SCHEMAS
// ------------------------
export const createPlanSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  description: z.string().min(10).max(1000),
  oddRange: z.string().min(1).max(50),
  isActive: z.boolean().optional().default(true),
});

export const createFixtureSchema = z.object({
  matchDate: z.string(), // ISO string
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  competition: z.string().min(1),
  fixtureTip: z.string().min(1),
  result: z.string().optional(),
  status: z.enum(["SCHEDULED", "PLAYED", "CANCELLED"]).optional(),
});

export const createPredictionSchema = z.object({
  tipText: z.string().min(5).max(1000), // More realistic length limits
  odd: z.number().positive().max(100), // Reasonable max odds
  tipDate: z.string().refine((date) => {
    const d = new Date(date);
    return d > new Date(); // Must be in the future
  }, "Tip date must be in the future"),
  isPublished: z.boolean().optional().default(false),
  fixtureId: z.number().int().positive(), // Keep for backward compatibility
  fixtureIds: z.array(z.number().int().positive()).optional(), // New array support
  planId: z.number().int().positive().optional(),
  // Temporarily commented out until migration is run
  // confidence: z.number().int().min(1).max(10).optional(),
  // category: z.string().min(1).max(50).optional(),
  // priority: z.number().int().min(1).max(3).optional().default(1),
}).refine((data) => data.fixtureId || (data.fixtureIds && data.fixtureIds.length > 0), {
  message: "Either fixtureId or fixtureIds must be provided",
  path: ["fixtureId"],
});

// ------------------------
// EDIT SCHEMAS (all fields optional)
// ------------------------
export const editPlanSchema = createPlanSchema.partial();
export const editFixtureSchema = createFixtureSchema.partial();

// Create edit schema without refinements for predictions
export const editPredictionSchema = z.object({
  tipText: z.string().min(5).max(1000).optional(),
  odd: z.number().positive().max(100).optional(),
  tipDate: z.string().optional(), // Remove refinement for edit
  isPublished: z.boolean().optional(),
  fixtureId: z.number().int().positive().optional(),
  fixtureIds: z.array(z.number().int().positive()).optional(),
  planId: z.number().int().positive().optional(),

});