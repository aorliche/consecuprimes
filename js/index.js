const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

const N_TO = 100000000;
const N_TO_SQRT = Math.ceil(Math.pow(N_TO, 0.5));

function sieve(n) {
	const nsqrt = Math.ceil(Math.pow(n, 0.5));
	const arr = [false, false];
	for (let i=2; i<=n; i++) {
		arr[i] = true;
	}
	for (let i=2; i<=nsqrt; i++) {
		if (arr[i]) {
			for (let j=2*i; j<=n; j+=i) {
				arr[j] = false;
			}
		}
	}
	return arr;
}

function addInpEventListeners(range, text, changeCb) {
	range.addEventListener('input', e => {
		text.value = range.value;
		changeCb(range.value);
	});
	text.addEventListener('change', e => {
		const val = Number(text.value);
		if (Number.isInteger(val) && val >= range.min && val <= range.max) {
			range.value = val;
			changeCb(range.value);
		} else {
			// Remember old value
			text.value = range.value;
		}
	});
}

function hunimalDigitStr(n) {
	if (n >= 100) {
		return hunimalDigitStr(Math.floor(n/100)) + hunimalDigitStr(n%100);
	}
	const tens = Math.floor(n/10);
	const ones = n%10;
	return String.fromCharCode(0x5500 + 0x10*tens + ones);
}

window.addEventListener('load', () => {
	let primes;

	const baseR = $('#base-range');
	const baseT = $('#base-text');
	const incR = $('#inc-range');
	const incT = $('#inc-text');
	const numR = $('#num-range');
	const numT = $('#num-text');

	function populateGrimesSlimes(base, inc, num, gsDiv, isGrimes) {
		gsDiv.innerText = '';
		for (let i=1; i+(num-1)*inc<base; i++) {
			const vals = [];
			if (isGrimes) {
				for (let j=num-1; j>=0; j--) {
					vals.push(i+j*inc);
				}
			} else {
				for (let j=0; j<num; j++) {
					vals.push(i+j*inc);
				}
			}
			let val = 0;
			let pow = 1;
			for (let j=0; j<num; j++) {
				val += vals[j]*pow;
				pow *= base;
			}
			if (val >= primes.length || !primes[val]) {
				continue;
			}
			vals.reverse();
			let valStr = '';
			for (let j=0; j<num; j++) {
				if (base > 10) {
					valStr += ' ' + hunimalDigitStr(vals[j]);
				} else {
					valStr += ' ' + vals[j].toString();
				}
			}
			valStr += ` (${val})`;
			const div = document.createElement('div');
			div.innerText = valStr;
			gsDiv.appendChild(div);
		}
		if (gsDiv.innerText == '') {
			gsDiv.innerText = 'No matching primes!';
		}
	}

	function populate(base, inc, num) {
		const grimes = $('#grimes .primes-cont');
		const slimes = $('#slimes .primes-cont');
		populateGrimesSlimes(base, inc, num, grimes, true);
		populateGrimesSlimes(base, inc, num, slimes, false);
	}

	addInpEventListeners(baseR, baseT, (base) => {
		populate(base, incR.value, numR.value);
	});
	addInpEventListeners(incR, incT, (inc) => {
		populate(baseR.value, inc, numR.value);
	});
	addInpEventListeners(numR, numT, (num) => {
		populate(baseR.value, incR.value, num);
	});

	$('#primes-limit-span').innerText = N_TO.toLocaleString('en-US');
	setTimeout(() => {
		primes = sieve(N_TO);
		$('#primes-status-span').innerText = 'Done!';
		populate(baseR.value, incR.value, numR.value);
	}, 100);
});
