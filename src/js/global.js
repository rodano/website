window.addEventListener('load', () => {
	const media_query = window.matchMedia('(max-width: 900px)');
	//manage menu
	const header = document.querySelector('header');
	const nav = document.querySelector('nav');
	function open_menu(event) {
		if(!nav.classList.contains('open')) {
			nav.classList.add('open');
			event.stopPropagation();
		}
	}
	function close_menu() {
		nav.classList.remove('open');
	}
	function manage_menu() {
		close_menu();
		if(media_query.matches) {
			header.addEventListener('click', open_menu);
			window.addEventListener('click', close_menu);
		}
		else {
			header.removeEventListener('click', open_menu);
			window.removeEventListener('click', close_menu);
		}
	}
	media_query.addEventListener('change', manage_menu);
	manage_menu();
});
