/** A transport that logs messages to the browser console with a colored tag. */
const browserConsole = (
/** The color to use for messages from this transport */
color = 0x000000, 
/** A label to use in place of the level name in the console */
label = undefined) => {
    let backgroundColor = `#${('000000' + color.toString(16)).slice(-6)}7F`;
    let levelCss = `background-color: ${backgroundColor};`;
    return function browserConsoleTransport(message, level) {
        console.log(
        // Initial section with CSS styling for the level name. We want some
        // horizontal padding around the level name in its little "tag," but
        // we also want the tags to stand out if the log is copy-pasted or
        // saved to a file. We pad the sides of the level name with brackets
        // which we hide via CSS, leaving a visually clean interface in the
        // HTML console that magically turns into a bracketed level name
        // when saved/copied as plain text.
        `%c[%c${String(label ?? level)}%c]`, // String() to handle symbol level names
        // CSS style for the first hidden bracket
        `
				${levelCss}
				border-top-left-radius: 3px;
				border-bottom-left-radius: 3px;
				color: transparent;
			`, 
        // CSS style for the level name
        levelCss, 
        // CSS style for the second hidden bracket
        `
				${levelCss}
				border-top-right-radius: 3px;
				border-bottom-right-radius: 3px;
				color: transparent;
			`, 
        // The rest of the message will be unstyled
        // TODO: support parsing out `%c`s from the message and doing
        //       extra formatting to make the result equivalent to native
        ...message);
    };
};

export { browserConsole };
//# sourceMappingURL=browserConsole.mjs.map
