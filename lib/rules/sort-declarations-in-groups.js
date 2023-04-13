"use strict";

const postcss = require("postcss");
const PROPERTY_GROUPS = require("../groups");

// Check if two declarations are equal
function areDeclarationsEqual(a, b) {
  return (
    a.source.start.line === b.source.start.line &&
    a.source.start.column === b.source.start.column
  );
}

// Get the index of the property group for a given declaration
function getPropertyGroupIndex(declaration) {
  return PROPERTY_GROUPS.findIndex((group) => group.includes(declaration.prop));
}

// Check if a node is a styled component
function isStyledComponent(node) {
  const { tag } = node;

  // Check if the node is a `css` identifier
  if (tag.type === "Identifier" && tag.name === "css") {
    return true;
  }

  // Check if the node is a `styled` expression
  if (tag.type === "MemberExpression" && tag.object.name === "styled") {
    return true;
  }

  // Check if the node is a `styled()` expression or a `styled.xyz()` expression
  if (
    tag.type === "CallExpression" &&
    (tag.callee.name === "styled" ||
      (tag.callee.object &&
        ((tag.callee.object.callee &&
          tag.callee.object.callee.name === "styled") ||
          (tag.callee.object.object &&
            tag.callee.object.object.name === "styled"))))
  ) {
    return true;
  }

  return false;
}

// Check if a rule is atomic, i.e. it does not have any nested rules
function isAtomicRule(rule, isRoot = false) {
  const declarations = rule.nodes.filter((node) => node.type === "decl");
  const nestedRules = rule.nodes.filter((node) => node.type === "rule");

  if (declarations.length === 0 && !isRoot) {
    return true;
  }

  const sortedDeclarations = sortDeclarations(declarations);

  for (let i = 0; i < declarations.length; i++) {
    if (!areDeclarationsEqual(declarations[i], sortedDeclarations[i])) {
      return false;
    }
  }

  for (const nestedRule of nestedRules) {
    if (!isAtomicRule(nestedRule)) {
      return false;
    }
  }

  return true;
}

// Check if a rule and all its child rules are atomic
function isValidRule(rule) {
  const { nodes } = rule;

  // Check if the rule is atomic
  if (!isAtomicRule(rule, true)) {
    return false;
  }

  // Check all child rules recursively
  for (const node of nodes) {
    if (node.type === "rule" && !isValidRule(node)) {
      return false;
    }
  }

  return true;
}

// Get the styles from a node's template literal
function getNodeStyles(node) {
  const [firstQuasi, ...quasis] = node.quasi.quasis;
  const lineBreakCount = node.quasi.loc.start.line - 1;

  // Build the style string by concatenating the raw values
  // of each template literal part
  let styles = `${"\n".repeat(lineBreakCount)}${" ".repeat(
    node.quasi.loc.start.column + 1
  )}${firstQuasi.value.raw}`;

  quasis.forEach(({ value, loc }, idx) => {
    const prevLoc = idx === 0 ? firstQuasi.loc : quasis[idx - 1].loc;

    // Calculate the number of line breaks and spaces to add between
    // the previous and current template literal parts
    const lineBreaksCount = loc.start.line - prevLoc.end.line;
    const spacesCount =
      loc.start.line === prevLoc.end.line
        ? loc.start.column - prevLoc.end.column + 2
        : loc.start.column + 1;

    // Add the current template literal part to the style string
    styles = `${styles}${" "}${"\n".repeat(lineBreaksCount)}${" ".repeat(
      spacesCount
    )}${value.raw}`;
  });

  return styles;
}

// Get the range of text corresponding to a declaration
function getDeclarationRange(declaration, sourceCode) {
  const loc = {
    start: {
      line: declaration.source.start.line,
      column: declaration.source.start.column - 1,
    },
    end: {
      line: declaration.source.end.line,
      column: declaration.source.end.column - 1,
    },
  };

  const startIndex = sourceCode.getIndexFromLoc(loc.start);
  const endIndex = sourceCode.getIndexFromLoc(loc.end);

  return { startIndex, endIndex };
}

// Get the text of a declaration
function getDeclarationText(declaration, sourceCode) {
  const { startIndex, endIndex } = getDeclarationRange(declaration, sourceCode);
  const text = sourceCode.getText().substring(startIndex, endIndex + 1);

  return text;
}

// Sort declarations by property groups and alphabetically
function sortDeclarations(declarations) {
  return declarations.slice().sort((a, b) => {
    const priorityA = getPropertyGroupIndex(a);
    const priorityB = getPropertyGroupIndex(b);

    if (priorityA === priorityB) {
      const group = PROPERTY_GROUPS[priorityA];
      const indexA = group.indexOf(a.prop);
      const indexB = group.indexOf(b.prop);
      return indexA - indexB;
    }

    return priorityA - priorityB;
  });
}

// Fix a rule by sorting its declarations
function fixRule(rule, fixer, sourceCode, isRoot = false) {
  const declarations = rule.nodes.filter((node) => node.type === "decl");
  const nestedRules = rule.nodes.filter((node) => node.type === "rule");

  const fixings = [];

  if (!isRoot) {
    const sortedDeclarations = sortDeclarations(declarations);

    declarations.forEach((declaration, idx) => {
      if (!areDeclarationsEqual(declaration, sortedDeclarations[idx])) {
        const range = getDeclarationRange(declaration, sourceCode);
        const sortedDeclarationText = getDeclarationText(
          sortedDeclarations[idx],
          sourceCode
        );

        fixings.push(
          fixer.removeRange([range.startIndex, range.endIndex + 1]),
          fixer.insertTextAfterRange(
            [range.startIndex, range.startIndex],
            sortedDeclarationText
          )
        );
      }
    });
  }

  for (const nestedRule of nestedRules) {
    fixings.push(...fixRule(nestedRule, fixer, sourceCode));
  }

  return fixings;
}

// Linting rule
module.exports = {
  meta: {
    docs: {
      description: "Styles are sorted in groups",
      category: "Sorting",
      recommended: false,
    },
    messages: {
      "sort-declarations-in-groups": "Declarations should be sorted in groups",
    },
    fixable: "code",
    schema: [],
    type: "problem",
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isStyledComponent(node)) {
          try {
            const styles = getNodeStyles(node);
            const root = postcss.parse(styles);

            if (!isValidRule(root)) {
              const { loc } = node.quasi;
              const sourceCode = context.getSourceCode();

              context.report({
                node,
                messageId: "sort-declarations-in-groups",
                loc,
                fix: (fixer) => fixRule(root, fixer, sourceCode),
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
    };
  },
};
