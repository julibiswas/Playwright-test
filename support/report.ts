import reporter from "cucumber-html-reporter";
import fs from "fs";

export async function generateReport(): Promise<void> {
  const jsonFile = "cucumber-report.json";
  const timeoutMs = 10000;
  const intervalMs = 200;
  let elapsed = 0;

  // Wait for the JSON file to exist and be valid JSON (some runners write it asynchronously)
  while (elapsed < timeoutMs) {
    if (fs.existsSync(jsonFile)) {
      try {
        const content = fs.readFileSync(jsonFile, "utf8").trim();
        if (content.length === 0) throw new Error("empty");
        JSON.parse(content);
        break; // file exists and is valid JSON
      } catch (err) {
        // not ready yet
      }
    }
    await new Promise((res) => setTimeout(res, intervalMs));
    elapsed += intervalMs;
  }

  if (!fs.existsSync(jsonFile)) {
    console.log(`⚠️  ${jsonFile} not found after ${timeoutMs}ms — creating fallback JSON so HTML report can be generated.`);
    // Create a minimal fallback JSON so the reporter can still generate an HTML report.
    const fallback = [
      {
        uri: "fallback",
        id: "fallback",
        keyword: "Feature",
        name: "Fallback report - no Cucumber JSON found",
        description: `No cucumber JSON was found. This fallback report was generated at ${new Date().toISOString()}`,
        elements: [],
      },
    ];
    try {
      fs.writeFileSync(jsonFile, JSON.stringify(fallback, null, 2), "utf8");
      console.log(`ℹ️  Wrote fallback JSON to ${jsonFile}`);
    } catch (err) {
      console.log(`❌ Failed to write fallback JSON: ${(err as Error).message}`);
      return;
    }
  }

  // Final sanity-check parse
  try {
    const content = fs.readFileSync(jsonFile, "utf8");
    JSON.parse(content);
  } catch (err) {
    console.log(`⚠️  Skipping HTML report generation — ${jsonFile} is not valid JSON: ${(err as Error).message}`);
    return;
  }

  // Ensure output directory exists
  const outDir = "./html-report";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const options = {
    theme: "bootstrap",
    jsonFile,
    output: "./html-report/cucumber_report.html",
    reportSuiteAsScenarios: true,
    launchReport: false,
  } as const;

  try {
    reporter.generate(options as any);
    console.log("✅ HTML report generated: ./html-report/cucumber_report.html");
  } catch (err) {
    console.log("⚠️  HTML report generation failed:", (err as Error).message);
  }
}
