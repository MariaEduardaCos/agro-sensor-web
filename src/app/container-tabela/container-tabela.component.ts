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
  dataAtual: string = '04/11/2026';

  Math = Math;

  // Filtros de busca
  termoBusca: string = '';
  filtroStatus: string = 'todos';

  // Coleção de leituras dos sensores (Mock baseado no protótipo Figura 1)
  leituras: LeituraSolo[] = [
    {
      id: 'SNS-001',
      talhao: 'Talhão 12 - Norte',
      cultura: 'Soja',
      n: 165,
      p: 120,
      k: 148,
      umidade: 0.62,
      status: 'Ideal',
      data: '2026-11-04 11:45'
    },
    {
      id: 'SNS-002',
      talhao: 'Talhão 04 - Sul',
      cultura: 'Milho',
      n: 118,
      p: 85,
      k: 95,
      umidade: 0.38,
      status: 'Alerta',
      data: '2026-11-04 11:30'
    },
    {
      id: 'SNS-003',
      talhao: 'Talhão 08 - Leste',
      cultura: 'Algodão',
      n: 70,
      p: 54,
      k: 68,
      umidade: 0.18,
      status: 'Crítico',
      data: '2026-11-04 11:15'
    },
    {
      id: 'SNS-004',
      talhao: 'Talhão 15 - Oeste',
      cultura: 'Soja',
      n: 155,
      p: 115,
      k: 130,
      umidade: 0.58,
      status: 'Ideal',
      data: '2026-11-04 11:00'
    },
    {
      id: 'SNS-005',
      talhao: 'Talhão 02 - Central',
      cultura: 'Sorgo',
      n: 95,
      p: 75,
      k: 88,
      umidade: 0.32,
      status: 'Alerta',
      data: '2026-11-04 10:45'
    }
  ];

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
    const proximoNumero = (this.leituras.length + 1).toString().padStart(3, '0');
    this.novoSensor = {
      id: `SNS-${proximoNumero}`,
      talhao: '',
      cultura: 'Soja',
      n: 140,
      p: 100,
      k: 120,
      umidade: 0.50,
      status: 'Ideal',
      data: new Date().toISOString().replace('T', ' ').substring(0, 16)
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
    // Determina o status caso o usuário não tenha escolhido explicitamente
    if (this.novoSensor.umidade < 0.25) {
      this.novoSensor.status = 'Crítico';
    } else if (this.novoSensor.umidade < 0.45) {
      this.novoSensor.status = 'Alerta';
    } else {
      this.novoSensor.status = 'Ideal';
    }

    this.leituras.unshift({ ...this.novoSensor });
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
    const idx = this.leituras.findIndex(s => s.id === this.sensorEmEdicao.id);
    if (idx !== -1) {
      // Atualização automática ou manual do status
      if (this.sensorEmEdicao.umidade < 0.25) {
        this.sensorEmEdicao.status = 'Crítico';
      } else if (this.sensorEmEdicao.umidade < 0.45) {
        this.sensorEmEdicao.status = 'Alerta';
      } else {
        this.sensorEmEdicao.status = 'Ideal';
      }

      this.leituras[idx] = { ...this.sensorEmEdicao };
    }
    this.modalEdicaoAberto = false;
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
