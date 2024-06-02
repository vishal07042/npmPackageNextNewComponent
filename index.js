#!/usr/bin/env node
// const fs = require("fs");
// const path = require("path");

// const { program } = require("commander");

// const {
// 	getConfig,

// 	createParentDirectoryIfNecessary,
// } = require("./helpers");
// const {
// 	requireOptional,
// 	mkDirPromise,
// 	readFilePromiseRelative,
// 	writeFilePromise,
// } = require("./utils");

// // Load our package.json, so that we can pass the version onto `commander`.
// const { version } = require("../package.json");

// // Get the default config for this component (looks for local/global overrides,
// // falls back to sensible defaults).
// const config = getConfig();

// // Convenience wrapper around Prettier, so that config doesn't have to be
// // passed every time.

// program
// 	.version(version)
// 	.arguments("<folderName>")

// 	.parse(process.argv);

// const [folderName] = program.args;

// if (!folderName) {
// 	console.error(
// 		"You need to specify a folder name like this: next-new-component <folderName>"
// 	);
// 	process.exit(1);
// }

// const options = program.opts();

// const fileExtension = options.lang === "js" ? "js" : "tsx";
// const indexExtension = options.lang === "js" ? "js" : "ts";

// // Find the path to the selected template file.
// const srcDir = "src";
// const targetDir = path.join(srcDir, folderName);
// const templatePath = `./templates/page.js`;
// const targetFilePath = path.join(targetDir, "page.js");

// // Get all of our file paths worked out, for the user's project.
// const componentDir = `${options.dir}/${componentName}`;
// const filePath = `${componentDir}/${componentName}.page.js`;
// const indexPath = `${componentDir}/page.js`;

// // Our index template is super straightforward, so we'll just inline it for now.

// // Check if componentName is provided
// if (!componentName) {
// 	console.log(
// 		`Sorry, you need to specify a name for your component like this: new-component <name>`
// 	);
// 	process.exit(0);
// }

// // Check to see if the parent directory exists.
// // Create it if not
// createParentDirectoryIfNecessary(options.dir);

// // Check to see if this component has already been created
// const fullPathToComponentDir = path.resolve(componentDir);
// if (fs.existsSync(fullPathToComponentDir)) {
// 	logError(
// 		`Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
// 	);
// 	process.exit(0);
// }

// // Start by creating the directory that our component lives in.
// mkDirPromise(componentDir)
// 	.then(() => readFilePromiseRelative(templatePath))
// 	.then((template) => {
// 		logItemCompletion("Directory created.");
// 		return template;
// 	})
// 	.then((template) =>
// 		// Replace our placeholders with real data (so far, just the component name)
// 		template.replace(/COMPONENT_NAME/g, componentName)
// 	)
// 	.then((template) =>
// 		// Format it using prettier, to ensure style consistency, and write to file.
// 		writeFilePromise(filePath, prettify(template))
// 	)
// 	.then((template) => {
// 		logItemCompletion("Component built and saved to disk.");
// 		return template;
// 	})
// 	.then((template) =>
// 		// We also need the `index.js` file, which allows easy importing.
// 		writeFilePromise(indexPath, prettify(indexTemplate))
// 	)
// 	.then((template) => {
// 		logItemCompletion("Index file built and saved to disk.");
// 		return template;
// 	})
// 	.then((template) => {
// 		logConclusion();
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 	});

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const { mkDirPromise, readFilePromise, writeFilePromise } = require("./utils");

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require("../package.json");

program.version(version).arguments("<folderName>").parse(process.argv);

const [folderName] = program.args;

if (!folderName) {
	console.error(
		"You need to specify a folder name like this: next-new-component <folderName>"
	);
	process.exit(1);
}

const srcDir = "src";
const templateFilePath = path.join(__dirname, "templates/page.js");
const targetDir = path.join(srcDir, folderName);
const targetFilePath = path.join(targetDir, "page.js");

(async () => {
	try {
		if (!fs.existsSync(srcDir)) {
			await mkDirPromise(srcDir);
		}

		if (fs.existsSync(targetDir)) {
			console.error(
				`The directory ${targetDir} already exists. Please choose a different name or delete the existing directory.`
			);
			process.exit(1);
		}

		await mkDirPromise(targetDir);

		const templateContent = await readFilePromise(templateFilePath);
    const componentContent = templateContent.replace(
		/COMPONENT_NAME/g,
		folderName
	);
		await writeFilePromise(targetFilePath, componentContent);

		console.log(`Component created successfully at ${targetFilePath}`);
	} catch (err) {
		console.error(`Error: ${err.message}`);
	}
})();
