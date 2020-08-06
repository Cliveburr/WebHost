
export var WS_PATH_LOADER_PROVIDER = 'WS_PATH_LOADER_PROVIDER';

export interface IPathLoader {
    getPath(pathName: string): Object | undefined;
}
