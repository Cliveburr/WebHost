import { AppInstance, ApplicationData } from "./appInstance";

export const Application = (data: ApplicationData): ClassDecorator => {
    return (cls: Object) => {
        AppInstance.generate(data, cls);
    }
};