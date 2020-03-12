import * as path from 'path';
import * as fs from 'fs';
import * as webhost from 'webhost';
import { RouteInfo } from './Route';
import { IController, IControllerType } from '../IApi';

export class ControllerSelector {
    public controllerRoot: string;

    private getControllerPath(rootApp: string): string {
        if (!this.controllerRoot) {
            this.controllerRoot = path.join(rootApp, 'Controllers');
        }
        return this.controllerRoot;
    }

    public getType(context: webhost.IContext, route: RouteInfo): IControllerType {
        let ctrPath = this.getControllerPath(context.server.rootApp) + '\\' + route.getData('controller') + '.js';
        let ctrFile = path.resolve(ctrPath);

        if (!fs.existsSync(ctrFile)) {
            return null;
        }

        let ctrModule = require(ctrFile);

        return ctrModule;
    }
}