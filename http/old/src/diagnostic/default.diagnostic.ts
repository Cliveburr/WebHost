import { IDiagnostic, DiagnosticLevel } from './diagnostic.data';

export class DefaultDiagnostic implements IDiagnostic {
    
    public constructor(
        private appDiagnosticLevel: DiagnosticLevel
    ) {
    }

    public log(text: any, level?: DiagnosticLevel): void {
        if ((level || DiagnosticLevel.Normal) <= this.appDiagnosticLevel) {
            if (level == DiagnosticLevel.Error) {
                console.error(text);
            }
            else {
                console.log(text);
            }
        }
    }
}