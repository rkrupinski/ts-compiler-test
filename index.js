const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const programStr = `
    type ProgramOptions = {
        foo: string
    }

    const fn = (options: ProgramOptions) => {
        return options.foo
    };

    console.log(fn({ foo: "bar" }));
`;

const result = [];

const host = {
  getSourceFile: function (filename) {
    if (filename === "program.ts")
      return ts.createSourceFile(filename, programStr, ts.ScriptTarget.ES2015);

    if (
      filename === "lib.d.ts" ||
      filename === "lib.es5.d.ts" ||
      filename === "lib.dom.d.ts" ||
      filename === "lib.webworker.importscripts.d.ts" ||
      filename === "lib.scripthost.d.ts"
    )
      return ts.createSourceFile(
        filename,
        fs
          .readFileSync(
            path.join(path.dirname(require.resolve("typescript")), filename)
          )
          .toString(),
        ts.ScriptTarget.ES2015
      );
  },
  writeFile: function (name, text) {
    result.push({ name: name, text: text });
  },
  useCaseSensitiveFileNames() {
    return false;
  },
  getDefaultLibFileName() {
    return "lib.d.ts";
  },
  getCurrentDirectory() {
    return "";
  },
  getCanonicalFileName(filename) {
    return filename;
  },
  getNewLine: function () {
    return "\n";
  },
};

const program = ts.createProgram(["program.ts"], { strict: true }, host);
let errors = program.getGlobalDiagnostics();
if (!errors.length) program.emit();
result.forEach((r) => (1, eval)(r.text));

setTimeout(() => {}, 100000000);
