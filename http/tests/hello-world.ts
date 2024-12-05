import { WebHost } from "../src";

const host = new WebHost({
    port: 8080
});

host.use(async (ctx) => {
    ctx.response.write('Hello, World!');
});

host.run();