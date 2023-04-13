require('dotenv').config()

module.exports = 
{

  packagerConfig: {
    icon: './src/assets/troveql-icon',
    osxSign: {
      identity: process.env.TEAM_IDENTIY,
      'hardened-runtime': true,
      verbose: true
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APP_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        exe:'TroveMetrics.exe',
        setupIcon: './src/assets/troveql-icon.ico'
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ['darwin', 'linux', 'win32'],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: './src/assets/troveql-icon.png'
        }
      },
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
