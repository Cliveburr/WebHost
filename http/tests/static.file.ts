import { WebHost } from "../src";
import { DefaultFiles } from "../src/file/defaultfiles.pipe";
import { NotFound } from "../src/file/notfound.pipe";
import { StaticFiles } from "../src/file/staticfiles.pipe";

const host = new WebHost({
    port: 8080,
    wwwroot: __dirname + '\\..\\..\\tests\\wwwroot'
});

host.use(DefaultFiles);
host.use(StaticFiles);
host.use(NotFound);

host.run();
