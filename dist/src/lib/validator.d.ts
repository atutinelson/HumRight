import { z } from "zod";
export declare const createPlanSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    description: z.ZodString;
    oddRange: z.ZodString;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const createFixtureSchema: z.ZodObject<{
    matchDate: z.ZodString;
    homeTeam: z.ZodString;
    awayTeam: z.ZodString;
    competition: z.ZodString;
    fixtureTip: z.ZodString;
    result: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        SCHEDULED: "SCHEDULED";
        PLAYED: "PLAYED";
        CANCELLED: "CANCELLED";
    }>>;
}, z.core.$strip>;
export declare const createPredictionSchema: z.ZodObject<{
    tipText: z.ZodString;
    odd: z.ZodNumber;
    tipDate: z.ZodString;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    fixtureId: z.ZodNumber;
    fixtureIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    planId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const editPlanSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    oddRange: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
export declare const editFixtureSchema: z.ZodObject<{
    matchDate: z.ZodOptional<z.ZodString>;
    homeTeam: z.ZodOptional<z.ZodString>;
    awayTeam: z.ZodOptional<z.ZodString>;
    competition: z.ZodOptional<z.ZodString>;
    fixtureTip: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        SCHEDULED: "SCHEDULED";
        PLAYED: "PLAYED";
        CANCELLED: "CANCELLED";
    }>>>;
}, z.core.$strip>;
export declare const editPredictionSchema: z.ZodObject<{
    tipText: z.ZodOptional<z.ZodString>;
    odd: z.ZodOptional<z.ZodNumber>;
    tipDate: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    fixtureId: z.ZodOptional<z.ZodNumber>;
    fixtureIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    planId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=validator.d.ts.map