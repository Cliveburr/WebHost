
export enum DiagnosticLevel {
    Silence = 0,
    Error = 1,
    Normal = 2,
    Detail = 3
}

export interface IDiagnostic {
    log(text: any, level?: DiagnosticLevel): void;
}
