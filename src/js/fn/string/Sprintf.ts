import toSafeInteger from 'lodash/toSafeInteger';
import padStart  from  'lodash/padStart';
import padEnd from 'lodash/padEnd';
import { justify } from './Justify';

export type RadixType = 2 | 8 | 10 | 16;

// formatBaseX()
const formatBaseX = (value: number, base: RadixType, prefixBaseX: boolean, leftJustify: boolean, minWidth: number, precision?: number, zeroPad?: boolean) => {
    // Note: casts negative numbers to positive ones
    const number = value >>> 0;
    const prefix = prefixBaseX && number && {'2': '0b', '8': '0', '10': '', '16': '0x'}[base] || '';
    const result = prefix + padStart(number.toString(base), precision || 0, '0');
    return justify(result, prefix, leftJustify, minWidth, !!zeroPad);
}

// formatString()
const formatString = (value: string, leftJustify: boolean, minWidth: number, precision?: number, zeroPad?: boolean) => {
    if (precision) {
        value = value.slice(0, precision);
    }

    return justify(value, '', leftJustify, minWidth, !!zeroPad);
}

export const sprintf = (format: string, ...a: any[]) => {	// Return a formatted string
	const regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
	let i = 0;

	// finalFormat()
	var doFormat = function(substring: string, valueIndex: number, flags: string, minWidth: number | string, _: any, precision?: number | string, type?: string) {
		if (substring == '%%') return '%';

		// parse flags
		var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false;
		for (var j = 0; flags && j < flags.length; j++) switch (flags.charAt(j)) {
			case ' ': positivePrefix = ' '; break;
			case '+': positivePrefix = '+'; break;
			case '-': leftJustify = true; break;
			case '0': zeroPad = true; break;
			case '#': prefixBaseX = true; break;
		}

		// parameters may be null, undefined, empty-string or real valued
		// we want to ignore null, undefined and empty-string values
		if (!minWidth) {
			minWidth = 0;
		} else if (typeof minWidth === "string") {
			if (minWidth === '*') {
				minWidth = +a[i++];
			} else if (minWidth.charAt(0) == '*') {
				minWidth = +a[toSafeInteger(minWidth.slice(1, -1))];
			}
		} else {
			minWidth = +minWidth;
		}

		// Note: undocumented perl feature:
		if (minWidth < 0) {
			minWidth = -minWidth;
			leftJustify = true;
		}

		minWidth = toSafeInteger(minWidth);

		if (!isFinite(minWidth)) {
			throw new Error('sprintf: (minimum-)width must be finite');
		}



		if (!precision) {
			precision = 'fFeE'.indexOf(<string>type) > -1 ? 6 : ((type == 'd') ? 0 : undefined);
		} else if (typeof precision === "string") {
			if (precision == '*') {
				precision = +a[i++];
			} else if (precision.charAt(0) == '*') {
				precision = +a[toSafeInteger(precision.slice(1, -1))];
			}

			precision = toSafeInteger(precision);
		} else {
			precision = toSafeInteger(+precision);
		}

		// grab value using valueIndex if required?
		var value = valueIndex ? a[toSafeInteger(valueIndex.toString().slice(0, -1)) - 1] : a[i++];

		switch (type) {
			case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad);
			case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
			case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
			case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'i':
			case 'd': {
						var number = toSafeInteger(+value);
						var prefix = number < 0 ? '-' : positivePrefix;
						value = prefix + padEnd(String(Math.abs(number)), precision, '0');
						return justify(value, prefix, leftJustify, minWidth, zeroPad);
					}
			case 'e':
			case 'E':
			case 'f':
			case 'F':
			case 'g':
			case 'G':
						{
						const number = +value;
						const prefix = number < 0 ? '-' : positivePrefix;
						const method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
						const textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
						const abs: any = Math.abs(number);
						value = prefix + abs[method](precision);
						const just: any = justify(value, prefix, leftJustify, minWidth, zeroPad);
						return just[textTransform]();
					}
			default: return substring;
		}
	};

	return format.replace(regex, doFormat);
}