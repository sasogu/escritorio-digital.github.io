const wallpaperImports = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const sortedWallpaperUrls = Object.entries(wallpaperImports)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

export const wallpaperUrls = sortedWallpaperUrls;
export const defaultWallpaper = sortedWallpaperUrls[0] ? `url(${sortedWallpaperUrls[0]})` : 'none';
