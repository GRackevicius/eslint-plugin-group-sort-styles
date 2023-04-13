# ESLint Styled Components Sorting Plugin

This ESLint plugin helps to enforce a consistent sorting order for CSS declarations within styled-components. It groups CSS properties according to a predefined configuration.

## Example

## Usage and Installation

To use this plugin, first, install the plugin as a development dependency:

`npm install --save-dev eslint-plugin-styled-components-sorting`

Then, add the plugin and rule to your `.eslintrc` file:

    {
      "plugins": ["eslint-plugin-group-sort-styles"],
      "rules": {
        "eslint-plugin-group-sort-styles/sort-declarations-in-groups": "warn"
      }
    }

## Rules

This plugin provides a single rule: `sort-declarations-in-groups`. This rule checks that CSS declarations within styled components are sorted in groups, as defined in the `groups.js` configuration file.

When enabled, the rule will warn you when it detects an incorrect sorting order in your styled-components. It also supports the `--fix` option to automatically sort the declarations according to the predefined configuration.
