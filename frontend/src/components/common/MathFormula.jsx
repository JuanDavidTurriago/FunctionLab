import { MathJax } from 'better-react-mathjax';

export default function MathFormula({
  latex,
  display = false,
  className = '',
  ariaLabel,
}) {
  if (!latex) {
    return null;
  }

  const classes = [
    'math-render',
    display ? 'math-render-display' : 'math-render-inline',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const expression = display ? `\\[${latex}\\]` : `\\(${latex}\\)`;

  return (
    <span className={classes} aria-label={ariaLabel}>
      <MathJax inline={!display} dynamic hideUntilTypeset="first">
        {expression}
      </MathJax>
    </span>
  );
}
