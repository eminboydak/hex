---
name: add-dependency
description: Add a package dependency (pnpm add) for this project. Automatically updates package.json and runs pnpm install. Example: "Add jose for Cloudflare Access JWT verification." If you need specific package version, mention it (e.g. "Add jose ^6.0"). Do not use other package managers.
onInstall: prompt(packageName, versionHint) = {
  // Parse version hint if provided
  let installCmd = `pnpm add ${packageName}`;
  if (versionHint && versionHint.trim()) {
    installCmd += ` ${versionHint}`;
  }

  console.log(`Adding ${packageName}...`);
  const { stdout, stderr } = await run(installCmd);

  if (stdout) console.log(stdout.trim());
  if (stderr) console.error(stderr.trim());

  if (stdout?.includes('deprecated')) {
    console.warn(`⚠️  ${stdout.includes('deprecated') ? 'Package deprecated warning detected' : 'Install completed with warnings'}`);
  }

  if (stdout?.includes('ERR_PNPM_ADD') || stderr?.includes('ERR_PNPM_ADD')) {
    console.error('❌ Installation failed. Check the package name and version.');
    return;
  }
}

// Example call:
// /add-dependency jose ^6.0.2