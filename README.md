## react-router-toolkit-starter
Starter for react, react-router-dom, and @reduxjs/toolkit. With shell to generate create component, route, and store with CRUD createAsyncThunk.
### Installation
```bash
git clone https://github.com/ferdiansyah/0611/react-router-toolkit-starter
```
```bash
cd react-router-toolkit-starter && npm i
```
### Shell
Start shell
```bash
node shell.js
# output
# (0) create component
# (1) create route pages
# (2) create store
# (3) setup for tailwindcss with sass
# Choose one : 
```
### Path resolve
```javascript
// ./src directory
import '@/index.css'
// component
import YourComponent from '@c/YourComponent'
// route
import YourRoute from '@r/YourRoute'
// store
import YourStore from '@s/YourStore'

```
### Start server in all ip
```bash
npm run dev:all
```
### Build and deploy to firebase
```bash
npm run build:firebase
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)