import { createContext, useState } from "react";

const wallpaperContext = createContext();

const WallpaperProvider = ({ children }) => {
    const [wallpaper, setWallpaper] = useState("");

    return (
        <wallpaperContext.Provider value={{ wallpaper, setWallpaper }}>
            {children}
        </wallpaperContext.Provider>
    );
};

export { wallpaperContext, WallpaperProvider };