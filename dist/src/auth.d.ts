export declare const auth: import("better-auth").Auth<{
    secret: string;
    emailAndPassword: {
        enabled: true;
        autoSignIn: true;
    };
    baseURL: string;
    trustedOrigins: string[];
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    session: {
        cookie: {
            domain: string | undefined;
            sameSite: string;
            secure: boolean;
        };
        cookieCache: {
            maxAge: number;
            enabled: true;
            strategy: "compact";
            refreshCache: {
                updateAge: number;
            };
        };
        expiresIn: number;
        updateAge: number;
    };
}>;
//# sourceMappingURL=auth.d.ts.map