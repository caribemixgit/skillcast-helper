import { Parcel } from "@parcel/core";
import * as fs from "fs";
import * as path from "path";

(async () => {
    // delete dist folder
    const distPath = path.join(__dirname, "..", "dist");
    if (fs.existsSync(distPath)) {
        fs.rmdirSync(distPath, { recursive: true });
    }
    const parcel = new Parcel({
        entries: "src/index.ts",
        defaultConfig: "@parcel/config-default",
        shouldContentHash: false,
        shouldDisableCache: true,
        shouldAutoInstall: true,
        defaultTargetOptions: {
            sourceMaps: false,
            shouldScopeHoist: false
        }
    });
    await parcel.run();
})();
