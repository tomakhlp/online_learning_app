import {TokenUser} from "./TokenUser";

declare global {
    namespace Express {
        export interface Request {
            user?: TokenUser;
        }
    }
}
