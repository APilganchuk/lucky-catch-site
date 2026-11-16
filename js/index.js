//  5281

window.addEventListener('load', () => {
	const tg = window.Telegram.WebApp
	tg.ready()
	tg.expand()
	tg.setHeaderColor('#10102c')
	tg.setBackgroundColor('#10102c')

	const html = document.querySelector('html'),
		currLangDom = document.querySelector('.curr_lang'),
		langSwitcher = document.querySelector('.lang_switcher_outer'),
		langListItem = [...document.querySelectorAll('.lang_list_item')],
		[userLang] = (tg.initDataUnsafe.user?.language_code || navigator.language || navigator.userLanguage).split('-')

	const hidePreloader = () => {
		html.classList.remove('hide')
		setTimeout(function () {
			html.classList.add('hide')
		}, 1000)
	}

	hidePreloader()

	const listOfLang = ['en', 'de', 'pl', 'ro', 'hu', 'gr', 'bg']

	const countryToLang = {
		en: 'en',
		de: 'de',
		pl: 'pl',
		ro: 'ro',
		hu: 'hu',
		el: 'gr',
		bg: 'bg',
		default: 'en',
	}

	let lang = countryToLang[userLang] || countryToLang.default

	listOfLang.forEach((item) => {
		html.classList.remove(item)
	})
	html.classList.add(lang)
	html.setAttribute('data-lang', lang)

	function changeLanguage(item) {
		hidePreloader()
		const selectedLang = item.getAttribute('data-lang')
		listOfLang.forEach((langItem) => html.classList.remove(langItem))
		html.classList.add(selectedLang)
		html.setAttribute('data-lang', selectedLang)

		langListItem.forEach((i) => i.classList.remove('curr'))
		item.classList.add('curr')

		currLangDom.innerHTML = item.innerHTML
	}

	langListItem.forEach((item) => {
		item.classList.remove('curr')
		item.addEventListener('click', () => changeLanguage(item))
	})

	const currLangItem = langListItem.find((item) => item.getAttribute('data-lang') === lang)
	if (currLangItem) {
		currLangItem.classList.add('curr')
		currLangDom.innerHTML = currLangItem.innerHTML
	} else {
		currLangDom.innerHTML = `<span>${countryToLang.default}</span>`
	}

	langSwitcher.addEventListener('click', () => {
		langSwitcher.classList.toggle('act')
	})

	document.addEventListener('click', (e) => {
		if (!e.target.closest('.lang_switcher_outer')) {
			langSwitcher.classList.remove('act')
		}
	})

	document.querySelector('#year').innerText = new Date().getFullYear()

	let counter = 0

	const wheel = document.getElementById('wheel')
	const wheelBtn = document.getElementById('wheel__btn')
	const wheelSpinner = document.getElementById('wheel__spinner')
	const overlay = document.getElementById('overlay')
	const popupTryAgain = document.getElementById('popup-first')
	const logo = document.querySelector('.logo')

	function fadeIn(el) {
		el.style.display = 'block'
		el.style.opacity = 0
		let op = 0
		const timer = setInterval(() => {
			if (op >= 1) clearInterval(timer)
			el.style.opacity = op
			op += 0.1
		}, 30)
	}

	const storage = tg.isVersionAtLeast('6.9')
		? tg.CloudStorage
		: {
				getItem: (key, cb) => cb(null, localStorage[key]),
				setItem: (key, value) => (localStorage[key] = value),
				removeItem: (key) => localStorage.removeItem(key),
		  }

	document.querySelectorAll('a.logo, #popup-btn').forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault()
			tg.openLink(link.href)
		})
	})

	wheelBtn.addEventListener('click', () => {
		if (counter === 0) {
			wheelBtn.disabled = true
			wheelSpinner.classList.remove('wheel__spinner_moving')
			wheel.classList.add('active')
			wheelSpinner.classList.add('wheel__spinner_win_1')
			tg.HapticFeedback.impactOccurred('medium')
			counter++
			setTimeout(() => {
				fadeIn(overlay)
				fadeIn(logo)
				popupTryAgain.classList.add('active')
				logo.classList.add('center')
				tg.HapticFeedback.notificationOccurred('success')
				storage.setItem('spin_5408_1', 'spin_1')
			}, 3500)
		}
	})

	if (tg.initDataUnsafe.start_param === 'reset') {
		storage.removeItem('spin_5408_1')
	} else {
		storage.getItem('spin_5408_1', (err, value) => {
			switch (value) {
				case 'spin_1':
					wheelBtn.disabled = true
					wheelSpinner.classList.remove('wheel__spinner_moving')
					wheelSpinner.style.transform = 'rotate(1926deg)'
					fadeIn(overlay)
					fadeIn(logo)
					popupTryAgain.classList.add('active')
					logo.classList.add('center')
					counter = 1
					break
			}
		})
	}

	document.querySelectorAll('.stroke span').forEach((el) => {
		el.setAttribute('data-text', el.textContent.trim())
	})

	const promoBtn = document.getElementById('promo-code')
	if (promoBtn) {
		const showCopied = () => {
			promoBtn.classList.add('copied-active')
			setTimeout(() => promoBtn.classList.remove('copied-active'), 1500)
		}
		promoBtn.addEventListener('click', () => {
			const codeEl = promoBtn.querySelector('.popup__promo-code')
			const code = promoBtn.dataset.code || (codeEl ? codeEl.textContent.trim() : '')
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(code).then(showCopied).catch(showCopied)
			} else {
				const input = document.createElement('textarea')
				input.value = code
				document.body.appendChild(input)
				input.select()
				try {
					document.execCommand('copy')
				} catch (e) {}
				document.body.removeChild(input)
				showCopied()
			}
		})
	}
})
