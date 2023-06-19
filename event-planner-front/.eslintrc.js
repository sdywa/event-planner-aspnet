module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "react",
        "@typescript-eslint",
        "react-hooks",
        "simple-import-sort",
    ],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        // increase the severity of rules so they are auto-fixable
        "simple-import-sort/imports": [
            "error",
            {
                groups: [
                    // Packages `react` related packages come first.
                    ["^react", "^@?\\w"],
                    // Internal packages.
                    ["^(@|components)(/.*|$)"],
                    // Side effect imports.
                    ["^\\u0000"],
                    // Parent imports. Put `..` last.
                    ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                    // Style imports.
                    ["^.+\\.?(css)$"],
                ],
            },
        ],
        "simple-import-sort/exports": "error",
    },
};
