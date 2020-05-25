class PluginFileReader{

	constructor(inputEl, imgEl){
		this.inputEl = inputEl;
		this.imgEl = imgEl;
		this.initInputEvent();
	}

	initInputEvent(){

		document.querySelector(this.inputEl).addEventListener('change', e=>{

			this.reader(e.target.files[0]).then(result=>{
				document.querySelector(this.imgEl).src = result;
			});

		});
	}

	reader(file){

		return new Promise((s, f)=>{

			let reader = new FileReader();

			reader.onload = ()=>{
				s(reader.result);
			};

			reader.onerror = ()=>{
				f("Não foi possivel ler a imagem");
			};

			reader.readAsDataURL(file);

		});

	}

}