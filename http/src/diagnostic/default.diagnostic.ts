import { IDiagnostic, DiagnosticLevel } from './diagnostic.data';
import { makeStaticProvider, makeObjectProvider, IContainer } from 'providerjs';

export class DefaultDiagnostic implements IDiagnostic {
    
    private level: DiagnosticLevel;

    public constructor(
        container: IContainer
    ) {
        this.level = container.get<DiagnosticLevel>(appDiagnosticLevelProvider);
    }

    public log(text: any, level?: DiagnosticLevel): void {
        if ((level || DiagnosticLevel.Normal) <= this.level) {
            if (level == DiagnosticLevel.Error) {
                console.error(text);
            }
            else {
                console.log(text);
            }
        }
    }
}

export const appDiagnosticLevelProvider = makeObjectProvider<DiagnosticLevel>(DiagnosticLevel.Normal);
export const diagnosticProvider = makeStaticProvider<IDiagnostic>(DefaultDiagnostic);
