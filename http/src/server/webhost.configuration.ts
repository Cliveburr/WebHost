import { DiagnosticLevel } from "../diagnostic/diagnostic.data";

export interface WebHostConfiguration {
    port?: number;
    diagnostic?: DiagnosticLevel;
    approot?: string;
    wwwroot?: string;
    timeout?: number;
}