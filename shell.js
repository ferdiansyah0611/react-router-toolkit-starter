const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });

class Shell{
	constructor(){
		this.input = {
			name: '',
			code: ''
		}
	}
	createDir(root, input, fixName){
		var dir = prompt(`Directory file (root folder: /src/${root}) *optional : `);
		if(dir){
			dir = `${root}/${dir}/`
			if (!fs.existsSync('./src/' + dir)){
			    fs.mkdirSync('./src/' + dir, { recursive: true });
			}
			input.name = dir + fixName
		}else{
			input.name = `${root}/` + fixName
		}
	}
	createCrud(caseName, input){
		var crud = prompt(`Create CRUD using createAsyncThunk (y/n) : `);
		if(crud === 'y'){
			var url = prompt(`Base url (http://localhost:8000/api/user) : `);
			url = url || 'http://localhost:8000/api/user'
			input.code = ``
			var txt = this.read('./_shell/store-crud.js')
			var code = txt.toString().replaceAll('caseName', caseName).replaceAll('url', url)
			input.code = String(code)
			return new Promise((res) => res(true))
		}
	}
	generateStyle(caseName, typeSelect){
		var type = prompt(`Generate (css/scss/sass) *optional : `);
		var dir = 'style' + '/' + typeSelect
		if (!fs.existsSync('./src/' + dir)){
		    fs.mkdirSync('./src/' + dir, { recursive: true });
		}
		if(type){
			var name = type.toLowerCase()
			if(name === 'css'){
				caseName += '.css'
			}
			if(name === 'sass'){
				caseName += '.sass'
			}
			if(name === 'scss'){
				caseName += '.scss'
			}
			this.write(`./src/style/${typeSelect}/${caseName}`, `/*${caseName}*/`)
			return caseName
		}
	}
	log(...log){
		console.log('LOG :', ...log)
	}
	copy(old, newDir, callback = () => {}){
		return fs.copyFile(old, newDir, callback)
	}
	write(dir, value){
		return fs.writeFileSync(dir, value)
	}
	read(dir){
		return fs.readFileSync(dir, 'utf8')
	}
	async run(){
		const {input, createDir, createCrud} = this

		console.log('List :');
		['create component', 'create route pages', 'create store', 'setup for tailwindcss with sass'].map((data, key) => {
			console.log( `(${key})` , data)
		})
		const choose = prompt("Choose one : ");
		var fixName, caseName
		if(Number(choose) !== 3){
			const name = prompt("Name file : ");
			input.name = name
			fixName = String(name)[0].toUpperCase() + name.slice(1)
			caseName = String(name)[0].toUpperCase() + name.slice(1, name.indexOf('.'))
		}
		switch(Number(choose)){
			// component
			case 0:
				createDir('component', input, fixName)
				var txt = this.read('./_shell/component.jsx')
				var style = this.generateStyle(caseName, 'component')
				var code = txt.toString()
				if(style){
					code = `import '@style/component/${style}'\n` + code
				}
				code = code.replaceAll('caseName', caseName)
				input.code = String(code)
				break;
			// route
			case 1:
				createDir('route', input, fixName)
				var txt = this.read('./_shell/route.jsx')
				var style = this.generateStyle(caseName, 'component')
				var code = txt.toString()
				if(style){
					code = `import '@style/component/${style}'\n` + code
				}
				code = code.replaceAll('caseName', caseName)
				input.code = String(code)
				break;
			// store
			case 2:
				fixName = fixName.toLowerCase()
				caseName = caseName.toLowerCase()
				createDir('store', input, fixName)
				var isCrud = await createCrud(caseName, input)
				if(!isCrud){
					var txt = this.read('./_shell/store.js')
					var code = txt.toString().replaceAll('appSlice', caseName + 'Slice').replaceAll('namestore', input.name)
					input.code = String(code)
				}
				break;
			// tailwindcss
			case 3:
				const { exec } = require('child_process');
				var install_tailwind = 'npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p'
				this.log(install_tailwind)
				exec(install_tailwind, (error, stdout, stderr) => {
					this.copy('./_shell/tailwind.sass', './src/tailwind.sass')
					this.copy('./_shell/tailwind.config.js', './tailwind.config.js')
					this.log('Successfuly setup')
					this.log(`Don't forget to import tailwind.sass in ./src`)
				})
				break;
		}
		if(input.name){
			this.write('./src/' + input.name, input.code)
			this.log('create successfuly')
			const choose = prompt("Run again (y/n) : ");
			if(choose == 'y'){
				this.run()
			}
		}
	}
}

new Shell().run()