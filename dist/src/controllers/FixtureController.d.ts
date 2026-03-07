import type { Request, Response } from "express";
export declare class FixtureController {
    static createFixture(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getFixturesByDate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=FixtureController.d.ts.map