/* eslint-disable eslint-plugin/prefer-output-null */
"use strict";

const rule = require("../../../lib/rules/sort-declarations-in-groups");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

ruleTester.run("sort-declarations-in-groups", rule, {
  valid: [
    {
      code: `
            const DropDownListContainer = styled("div")\`
                    position: relative;
                    top: 0px;
                    z-index: 10;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    background-color: \${theme.colors.dropdownBgActive};
                \`;
            `,
    },
    {
      code: `
            const DropDownHeader = styled("div")\`
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 12px;
                    cursor: pointer;

                    .dropdown-icon {
                        width: 16px;
                        height: 16px;
                        fill: #fff;
                    }
                \`;
            `,
    },
    {
      code: `
            const CloseIconStyled = styled(CloseIcon)\`
                    position: absolute;
                    top: 34px;
                    right: 28px;
                    z-index: 1;
                    width: 12px;
                    height: 12px;
                    cursor: pointer;
                \`;
            `,
    },
    {
      code: `
            const ModalStyled = styled.div<ModalStyledTypes>\`
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 8px;

                    transition: opacity 0.3s ease;

                    &.inactive {
                        opacity: 0;
                    }

                    &:focus,
                    &:focus-visible {
                        outline: none;
                    }
                \`;
            `,
    },
    {
      code: `
            const DrawerStyles = css<DrawerStyledTypes>\`
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
                \`;
            `,
    },
  ],

  invalid: [
    {
      code: `
            const Content = styled.div<ContentStyledTypes>\`
                    display: flex;
                    height: 100%;
                    width: 100%;
                \`;
            `,
      errors: [{ messageId: "sort-declarations-in-groups" }],
      output: `
            const Content = styled.div<ContentStyledTypes>\`
                    display: flex;
                    width: 100%;
                    height: 100%;
                \`;
            `,
    },
    {
      code: `
            export const DrawerStyles = css<DrawerStyledTypes>\`
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
                \`;
            `,
      errors: [{ messageId: "sort-declarations-in-groups" }],
      output: `
            export const DrawerStyles = css<DrawerStyledTypes>\`
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
                \`;
            `,
    },
    {
      code: `
            const fontStyles = css\`
                    /* font-family: 'Roboto', sans-serif; */
                    font-weight: 700;
                    font-size: 14px;
                \`;
            `,
      errors: [{ messageId: "sort-declarations-in-groups" }],
      output: `
            const fontStyles = css\`
                    /* font-family: 'Roboto', sans-serif; */
                    font-size: 14px;
                    font-weight: 700;
                \`;
            `,
    },
  ],
});
