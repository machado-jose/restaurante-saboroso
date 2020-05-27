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
	        btnDelete: "btn-delete",
	        btnUpdate: "btn-update",
	        onUpdateLoad: (form, name, data)=>{
	        	let input = form.querySelector(`[name=${name}]`);
	        	if(input) input.value = data[name];
	        }

		}, configs);

		this.rows = [...document.querySelectorAll('table tbody tr')];

		this.initForms();
		this.initButtons();
	}

	initForms(){

		this.formCreate = document.querySelector(this.options.formCreate);

		this.formCreate.save({
			success: ()=>{
				this.fireEvents('afterFormCreate');
			},

			failure: (err)=>{
				this.fireEvents('afterFormCreateError');
			}
		});
			

		this.formUpdate = document.querySelector(this.options.formUpdate);

		this.formUpdate.save({
			success: ()=>{
				this.fireEvents('afterFormUpdate');
			},

			failure: (err)=>{
				this.fireEvents('afterFormUpdateError');
			}
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

	btnUpdateClick(e){

		this.fireEvents('beforeUpdateClick', [e]);

		let data = this.getTrData(e);

		for(let name in data){

			this.options.onUpdateLoad(this.formUpdate, name, data);
		}

		this.fireEvents('afterUpdateClick', [e]);
	}

	btnDeleteClick(e){

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
	}

	initButtons(){

		this.rows.forEach(row=>{
			[...row.querySelectorAll('.btn')].forEach(btn=>{
				btn.addEventListener('click', e=>{

					if(e.target.classList.contains(this.options.btnUpdate)){

						this.btnUpdateClick(e);
					}else if(e.target.classList.contains(this.options.btnDelete)){
						this.btnDeleteClick(e);
					}else{

						this.fireEvents('buttonClick', [e.target, this.getTrData(e), e]);
					}
				});
			})
		});
	}
}