import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeituraSolo } from '../interfaces/sensores.interface';

@Component({
  selector: 'app-container-tabela',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './container-tabela.component.html',
  styleUrl: './container-tabela.component.css'
})
export class ContainerTabelaComponent implements OnInit {
  titulo: string = 'Painel de Monitoramento IoT - Sensores de Solo';
  fazenda: string = 'Fazenda Modelo UniRV - Setor de Irrigação 04';

  get dataAtual(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  Math = Math;

  // Filtros de busca
  termoBusca: string = '';
  filtroStatus: string = 'todos';

  // Leituras de teste da etapa 4, com identificação, talhão e cultura.
  leituras: LeituraSolo[] = [
    {
      id: 'SNS-001',
      talhao: 'Talhão 12 - Norte',
      cultura: 'Soja',
      data: this.formatarDataHoraEmHorario(8, 0),
      n: 150,
      p: 110,
      k: 125,
      umidade: 0.55,
      status: 'Ideal'
    },
    {
      id: 'SNS-002',
      talhao: 'Talhão 04 - Sul',
      cultura: 'Milho',
      data: this.formatarDataHoraEmHorario(9, 30),
      n: 142,
      p: 105,
      k: 118,
      umidade: 0.48,
      status: 'Alerta'
    },
    {
      id: 'SNS-003',
      talhao: 'Talhão 08 - Leste',
      cultura: 'Algodão',
      data: this.formatarDataHoraEmHorario(11, 0),
      n: 130,
      p: 98,
      k: 110,
      umidade: 0.38,
      status: 'Crítico'
    },
    {
      id: 'SNS-004',
      talhao: 'Talhão 15 - Oeste',
      cultura: 'Soja',
      data: this.formatarDataHoraEmHorario(12, 30),
      n: 155,
      p: 112,
      k: 130,
      umidade: 0.60,
      status: 'Ideal'
    }
  ];

  private proximoNumeroSensor = this.leituras.length + 1;

  // Controle de Modais
  modalNovoAberto: boolean = false;
  modalEdicaoAberto: boolean = false;

  novoSensor: LeituraSolo = this.criarSensorVazio();
  sensorEmEdicao: LeituraSolo = this.criarSensorVazio();

  constructor() { }

  ngOnInit(): void { }

  // Indicadores Rápidos (KPIs) com contadores automáticos
  get totalSensores(): number {
    return this.leituras.length;
  }

  get totalIdeal(): number {
    return this.leituras.filter(s => s.status?.toLowerCase() === 'ideal').length;
  }

  get totalAlerta(): number {
    return this.leituras.filter(s => s.status?.toLowerCase() === 'alerta').length;
  }

  get totalCritico(): number {
    return this.leituras.filter(s => {
      const st = s.status?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return st === 'critico';
    }).length;
  }

  // Filtragem dinâmica por termo e status
  get leiturasFiltradas(): LeituraSolo[] {
    return this.leituras.filter(sensor => {
      const matchStatus =
        this.filtroStatus === 'todos' ||
        sensor.status?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
        this.filtroStatus.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const busca = this.termoBusca.trim().toLowerCase();
      const matchBusca =
        !busca ||
        sensor.id?.toLowerCase().includes(busca) ||
        sensor.talhao?.toLowerCase().includes(busca) ||
        sensor.cultura?.toLowerCase().includes(busca) ||
        sensor.data.toLowerCase().includes(busca);

      return matchStatus && matchBusca;
    });
  }

  // Ações de Modal: Novo Sensor
  abrirModalNovo(): void {
    const proximoNumero = String(this.proximoNumeroSensor).padStart(3, '0');
    this.novoSensor = {
      id: `SNS-${proximoNumero}`,
      talhao: '',
      cultura: 'Soja',
      n: 140,
      p: 100,
      k: 120,
      umidade: 0.50,
      status: 'Ideal',
      data: this.formatarDataHoraAtual()
    };
    this.modalNovoAberto = true;
  }

  fecharModalNovo(): void {
    this.modalNovoAberto = false;
  }

  salvarNovoSensor(): void {
    if (!this.novoSensor.talhao?.trim()) {
      alert('Por favor, informe a identificação do talhão/área.');
      return;
    }
    this.novoSensor.data = this.formatarDataHoraAtual();

    // Classifica o novo sensor pela umidade inicial.
    if (this.novoSensor.umidade < 0.25) {
      this.novoSensor.status = 'Crítico';
    } else if (this.novoSensor.umidade < 0.45) {
      this.novoSensor.status = 'Alerta';
    } else {
      this.novoSensor.status = 'Ideal';
    }

    this.leituras.unshift({ ...this.novoSensor, talhao: this.novoSensor.talhao.trim() });
    this.proximoNumeroSensor++;
    this.modalNovoAberto = false;
  }

  // Ações de Modal: Edição
  abrirModalEdicao(sensor: LeituraSolo): void {
    this.sensorEmEdicao = { ...sensor };
    this.modalEdicaoAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEdicaoAberto = false;
  }

  salvarEdicaoSensor(): void {
    const talhao = this.sensorEmEdicao.talhao?.trim();
    if (!talhao) {
      alert('Por favor, informe a identificação do talhão/área.');
      return;
    }

    const idx = this.leituras.findIndex(s => s.id === this.sensorEmEdicao.id);
    if (idx !== -1) {
      this.leituras[idx] = {
        ...this.sensorEmEdicao,
        talhao,
        data: this.formatarDataHoraAtual()
      };
    }
    this.modalEdicaoAberto = false;
  }

  private formatarDataHoraAtual(): string {
    return this.formatarDataHora(new Date());
  }

  private formatarDataHoraEmHorario(horas: number, minutos: number): string {
    const data = new Date();
    data.setHours(horas, minutos, 0, 0);
    return this.formatarDataHora(data);
  }

  private formatarDataHora(data: Date): string {
    return data.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).replace(', ', ' ');
  }

  // Exclusão com confirmação
  excluirSensor(id?: string): void {
    if (!id) return;
    const confirmacao = confirm(`Deseja realmente excluir o sensor ${id}?`);
    if (confirmacao) {
      this.leituras = this.leituras.filter(s => s.id !== id);
    }
  }

  // Estilos dos Badges
  getStatusClass(status?: string): string {
    if (!status) return '';
    const s = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (s === 'ideal') return 'badge-ideal';
    if (s === 'alerta') return 'badge-alerta';
    if (s === 'critico') return 'badge-critico';
    return '';
  }

  private criarSensorVazio(): LeituraSolo {
    return {
      id: '',
      talhao: '',
      cultura: 'Soja',
      n: 0,
      p: 0,
      k: 0,
      umidade: 0.5,
      status: 'Ideal',
      data: ''
    };
  }
}
