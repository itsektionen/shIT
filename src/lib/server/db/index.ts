import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DATABASE_URL } from "$app/env/private";

// Defer DB init until it is used. Otherwise node segfaults during build :skull:
// SvelteKit/Vite imports this file during build for route analysis, and the
// connection it opens is still alive when node tears things down
function create() {
    return drizzle({ client: createClient({ url: DATABASE_URL }) });
}
let instance: ReturnType<typeof create> | undefined;
export const db = new Proxy({} as ReturnType<typeof create>, {
    get: (_, prop) => Reflect.get((instance ??= create()), prop),
});
