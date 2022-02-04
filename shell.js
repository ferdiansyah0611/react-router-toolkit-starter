const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });

class Shell{
	constructor(config = {}){
		this.config = Object.assign({
			rootShell: './_shell/',
			directory: {
				component: 'component',
				route: 'route',
				store: 'store',
				style: 'style',
				service: 'service',
			}
		}, config)
		this.input = {
			name: '',
			code: ''
		}
		this.createDir = this.createDir.bind(this)
		this.createCrud = this.createCrud.bind(this)
		this.run()
	}
	createDir(root, fixName){
		var dir = prompt(`Directory file (root folder: /src/${root}) *optional : `);
		if(dir){
			dir = `${root}/${dir}/`
			if (!fs.existsSync('./src/' + dir)){
			    fs.mkdirSync('./src/' + dir, { recursive: true });
			}
			this.input.name = dir + fixName
		}else{
			dir = root
			if (!fs.existsSync('./src/' + dir)){
			    fs.mkdirSync('./src/' + dir, { recursive: true });
			}
			this.input.name = `${root}/` + fixName
		}
	}
	createCrud(caseName){
		var crud = prompt(`Create CRUD using createAsyncThunk (y/n) : `);
		if(crud === 'y'){
			var url = prompt(`Base url (http://localhost:8000/api/user) : `);
			url = url || 'http://localhost:8000/api/user'
			this.input.code = ``
			var txt = this.read(this.config.rootShell + 'store-crud.js')
			var code = txt.toString().replaceAll('caseName', caseName).replaceAll('url', url)
			this.input.code = String(code)
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
			var name = type.toLowerCase();
			['css', 'sass', 'scss'].find((value) => {
				if(name === value){
					caseName += '.' + value
				}
			})
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
		[
			'create component',
			'create route pages',
			'create store',
			'setup for tailwindcss with sass',
			'generate firebase storage upload & remove (v8)'
		].map((data, key) => {
			console.log( `[${key}]` , data)
		})
		const choose = prompt("Choose one : ");
		var fixName, caseName
		if(!choose){
			return
		}
		if(Number(choose) !== 3 && !(Number(choose) > 3)){
			const name = prompt("Name file : ");
			input.name = name
			fixName = String(name)[0].toUpperCase() + name.slice(1)
			caseName = String(name)[0].toUpperCase() + name.slice(1, name.indexOf('.'))
		}

		var list = [
			{
				id: 0,
				action: async() => {
					createDir(this.config.directory.component, fixName)
					var txt = this.read(this.config.rootShell + 'component.jsx')
					var style = this.generateStyle(caseName, 'component')
					var code = txt.toString()
					if(style){
						code = `import '@style/component/${style}'\n` + code
					}
					code = code.replaceAll('caseName', caseName)
					input.code = String(code)
				}
			},
			{
				id: 1,
				action: async() => {
					createDir(this.config.directory.route, fixName)
					var txt = this.read(this.config.rootShell + 'route.jsx')
					var style = this.generateStyle(caseName, 'component')
					var code = txt.toString()
					if(style){
						code = `import '@style/component/${style}'\n` + code
					}
					code = code.replaceAll('caseName', caseName)
					input.code = String(code)
				}
			},
			{
				id: 2,
				action: async() => {
					fixName = fixName.toLowerCase()
					caseName = caseName.toLowerCase()
					createDir(this.config.directory.store, fixName)
					var isCrud = await createCrud(caseName)
					if(!isCrud){
						var isCrudReducer = prompt('Create CRUD reducer *optional : ')
						if(isCrudReducer){
							var txt = this.read(this.config.rootShell + 'store-crud-reducer.js')
							var firstCase = caseName[0].toUpperCase() + caseName.slice(1)
							var code = txt.toString().replaceAll('app', caseName)
							.replaceAll('namestore', input.name)
							.replaceAll('NameExport', firstCase)
							.replaceAll('// import', `// import {handle${firstCase}, reset${firstCase}, create${firstCase}, update${firstCase}, remove${firstCase}} from @s/${input.name}`)
							input.code = String(code)
						}else{
							var txt = this.read(this.config.rootShell + 'store.js')
							var code = txt.toString().replaceAll('appSlice', caseName + 'Slice').replaceAll('namestore', input.name)
							input.code = String(code)
						}
					}
				}
			},
			{
				id: 3,
				action: async() => {
					const { exec } = require('child_process');
					var install_tailwind = 'npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p'
					this.log(install_tailwind)
					exec(install_tailwind, (error, stdout, stderr) => {
						this.copy(this.config.rootShell + 'tailwind.sass', './src/tailwind.sass')
						this.copy(this.config.rootShell + 'tailwind.config.js', './tailwind.config.js')
						this.log('Successfuly setup')
						this.log(`Don't forget to import tailwind.sass in ./src`)
					})
				}
			},
			{
				id: 4,
				action: async() => {
					createDir(this.config.directory.service, fixName)
					var txt = this.read(this.config.rootShell + 'firebase/storage.js')
					var code = txt.toString()
					input.name = this.config.directory.service + '/firebase-storage.js'
					input.code = String(code)
					this.log(`import {storage, upload, remove} from '@service/firebase-storage.js'`)
				}
			},
		]
		var find = list.find((check) => {
			if(check.id === Number(choose)){
				check.action()
				return true
			}
		})
		if(!find){
			return
		}
		if(input.name){
			this.write('./src/' + input.name, input.code)
			this.log('create successfuly')
			const choose = prompt("Run again (y/n) : ");
			if(choose == 'y'){
				this.run = this.run.bind(this)
				this.run()
			}
		}
	}
}

new Shell()