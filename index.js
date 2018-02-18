const path = require('path');
var concentrado = require ('./input/concentrado');

var jsonfile = require('jsonfile');
const uuidv1 = require('uuid/v1');


for (let c of concentrado){

	let ocds11 = c; 

	ocds11.version = "1.1";


	for (trans of c.releases[0].contracts[0].implementation.transactions){
		if (typeof trans.id === 'undefined'){
			trans.id = uuidv1();
		}
	}

	ocds11.releases[0].parties = [];

	if (typeof c.releases[0].buyer !== 'undefined'){
		c.releases[0].buyer.roles = ['buyer'];
		ocds11.releases[0].parties.push(c.releases[0].buyer);

		ocds11.releases[0].buyer = { 
			id: c.releases[0].buyer.identifier.id,
		 	name: c.releases[0].buyer.name 
		 };

	}

	if (typeof c.releases[0].procuringEntity !== 'undefined'){
		c.releases[0].procuringEntity.roles = ['procuringEntity'];
		ocds11.releases[0].procuringEntity.push(c.releases[0].procuringEntity);

		ocds11.releases[0].procuringEntity = { 
			id: c.releases[0].procuringEntity.identifier.id,
		 	name: c.releases[0].procuringEntity.name 
		 };
	}


	if (typeof c.releases[0].tender.tenderers !== 'undefined'){
		for (t of c.releases[0].tender.tenders){
			t.roles = ['tenderer'];
			ocds11.releases[0].parties.push(t);
		} 
	}


	if (typeof c.releases[0].awards === 'undefined'){ c.releases[0].awards = [{}]};

	if (typeof c.releases[0].awards[0].suppliers !== 'undefined'){
		for (s of c.releases[0].awards[0].suppliers){
			s.roles = ['supplier'];
			//falta buscar si ya está como tenderer y añadir rol 
			ocds11.releases[0].parties.push(s);
		} 
	}

	//añadir tenderers
	ocds11.releases[0].tender.tenderers = [];
	for (p of c.releases[0].parties){
		if (p.roles.includes('tenderer')){
			ocds11.releases[0].tender.tenderers.push ({
				id: p.identifier.id,
				name: p.name
			});
		}

	}

	if (ocds11.releases[0].tender.tenderers.length === 0){
		delete ocds11.releases[0].tender.tenderers;
	}


	//añadir tenderers 
	ocds11.releases[0].awards[0].suppliers = [];
	for (p of c.releases[0].parties){
		if (p.roles.includes('supplier')){
			ocds11.releases[0].awards[0].suppliers.push ({
				id: p.identifier.id,
				name: p.name
			});
		}

	}

	if (ocds11.releases[0].awards[0].suppliers.length === 0){
		delete ocds11.releases[0].awards[0].suppliers;
	}

	const file = `output/${c.releases[0].ocid}.json`
	jsonfile.writeFileSync(file, ocds11, {spaces: 4});

}


console.log(concentrado.length);