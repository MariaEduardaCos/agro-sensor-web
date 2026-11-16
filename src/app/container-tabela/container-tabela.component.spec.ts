import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerTabelaComponent } from './container-tabela.component';

describe('ContainerTabelaComponent', () => {
  let component: ContainerTabelaComponent;
  let fixture: ComponentFixture<ContainerTabelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerTabelaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerTabelaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders separate nutrient columns and the four sample readings', () => {
    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    const headers = Array.from(table.tHead!.rows[0].cells, cell => cell.textContent);

    expect(headers.slice(2, 5)).toEqual(['N (mg/kg)', 'P (mg/kg)', 'K (mg/kg)']);
    expect(table.tBodies[0].rows).toHaveLength(4);
  });

  it('keeps the status chosen when editing a sensor', () => {
    const sensor = component.leituras[0];
    component.abrirModalEdicao(sensor);
    component.sensorEmEdicao.status = 'Crítico';
    component.salvarEdicaoSensor();

    expect(component.leituras[0].status).toBe('Crítico');
  });

  it('shows today in the header and refreshes the sensor date after editing', () => {
    const sensor = component.leituras[0];
    component.abrirModalEdicao(sensor);
    component.salvarEdicaoSensor();

    expect(component.dataAtual).toBe(new Date().toLocaleDateString('pt-BR'));
    expect(component.leituras[0].data).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
    expect(component.leituras[0].data).toContain(component.dataAtual);
  });

  it('uses today for the sample sensor readings', () => {
    const dataHoje = component.dataAtual;

    expect(component.leituras.every(sensor => sensor.data.startsWith(dataHoje))).toBe(true);
  });

  it('saves a new sensor with the current date and time', () => {
    component.abrirModalNovo();
    component.novoSensor.talhao = 'Talhão novo';
    component.salvarNovoSensor();

    expect(component.leituras[0].data).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
    expect(component.leituras[0].data).toContain(component.dataAtual);
  });

  it('keeps sensor identifiers unique after deletion and registration', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    try {
      component.excluirSensor(component.leituras[0].id);
      component.abrirModalNovo();
      component.novoSensor.talhao = 'Talhão novo';
      component.salvarNovoSensor();

      const ids = component.leituras.map(sensor => sensor.id);
      expect(new Set(ids).size).toBe(ids.length);
    } finally {
      vi.restoreAllMocks();
    }
  });
});
