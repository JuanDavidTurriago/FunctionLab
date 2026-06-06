import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { cartesianOptions } from './chartConfig';

// Solo se incluyen las iteraciones alcanzadas por el reproductor.
const buildBisectionDatasets = (iterations, step) => {
  const visibleIterations = iterations.slice(0, step);
  const current = visibleIterations.at(-1);

  if (!current) {
    return [];
  }

  return [
    {
      label: 'Puntos medios',
      data: visibleIterations.map((item) => ({ x: item.midpoint, y: item.value })),
      borderColor: '#d97706',
      backgroundColor: '#d97706',
      pointRadius: 5,
      borderWidth: 1.5,
      showLine: true,
    },
    {
      label: 'Limite a',
      data: [
        { x: current.a, y: 0 },
        { x: current.a, y: current.fa },
      ],
      borderColor: '#7c3aed',
      backgroundColor: '#7c3aed',
      borderDash: [6, 4],
      pointRadius: 3,
      showLine: true,
    },
    {
      label: 'Limite b',
      data: [
        { x: current.b, y: 0 },
        { x: current.b, y: current.fb },
      ],
      borderColor: '#7c3aed',
      backgroundColor: '#7c3aed',
      borderDash: [6, 4],
      pointRadius: 3,
      showLine: true,
    },
  ];
};

const buildNewtonDatasets = (iterations, step) => {
  const visibleIterations = iterations.slice(0, step);
  const current = visibleIterations.at(-1);

  if (!current) {
    return [];
  }

  return [
    {
      label: 'Aproximaciones sobre f(x)',
      data: visibleIterations.map((item) => ({ x: item.x, y: item.fx })),
      borderColor: '#d97706',
      backgroundColor: '#d97706',
      pointRadius: 5,
      showLine: false,
    },
    {
      label: 'Aproximaciones en el eje x',
      data: visibleIterations.map((item) => ({ x: item.next, y: 0 })),
      borderColor: '#1d4ed8',
      backgroundColor: '#1d4ed8',
      pointStyle: 'rectRot',
      pointRadius: 5,
      showLine: false,
    },
    {
      label: `Tangente iteracion ${current.iteration}`,
      // La recta une (x_n, f(x_n)) con el siguiente corte sobre el eje x.
      data: [
        { x: current.x, y: current.fx },
        { x: current.next, y: 0 },
      ],
      borderColor: '#7c3aed',
      backgroundColor: '#7c3aed',
      borderDash: [6, 4],
      borderWidth: 2,
      pointRadius: 3,
      showLine: true,
    },
  ];
};

export default function RootIterationChart({ method, result }) {
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const total = result.iterations.length;

  useEffect(() => {
    // Un resultado nuevo siempre comienza desde su primera iteracion.
    setStep(1);
    setPlaying(false);
  }, [result]);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    // El temporizador avanza la construccion grafica hasta la ultima iteracion.
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= total) {
          setPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [playing, total]);

  if (total === 0) {
    // Biseccion puede terminar sin iterar si un extremo ya es una raiz exacta.
    const data = {
      datasets: [
        {
          label: 'f(x)',
          data: result.chart.functionPoints,
          borderColor: '#0f766e',
          backgroundColor: '#0f766e',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.08,
        },
        {
          label: 'Raiz exacta en el extremo',
          data: [{ x: result.root, y: 0 }],
          borderColor: '#b91c1c',
          backgroundColor: '#b91c1c',
          pointRadius: 6,
          showLine: false,
        },
      ],
    };

    return (
      <div className="chart-frame">
        <Line data={data} options={cartesianOptions} />
      </div>
    );
  }

  const methodDatasets =
    method === 'bisection'
      ? buildBisectionDatasets(result.iterations, step)
      : buildNewtonDatasets(result.iterations, step);

  const data = {
    // La curva base permanece fija y se superponen los elementos del metodo.
    datasets: [
      {
        label: 'f(x)',
        data: result.chart.functionPoints,
        borderColor: '#0f766e',
        backgroundColor: '#0f766e',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      ...methodDatasets,
      {
        label: 'Raiz aproximada',
        data: [{ x: result.root, y: 0 }],
        borderColor: '#b91c1c',
        backgroundColor: '#b91c1c',
        pointRadius: 6,
        showLine: false,
      },
    ],
  };

  return (
    <div className="iteration-visualizer">
      <div className="chart-toolbar">
        <button
          className="icon-button"
          type="button"
          title="Iteracion anterior"
          aria-label="Iteracion anterior"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          disabled={step === 1}
        >
          &lt;
        </button>
        <button
          className="play-button"
          type="button"
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          className="icon-button"
          type="button"
          title="Siguiente iteracion"
          aria-label="Siguiente iteracion"
          onClick={() => setStep((current) => Math.min(total, current + 1))}
          disabled={step === total}
        >
          &gt;
        </button>
        <span className="iteration-counter">
          Iteracion {step} de {total}
        </span>
      </div>
      <input
        className="iteration-slider"
        type="range"
        min="1"
        max={total}
        value={step}
        onChange={(event) => {
          setPlaying(false);
          setStep(Number(event.target.value));
        }}
        aria-label="Seleccionar iteracion"
      />
      <div className="chart-frame">
        <Line data={data} options={cartesianOptions} />
      </div>
    </div>
  );
}
