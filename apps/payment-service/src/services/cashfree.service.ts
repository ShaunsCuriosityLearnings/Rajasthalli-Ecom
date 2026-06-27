import { Cashfree, CFEnvironment } from "cashfree-pg";

const environment = process.env.CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

export const cashfree = new Cashfree(
    environment,
    process.env.CASHFREE_CLIENT_ID!,
    process.env.CASHFREE_CLIENT_SECRET!
);
