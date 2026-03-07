import type { Request, Response } from "express";
export declare class AuthController {
    static getSession(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AuthController.d.ts.map