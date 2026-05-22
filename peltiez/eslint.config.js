import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";

/** Props DOM / R3F / Three.js autorisés hors liste HTML standard */
const R3F_DOM_IGNORE = [
  "cmdk-input-wrapper",
  "toast-close",
  "args",
  "attach",
  "castShadow",
  "receiveShadow",
  "emissive",
  "emissiveIntensity",
  "metalness",
  "roughness",
  "rotation",
  "position",
  "intensity",
  "distance",
  "transparent",
  "depthWrite",
  "blending",
  "object",
  "geometry",
  "dispose",
  "map",
  "material",
  "frustumCulled",
  "envMapIntensity",
  "flatShading",
  "clearcoat",
  "transmission",
  "thickness",
  "ior",
];

const reactAppRules = {
  "no-unused-vars": "off",
  "react/jsx-uses-vars": "error",
  "react/jsx-uses-react": "error",
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "warn",
    {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
    },
  ],
  "react/prop-types": "off",
  "react/react-in-jsx-scope": "off",
  "react/no-unknown-property": [
    "error",
    { ignore: R3F_DOM_IGNORE },
  ],
  "react-hooks/rules-of-hooks": "error",
};

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.min.js"],
  },
  {
    files: [
      "src/components/**/*.{js,mjs,cjs,jsx}",
      "src/pages/**/*.{js,mjs,cjs,jsx}",
      "src/Layout.jsx",
    ],
    ignores: ["src/lib/**/*", "src/components/ui/**/*"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    rules: reactAppRules,
  },
  {
    files: ["src/world/**/*.{js,mjs,cjs,jsx}"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      ...reactAppRules,
      "react/no-unknown-property": "off",
    },
  },
];
