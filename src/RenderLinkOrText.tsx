
// renders a link if it is found to be a link or text if it is not a link.
export const RenderLinkOrText = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value) return null;
  
  const isValidUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <strong>{label}</strong>
      {isValidUrl(value) ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="link">{value}</a>
      ) : (
        value
      )}
    </div>
  );
};
