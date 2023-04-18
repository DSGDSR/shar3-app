import { Tray, nativeImage, nativeTheme } from "electron";
import { join } from "path";

export const constructTray = (themeSource: "system" | "light" | "dark"): Tray => {
    // Setup the menubar with an icon
    const iconPath = join(process.env.PUBLIC, `IconTemplate_${themeSource !== 'dark' ? 'l' : 'd'}.png`)
    const image = nativeImage.createFromPath(iconPath);
    const tray = new Tray(image.resize({ width: 16, height: 16 }));

    return tray;
};

// TODO tray menu on right click