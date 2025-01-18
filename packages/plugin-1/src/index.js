import { MyPlugin1 } from './Component';
import { MyPluginComponent } from 'plugin-component';

// load plugin component from monorepo
document.body.appendChild(MyPluginComponent());
console.log('any')
//
document.body.appendChild(MyPlugin1());

