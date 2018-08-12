import * as core from "express-serve-static-core";

export interface IRoutable {
    routes(router: core.Router): void;
}