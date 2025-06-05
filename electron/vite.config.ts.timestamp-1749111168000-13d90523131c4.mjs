// vite.config.ts
import { defineConfig } from "file:///B:/Records/Programming/Python/ScreenHud/electron/node_modules/vite/dist/node/index.js";
import path from "node:path";
import react from "file:///B:/Records/Programming/Python/ScreenHud/electron/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///B:/Records/Programming/Python/ScreenHud/electron/node_modules/@tailwindcss/vite/dist/index.mjs";
import tsconfigPaths from "file:///B:/Records/Programming/Python/ScreenHud/electron/node_modules/vite-tsconfig-paths/dist/index.js";
import electron from "file:///B:/Records/Programming/Python/ScreenHud/electron/node_modules/vite-plugin-electron/dist/index.mjs";
var __vite_injected_original_dirname = "B:\\Records\\Programming\\Python\\ScreenHud\\electron";
var vite_config_default = defineConfig({
  server: {
    hmr: { overlay: false },
    fs: { allow: [".", "../"] }
  },
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "index.html"),
        control: path.resolve(__vite_injected_original_dirname, "control.html")
      },
      output: {
        inlineDynamicImports: false
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    electron([
      {
        // Electron Main Process
        entry: "electron/main.js"
      },
      {
        // Electron Preload for Main Window
        entry: "electron/preload_main.js",
        vite: {
          build: {
            outDir: "dist-electron",
            rollupOptions: {
              input: "electron/preload_main.js",
              output: {
                inlineDynamicImports: false,
                format: "esm",
                entryFileNames: "[name].mjs"
              }
            }
          }
        }
      },
      {
        // Electron Preload for Control Window
        entry: "electron/preload_control.js",
        vite: {
          build: {
            outDir: "dist-electron",
            rollupOptions: {
              input: "electron/preload_control.js",
              output: {
                inlineDynamicImports: false,
                format: "esm",
                entryFileNames: "[name].mjs"
              }
            }
          }
        }
      }
    ])
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJCOlxcXFxSZWNvcmRzXFxcXFByb2dyYW1taW5nXFxcXFB5dGhvblxcXFxTY3JlZW5IdWRcXFxcZWxlY3Ryb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkI6XFxcXFJlY29yZHNcXFxcUHJvZ3JhbW1pbmdcXFxcUHl0aG9uXFxcXFNjcmVlbkh1ZFxcXFxlbGVjdHJvblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQjovUmVjb3Jkcy9Qcm9ncmFtbWluZy9QeXRob24vU2NyZWVuSHVkL2VsZWN0cm9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24nXG5cbi8vIE1haW4gVml0ZSBDb25maWdcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHNlcnZlcjoge1xuICAgIGhtcjogeyBvdmVybGF5OiBmYWxzZSB9LFxuICAgIGZzOiB7IGFsbG93OiBbJy4nLCAnLi4vJ10gfSxcbiAgfSxcbiAgYmFzZTogJy4vJyxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBtYWluOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICBjb250cm9sOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnY29udHJvbC5odG1sJyksXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgZWxlY3Ryb24oW1xuICAgICAge1xuICAgICAgICAvLyBFbGVjdHJvbiBNYWluIFByb2Nlc3NcbiAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluLmpzJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIEVsZWN0cm9uIFByZWxvYWQgZm9yIE1haW4gV2luZG93XG4gICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vcHJlbG9hZF9tYWluLmpzJyxcbiAgICAgICAgdml0ZToge1xuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uJyxcbiAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgaW5wdXQ6ICdlbGVjdHJvbi9wcmVsb2FkX21haW4uanMnLFxuICAgICAgICAgICAgICBvdXRwdXQ6IHsgXG4gICAgICAgICAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IGZhbHNlLCAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdlc20nLFxuICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLm1qcycsXG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gRWxlY3Ryb24gUHJlbG9hZCBmb3IgQ29udHJvbCBXaW5kb3dcbiAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9wcmVsb2FkX2NvbnRyb2wuanMnLFxuICAgICAgICB2aXRlOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24nLFxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICBpbnB1dDogJ2VsZWN0cm9uL3ByZWxvYWRfY29udHJvbC5qcycsXG4gICAgICAgICAgICAgIG91dHB1dDogeyBcbiAgICAgICAgICAgICAgICBpbmxpbmVEeW5hbWljSW1wb3J0czogZmFsc2UsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnZXNtJyxcbiAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5tanMnLFxuICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSksXG4gIF0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLG9CQUFvQjtBQUMzVyxPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sY0FBYztBQUxyQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixLQUFLLEVBQUUsU0FBUyxNQUFNO0FBQUEsSUFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUFBLEVBQzVCO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsUUFDMUMsU0FBUyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2pEO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixzQkFBc0I7QUFBQSxNQUN4QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCxTQUFTO0FBQUEsTUFDUDtBQUFBO0FBQUEsUUFFRSxPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0E7QUFBQTtBQUFBLFFBRUUsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFVBQ0osT0FBTztBQUFBLFlBQ0wsUUFBUTtBQUFBLFlBQ1IsZUFBZTtBQUFBLGNBQ2IsT0FBTztBQUFBLGNBQ1AsUUFBUTtBQUFBLGdCQUNOLHNCQUFzQjtBQUFBLGdCQUN0QixRQUFRO0FBQUEsZ0JBQ1IsZ0JBQWdCO0FBQUEsY0FDakI7QUFBQSxZQUNIO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBO0FBQUEsUUFFRSxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsVUFDSixPQUFPO0FBQUEsWUFDTCxRQUFRO0FBQUEsWUFDUixlQUFlO0FBQUEsY0FDYixPQUFPO0FBQUEsY0FDUCxRQUFRO0FBQUEsZ0JBQ04sc0JBQXNCO0FBQUEsZ0JBQ3RCLFFBQVE7QUFBQSxnQkFDUixnQkFBZ0I7QUFBQSxjQUNqQjtBQUFBLFlBQ0g7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
