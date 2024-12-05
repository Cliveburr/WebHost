
export enum DiagnosticLevel {
    Silence = 0,
    Error = 1,
    Normal = 2,
    Detail = 3
}

export interface IDiagnostic {
    log(text: any, level?: DiagnosticLevel): void;
}

export var DIAGNOSTIC_LEVEL = 'DIAGNOSTIC_LEVEL';
export var DIAGNOSTIC = 'DIAGNOSTIC';