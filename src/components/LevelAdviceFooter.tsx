type LevelAdviceFooterProps = {
  message: string;
  visible: boolean;
};

const LevelAdviceFooter: React.FC<LevelAdviceFooterProps> = ({
  message,
  visible,
}) => {
  if (!visible || !message) return null;

  return (
    <footer
      id="level-advice-footer"
      className="md:hidden bg-surface border-t border-foreground/15 px-4 py-3 text-foreground text-base leading-snug text-center select-none shrink-0"
      aria-live="polite"
    >
      {message}
    </footer>
  );
};

export default LevelAdviceFooter;
