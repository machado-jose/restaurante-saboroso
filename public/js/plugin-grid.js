class PluginGrid{

	constructor(configs){

		configs.listeners = Object.assign({

			afterUpdateClick: (e)=>{
	            $("#modal-update").modal('show');
	        },
	        afterDeleteClick: (e)=>{
	        	window.location.reload();
	        },
	        afterFormUpdate: ()=>{
	        	window.location.reload();
	        },
	        afterFormCreate: ()=>{
	        	window.location.reload();
	        },
	        afterFormCreateError: ()=>{
	        	alert("Não foi possível enviar o formulário.");
	        },
	        afterFormUpdateError: ()=>{
	        	alert("Não foi possível enviar o formulário.");
	        }

		}, configs.listeners);

		this.options = Object.assign({

			formCreate: "#modal-create form",
	        formUpdate: "#modal-update form",
	        btnDelete: ".btn-delete",
	        btnUpdate: ".btn-update",
	        onUpdateLoad: (form, name, data)=>{
	        	let input = form.querySelector(`[name=${name}]`);
	        	if(input) input.value = data[name];
	        }

		}, configs);

		this.initForms();
		this.initButtons();
	}

	initForms(){

		this.formCreate = document.querySelector(this.options.formCreate);

			this.formCreate.save().then(json=>{
				this.fireEvents('afterFormCreate');
			}).catch(err=>{
				this.fireEvents('afterFormCreateError');
		});

		this.formUpdate = document.querySelector(this.options.formUpdate);

			this.formUpdate.save().then(json=>{
				this.fireEvents('afterFormUpdate');
			}).catch(err=>{
				this.fireEvents('afterFormUpdateError');
		});
	}

	fireEvents(name, args){

		if(typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);
	}

	getTrData(e){

		let tr = e.path.find(el=>{

			return (el.tagName.toUpperCase() === 'TR');

		});

		return JSON.parse(tr.dataset.row);		
	}

	initButtons(){

		[...document.querySelectorAll(this.options.btnDelete)].forEach(btn=>{

			btn.addEventListener('click', e=>{

				let data = this.getTrData(e);

				if(confirm(eval('`' + this.options.msgDelete + '`'))){

					fetch(eval('`' + this.options.urlDelete + '`'), {
						method: 'DELETE'
					}).then(response => response.json()).then(json=>{
						this.fireEvents('afterDeleteClick', [e]);
					}).catch(err=>{
						console.log(err);
					});

				}

			});

		});

		[...document.querySelectorAll(this.options.btnUpdate)].forEach(btn=>{

			btn.addEventListener('click', e=>{

				this.fireEvents('beforeUpdateClick', [e]);

				let data = this.getTrData(e);

				for(let name in data){

					this.options.onUpdateLoad(this.formUpdate, name, data);
				}

				this.fireEvents('afterUpdateClick', [e]);

			});

		});

	}
}