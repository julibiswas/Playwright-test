module.exports = {
  default: {
    require: [
      "./steps/*.ts",
      "./support/*.ts"
    ],
    format: [
      "progress",
      "json:cucumber-report.json"
    ],
    publishQuiet: true,
    requireModule: ["ts-node/register"],
    paths: ["./features/*.feature"]
  },
};
