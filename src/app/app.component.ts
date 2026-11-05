import { Component } from '@angular/core';
import { ContainerTabelaComponent } from './container-tabela/container-tabela.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContainerTabelaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  title = 'agro-sensor-web';
}

export { App as AppComponent };
