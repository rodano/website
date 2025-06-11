const styles = /*css*/`
:host {
	--image-shadow-color: #22222222;
	--button-background-color: #eee;
	--button-color: black;
	--highlighted-button-background-color: #333;
	--highlighted-button-color: white;
}
img {
	width: 100%;
	box-shadow: var(--image-shadow-color) 0 5px 15px;
	cursor: pointer;
}
ol {
	margin: 1rem 0 0 0;
	padding: 0;
	list-style-type: none;
	display: flex;
	gap: 0.5rem;
	justify-content: center;

	& > li {
		width: 2em;
		text-align: center;
		border-radius: 6rem;
		background-color: var(--button-background-color);
		color: var(--button-color);
		cursor: pointer;
		user-select: none;

		&:hover {
			filter: brightness(0.9);
		}
		&.selected {
			background-color: var(--highlighted-button-background-color);
			color: var(--highlighted-button-color);
			pointer-events: none;
		}
	}
}
dialog {
	width: 90%;
	padding: 0;
	border: 0;
	border-radius: 5px;
	text-align: center;
	overscroll-behavior: contain;

	&::backdrop {
		background-color: #333;
		opacity: 0.9;
	}

	& > div {
		padding: 2rem;
	}

	& h2 {
		margin-top: 0;

		& button {
			float: right;
			cursor: pointer;
			font-size: 1.2rem;
			background-color: var(--highlighted-button-background-color);
			color: var(--highlighted-button-color);
			padding: 0.2rem 0.5rem;
			border: 0;
			border-radius: 5px;

			&:hover {
				filter: brightness(1.1);
			}
			&:focus, &:focus-visible {
				outline: none;
			}
		}
	}
	& img {
		margin-bottom: 1rem;
		cursor: default;
	}
}
`;

const template = /*html*/`
	<style>${styles}</style>
	<div></div>
	<ol></ol>
	<dialog>
		<div>
			<h2>
				<span></span>
				<button autofocus="autofocus">Close</button>
			</h2>
			<img />
		</div>
	</dialog>
`;

const SLIDE_FREQUENCY = 5000;

class AppCarousel extends HTMLElement {
	constructor() {
		super();

		this.animation = undefined;
		this.displayed = undefined;

		const instance = document.createElement('template');
		instance.innerHTML = template;

		this.root = this.attachShadow({mode: 'open'});
		this.root.appendChild(instance.content.cloneNode(true));
		this.container = this.root.querySelector('div');
		this.navigation = this.root.querySelector('ol');
		this.dialog = this.root.querySelector('dialog');
		//close dialog with a click on the close button
		this.dialog.querySelector('button').addEventListener('click', () => {
			this.dialog.close();
		});
		//close dialog with a click outside the dialog
		this.dialog.addEventListener('click', event => {
			if(!this.dialog.querySelector('div').contains(event.target)) {
				this.dialog.close();
			}
		});
	}

	#displayNext() {
		const next = this.displayed < this.children.length - 1 ? this.displayed + 1 : 0;
		this.#display(next);
	}

	#display(index) {
		if(this.displayed !== index) {
			this.displayed = index;
			//replace image
			if(this.container.firstChild) {
				this.container.removeChild(this.container.firstChild);
			}
			const image = this.children[index].cloneNode(true);
			this.container.appendChild(image);
			//update navigation buttons
			for(let i = 0; i < this.navigation.children.length; i++) {
				const item = this.navigation.children[i];
				if(i === index) {
					item.classList.add('selected');
				}
				else {
					item.classList.remove('selected');
				}
			}
		}
	}

	#refresh() {
		//clean
		while(this.navigation.firstChild) {
			this.navigation.removeChild(this.navigation.firstChild);
		}
		if(this.animation) {
			clearInterval(this.animation);
		}
		//calculate maximum height and navigation buttons
		let highest_image = undefined;
		for(let i = 0; i < this.children.length; i++) {
			const image = this.children[i];
			if(!highest_image || image.height > highest_image.height) {
				highest_image = image;
			}
			const item = document.createElement('li');
			item.textContent = (i + 1).toString();
			item.addEventListener('click', () => {
				clearInterval(this.animation);
				this.#display(i);
			});
			this.navigation.appendChild(item);
		}
		//display one image first to draw the container properly
		this.#display(0);
		//adjust container size
		const height = highest_image.height * this.container.offsetWidth / highest_image.width;
		this.container.style.height = `${height}px`;
		this.animation = setInterval(() => this.#displayNext(), SLIDE_FREQUENCY);
	}

	connectedCallback() {
		this.container.addEventListener('click', () => {
			const image = this.container.firstElementChild;
			this.dialog.querySelector('h2 > span').textContent = image.title ?? '';
			const dialog_image = this.dialog.querySelector('img');
			dialog_image.src = image.src;
			dialog_image.alt = image.alt;
			this.dialog.showModal();
		});
		const observer = new MutationObserver(list => {
			for(const mutation of list) {
				if(mutation.type === 'childList') {
					this.#refresh();
				}
			}
		});
		observer.observe(this, {childList: true});
		this.#refresh();
	}
}

window.customElements.define('app-carousel', AppCarousel);
