import { Config } from 'bili'

const config: Config = {
  input: 'src/OmegaNum.ts',
  extendRollupConfig: (config) => {
    config.outputConfig.exports = "auto";
    return config;
  },
  output: {
    format: ["umd", "umd-min", "esm", "cjs"],
    moduleName: "OmegaNum",
    sourceMap: false,
    fileName: (context, defaultFileName) => {
      switch (context.format) {
        case "umd":
          return context.minify ? "OmegaNum.min.js" : "OmegaNum.js";
        case "esm":
          return "OmegaNum.esm.js";
        case "cjs":
          return "OmegaNum.cjs.js";
        default:
          return defaultFileName;
      }
    },
  },
}

export default config