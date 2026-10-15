import BootScreen from './BootScreen';

/**
 * Preloader wrapper maintaining backward-compatibility
 * while executing the authentic SAQUIB OS cinematic boot sequence.
 */
export default function Preloader({ onComplete }) {
  return <BootScreen onComplete={onComplete} />;
}
