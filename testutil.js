// Redirects process.stdout.write to an internal buffer, runs the given
// function, and returns the output written during that process
function captureStdout (func) {
	// Save original write function for later
	const originalWrite = process.stdout.write;
	// Replace write function
	let output = '';
	process.stdout.write = chunk => {
		output += chunk;
		return true;
	}
	// Run the process
	func();
	// Restore write function
	process.stdout.write = originalWrite;
	return output;
}

module.exports = {
	captureStdout,
};
