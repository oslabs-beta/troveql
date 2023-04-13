require('dotenv').config()

module.exports = 
{
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        exe:'TroveMetrics.exe'
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ['darwin', 'linux', 'win32'],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/renderer.jsx',
              name: 'main_window',
              preload: {
                js: './src/preload.ts',
              },
            },
          ],
        },
      },
    },
  ],
};
