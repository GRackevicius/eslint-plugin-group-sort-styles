# ESLint Styled Components Sorting Plugin

This ESLint plugin helps to enforce a consistent sorting order for CSS declarations within styled-components. It groups CSS properties according to a predefined configuration.

## Example

    export const DrawerStyles = css<DrawerStyledTypes>`
        transition: transform 0.3s ease;
        border-top-left-radius: 16px;
        margin-top: auto;
        border-top-right-radius: 16px;
        border-radius: 0px;
        max-width: 100%;
        width: 100%;

        &.inactive {
            transform: translateY(100%);
        }
    `;

    ->

    export const DrawerStyles = css<DrawerStyledTypes>`
        width: 100%;
        max-width: 100%;
        margin-top: auto;
        border-radius: 0px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        transition: transform 0.3s ease;

        &.inactive {
            transform: translateY(100%);
        }
    `;

--\*--

    const fontStyles = css`
        /* font-family: 'Roboto', sans-serif; */
        font-weight: 700;
        font-size: 14px;
    `;

    ->

    const fontStyles = css`
        /* font-family: 'Roboto', sans-serif; */
        font-size: 14px;
        font-weight: 700;
    `;

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
