//NOTE - requires nodejs v15+

//(?:\d+)(?:[\.\-_]\d+)?(?:[\.\-_]\d+)+

inputString = String.raw``;
function reg (input) {

	/**
	* Returns a basic regular expression
	* @param 	{String} input 		Raw filepath or string to be manipulated
	* @return 	{String} URL		Regex101 URL containing input string and basic regex 
	*/

    const UID = String.raw`\{[\w\d]{8}-[\w\d]{4}-[\w\d]{4}-[\w\d]{4}-[\w\d]{12}\}`;
	const CHARSTOESC = ['^', '$', '(', ')', '{', '}', '.', '/', '?', '[', ']'];
    const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	let sin = input;
    let plus;


    function convDigits() {
    	if (isForURL) {
    		plus = '%2B';
    	} else {
    		plus = '+';
    	}

    	sin = sin.split('');

    	let digitCount = 0;
    	let digitRegex = String.raw`\d`;

	    for (let i = 0; i <= sin.length; i++) {
	    	
	    	if (sin[i] in DIGITS) {
	    		digitCount++;
	    	} else {	    		
	    		if (digitCount > 1) {
	    			sin.splice(i - digitCount, digitCount, digitRegex + plus);
	    			digitCount = 0;
	    		} else if (digitCount == 1) {
	    			sin.splice(i - 1, 1, digitRegex);
	    			digitCount = 0;
	    		}
	    	}
	    }
	    return sin.join('');
    }

	//will convert DIGITS to \d or \d+ repectively
    const convertDigits = false;

    //if true, output is a URL prepopulating regex101.com
    //if false, output is regex matching input
    const isForURL = true;


	//replace backslash
	sin = sin.replace(/\\/g, '\\\\');

	//relace with placeholder (to be swapped out after digit detection / conversion)
	sin = sin.replace(/{[\w\d]{8}-[\w\d]{4}-[\w\d]{4}-[\w\d]{4}-[\w\d]{12}}/g, 'PLACEHOLDER');

	//escape specials
    for (let i = 0; i < CHARSTOESC.length; i++) {
	
        if (sin.indexOf(CHARSTOESC[i]) != -1) {
        	sin = sin.replaceAll(CHARSTOESC[i], '\\' + CHARSTOESC[i]);
        }
    }

	//replace (x86) with (?:\(x86))?
	//must be after 'escape specials'
    sin = sin.replace(' \\(x86\\)', '(?: \\(x86\\))?');

	//replace " with (?:\")
	sin = sin.replace(/\"/g, '\(?:\\")?');

	//replace DIGITS with "\d+" or "\d" if "convertDigits" == true
    if (convertDigits == true) {
    	sin = convDigits(sin);    	
	}

	//replace with regex including DIGITS
	sin = sin.replace(/PLACEHOLDER/g, UID);

	let output = '^' + sin + '$';

	if (isForURL) {
	//replace #, &, craft URL
	    output = output.replace(/#/g, '%23');
	    output = output.replace(/&/g, '%26');
	    input = input.replace(/#/g, '%23');
	    input = input.replace(/&/g, '%26');
	    output = 'https://regex101.com/?regex=' + output + '&testString=' + input;
	}

	return output; 
}

console.log(reg(inputString));
